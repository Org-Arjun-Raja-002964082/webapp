import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  initial() {
    return {status : "200 OK - hello world"};
  }

  @Get('/healthz')
  healthz() {
    return {status : "200 OK"};
  }

  @UseGuards(AuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
