import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthz')
  healthz() {
    return;
  }

  @Get('/external')
  async external(): Promise<any> {
    return await this.appService.external();
  } 
}
