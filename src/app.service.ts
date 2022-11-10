import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
var lynx = require('lynx');
// import { HttpService } from '@nestjs/axios';


@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  
  async getHealthz() {
    const statsd = new lynx('localhost', 8125);
    statsd.increment('GET/healthz');
    this.logger.log('info', 'Healthz called - returning 200 OK');
    return {status : "200 OK"};
  }
}
