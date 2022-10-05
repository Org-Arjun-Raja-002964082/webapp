

// /**
//  * All strategies have a name which, by convention, 
//  * corresponds to the package name according to the pattern passport-{name}. 
//  * For instance, 
//  * the LocalStrategy configured above is named local as it is distributed in the passport-local package.
//  */
// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super();
//   }

//   async validate(username: string, password: string): Promise<any> {
//     console.log("username", username,"password", password);
//     const user = await this.authService.validateUser(username, password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }