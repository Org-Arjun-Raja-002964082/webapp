import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { DocumentsModule } from './documents/documents.module';
import entities from '../typeorm_entities';
import { WinstonModule } from 'nest-winston';
import { TestingModule } from './testing/testing.module';
import { TestingService } from './testing/testing.service';
import { AwssnsModule } from './awssns/awssns.module';
import { AwsdynamoModule } from './awsdynamo/awsdynamo.module';
import * as winston from 'winston';
import * as CloudWatchTransport from 'winston-cloudwatch';

const options = {
  console: {
    level: 'verbose',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
};
@Module({
  imports: [
  HttpModule.registerAsync({
  useFactory: () => ({
      timeout: 5000,
      maxRedirects: 5,
    }),
  }), 
  AuthModule, 
  UsersModule,
  ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'postgres',
      host:  configService.get('DB_HOST'),
      port:   configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: entities,
      synchronize: true, // remove this in production
    }),
    inject: [ConfigService],
  }),
  WinstonModule.forRoot({
    format: winston.format.uncolorize(),
    transports: [
      new winston.transports.Console(options.console),
      new CloudWatchTransport({
        name: 'Cloudwatch Logs',
        logGroupName: "csye6225",
        logStreamName: "webapp",
        awsRegion: "us-east-1",
        retentionInDays: 2,
      }),
    ],

  }),
  DocumentsModule,
  TestingModule,
  AwssnsModule,
  AwsdynamoModule
],
  controllers: [AppController],
  providers: [AppService, Logger, TestingService],
})
export class AppModule {}
