import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService
  ) {}

  @Get()
  initial() {
    return {status : "200 OK - hello world"};
  }

  @Get('/healthz')
  healthz() {
    return this.appService.getHealthz();
  }

  @UseGuards(AuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
