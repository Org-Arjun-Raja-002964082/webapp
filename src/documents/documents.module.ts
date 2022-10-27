import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Document } from './entities/document.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    ConfigModule,
    UsersModule
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, AuthService]
})
export class DocumentsModule {}
