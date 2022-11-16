import { Module } from '@nestjs/common';
import  AwsdynamoService  from './awsdynamo.service';

@Module({
  providers: [AwsdynamoService],
  exports: [AwsdynamoService]
})
export class AwsdynamoModule {}
