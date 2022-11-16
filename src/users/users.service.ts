import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
var lynx = require('lynx');
const statsd = new lynx('localhost', 8125);
import  AwssnsService  from 'src/awssns/awssns.service';
import  AwsdynamoService  from 'src/awsdynamo/awsdynamo.service';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly awsProviderService: AwssnsService,
    private readonly awsDynamoService: AwsdynamoService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    statsd.increment('POST/v1/account');
    const timer = statsd.createTimer('POST/v1/account');
    const prevUser = await this.userRepository.findOne({
      where: { username: createUserDto.username }
    });
    if(prevUser) {
      this.logger.log('info','User already exists');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'User already exists',
      }, HttpStatus.BAD_REQUEST);
    }
    createUserDto.password = await this.getHashedPassword(createUserDto.password);
    const newUser = this.userRepository.create(createUserDto);
    try {
      // Add user access token to dynamo db
      this.logger.info("Adding user " + newUser.username + " to dynamo db");
      const userToken = await this.awsDynamoService.addUserToken(newUser.username);

      // Send a message to Amazon SNS
      this.logger.info("Sending message to Amazon SNS");
      const message = {
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        userToken: userToken,
        message_type: "verify_user",
      };
      await this.awsProviderService.publishMessage(JSON.stringify(message));

      // store the user in the db and return the user
      this.logger.info("Storing user " + newUser.username + " in db");
      const {password, ...response } = await this.userRepository.save(newUser);
      timer.stop();
      return  response;
    } catch (error) {
      this.logger.error("Error creating user: " + error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error creating user',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUsersById(id: number, req_user: any) {
    statsd.increment('GET/v1/account/{id}');
    let user_param_id = id;
    if(user_param_id != req_user.id) {
      this.logger.log('info','Unauthorized user');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'You cannot access another user',
      }, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ 
      where: { id },
     });
    if(!user) {
      this.logger.log('info','User not found');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'User does not exist',
      }, HttpStatus.BAD_REQUEST);
    }
    const {password, ...response } = user;
    return response;
  }

  async findOne(username: string): Promise<User | undefined> {
    this.logger.log('info','Finding user');
    return await this.userRepository.findOne({
      where: { username: username }
    });
  }

  async update(updateUserDto: UpdateUserDto, user: any, id: string) {
    statsd.increment('PUT/v1/account/{id}');
    const timer = statsd.createTimer('PUT/v1/account/{id}');
    let user_param_id = parseInt(id);
    if(user_param_id != user.id) {
      this.logger.log('info','Unauthorized user');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'You cannot update another user',
      }, HttpStatus.BAD_REQUEST);
    }
    let cleanedDto = this.clean(updateUserDto);
    if (Object.keys(cleanedDto).length === 0){
      this.logger.log('info','No fields to update');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'No fields to update',
      }, HttpStatus.BAD_REQUEST);
    }

    if(this.hasForUnknownFields(cleanedDto)) {
      this.logger.log('info','Unknown fields');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad fields to update',
      }, HttpStatus.BAD_REQUEST);
    }

    if(cleanedDto.password) {
      cleanedDto.password = await this.getHashedPassword(cleanedDto.password);
    }
    timer.stop();
    return await this.userRepository.update(user.id, cleanedDto);
  }

  async getHashedPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
  }

  hasForUnknownFields(updateUserDto) {
    for (var propName in updateUserDto) {
      if (!['password', 'first_name', 'last_name'].includes(propName)) {
        return true;
      }
    }
    return false;
  }

  clean(updateUserDto: UpdateUserDto) {
    for (var propName in updateUserDto) {
      if (updateUserDto[propName] === null || updateUserDto[propName] === undefined || updateUserDto[propName] === '') {
        delete updateUserDto[propName];
      }
    }
    return updateUserDto
  }

  async verifyUser(username: string, userToken: string) {
    statsd.increment('POST/v1/account/verify');
    const isValid = await this.awsDynamoService.verifyUserToken(username, userToken);
    if (isValid) {
      this.logger.info("Email and token are valid");
      this.logger.info("Updating user details in MySQL database");
      const user = await this.findOne(username);
      if (user) {
        user.isVerified = true;
        user.verified_at = new Date();
        try {
          await this.userRepository.update(user.id, user);
        } catch (err) {
          this.logger.error(err);
          throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error creating user',
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.logger.info("Email verified successfully");
      }
      return {
          message: "Email verified successfully",
      }
    } else {
      this.logger.info("Email or token is invalid");
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Email or token is invalid',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
