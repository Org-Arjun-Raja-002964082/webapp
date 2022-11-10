import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if(user){
      const isMatch = await bcrypt.compare(pass, user.password);
      if(isMatch){
        const { password, ...result } = user;
        this.logger.log('info','User validated');
        return result;
      }
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return null;
  }
}
