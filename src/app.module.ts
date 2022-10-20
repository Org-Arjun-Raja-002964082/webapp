import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import entities from '../typeorm_entities';

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
      host:  'localhost',
      port:   5432,
      username: 'postgres',
      password: 'admin',
      database: 'webapp_db',
      entities: entities,
      synchronize: true, // remove this in production
    }),
    inject: [ConfigService],
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
