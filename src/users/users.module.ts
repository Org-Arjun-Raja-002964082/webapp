import { Module, Logger} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwssnsModule } from 'src/awssns/awssns.module';
import  AwssnsService  from 'src/awssns/awssns.service';
import { AwsdynamoModule } from 'src/awsdynamo/awsdynamo.module';
import  AwsdynamoService  from 'src/awsdynamo/awsdynamo.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    AwssnsModule,
    AwsdynamoModule
  ],
  providers: [UsersService, AuthGuard, AuthService, ConfigService, AwssnsService, AwsdynamoService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
