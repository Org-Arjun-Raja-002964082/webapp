import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
// import {
//   utilities as nestWinstonModuleUtilities,
//   WinstonModule,
// } from 'nest-winston';
// import * as winston from 'winston';
// import CloudWatchTransport from 'winston-cloudwatch';


// const options = {
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     json: false,
//     colorize: true,
//     timestamp: true,
//   },
// };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  // app.useLogger(
  //   WinstonModule.createLogger({
  //     format: winston.format.uncolorize(),
  //     transports: [
  //       new winston.transports.Console(options.console),
  //       new CloudWatchTransport({
  //         name: 'Cloudwatch Logs',
  //         logGroupName: "csye6225",
  //         logStreamName: "webapp",
  //         awsRegion: "us-east-1",
  //         retentionInDays: 2,
  //       }),
  //     ],
  //   }),
  // );

  config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY') ,
      secretAccessKey: configService.get('AWS_ACCESS_SECRET'),
      region: configService.get('AWS_REGION'),
  });
  await app.listen(3000);
}
bootstrap();