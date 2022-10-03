import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
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
    let combinedString = Buffer.from(request.headers.authorization.split(" ")[1], 'base64').toString();
    console.log('combinedString: ', combinedString);
    let splitString = combinedString.split(":");
    console.log('splitString: ', splitString);
    let username = splitString[0];
    let password = splitString[1];
    const user = await this.authService.validateUser(username, password);
    console.log('user: ', user);
    if (user) {
      request.user = user;
      return true;
    }
    // console.log('request: ', request.headers);
    // decode base64 bit here and find username and password
    // send username and password to authService
    // if authService returns user, then return true
    return false;
  }  
}