import { Module, Logger} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnsProvider } from '../providers/snsProvider';
import { DynamoDbProvider } from 'src/providers/dynamoDbProvider';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  providers: [UsersService, AuthGuard, AuthService, ConfigService, SnsProvider, DynamoDbProvider],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
