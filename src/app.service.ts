import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';


@Injectable()
export class AppService {
  constructor() {}
  
  async getHealthz() {
    // this.logger.log('Healthz called - returning 200 OK');
    return {status : "200 OK"};
  }
}
