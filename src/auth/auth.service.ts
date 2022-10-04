import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // add bcrypt logic here
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(pass, salt);
    const user = await this.usersService.findOne(username);
    if(user){
      const isMatch = await bcrypt.compare(user.password, hashedPass);
      if(isMatch){
        const { password, ...result } = user;
        return result;
      }
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return null;
  }
}
