import { Injectable, Logger } from '@nestjs/common';
var lynx = require('lynx');
// import { HttpService } from '@nestjs/axios';


@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
  ) {}
  
  async getHealthz() {
    const statsd = new lynx('localhost', 8125);
    statsd.increment('healthz');
    this.logger.log('Healthz called - returning 200 OK');
    return {status : "200 OK"};
  }
}
