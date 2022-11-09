import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const prevUser = await this.userRepository.findOne({
      where: { username: createUserDto.username }
    });
    if(prevUser) {
      // this.logger.log('User already exists');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'User already exists',
      }, HttpStatus.BAD_REQUEST);
    }
    createUserDto.password = await this.getHashedPassword(createUserDto.password);
    const newUser = this.userRepository.create(createUserDto);
    const {password, ...response } = await this.userRepository.save(newUser);
    return  response;
  }

  async findUsersById(id: number, req_user: any) {
    let user_param_id = id;
    if(user_param_id != req_user.id) {
      // this.logger.log('Unauthorized user');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'You cannot access another user',
      }, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ 
      where: { id },
     });
    if(!user) {
      // this.logger.log('User not found');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'User does not exist',
      }, HttpStatus.BAD_REQUEST);
    }
    const {password, ...response } = user;
    return response;
  }

  async findOne(username: string): Promise<User | undefined> {
    // this.logger.log('Finding user');
    return await this.userRepository.findOne({
      where: { username: username }
    });
  }

  async update(updateUserDto: UpdateUserDto, user: any, id: string) {
    let user_param_id = parseInt(id);
    if(user_param_id != user.id) {
      // this.logger.log('Unauthorized user');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'You cannot update another user',
      }, HttpStatus.BAD_REQUEST);
    }
    let cleanedDto = this.clean(updateUserDto);
    if (Object.keys(cleanedDto).length === 0){
      // this.logger.log('No fields to update');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'No fields to update',
      }, HttpStatus.BAD_REQUEST);
    }

    if(this.hasForUnknownFields(cleanedDto)) {
      // this.logger.log('Unknown fields');
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Bad fields to update',
      }, HttpStatus.BAD_REQUEST);
    }

    if(cleanedDto.password) {
      cleanedDto.password = await this.getHashedPassword(cleanedDto.password);
    }
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
}
