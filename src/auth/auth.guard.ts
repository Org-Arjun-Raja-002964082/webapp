import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {

    }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if(!request.headers.authorization){
        return false;
    }
    let combinedString = Buffer.from(request.headers.authorization.split(" ")[1], 'base64').toString();
    if(combinedString == null || combinedString == ""){
        return false;
    }
    let splitString = combinedString.split(":");
    let username = splitString[0];
    let password = splitString[1];
    const user = await this.authService.validateUser(username, password);
    if (user) {
      request.user = user;
      return true;
    }
    // decode base64 bit here and find username and password
    // send username and password to authService
    // if authService returns user, then return true
    throw new HttpException({
      status: HttpStatus.UNAUTHORIZED,
      error: 'Credentials are not valid',
    }, HttpStatus.UNAUTHORIZED);
  }  
}