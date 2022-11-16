import { Module } from '@nestjs/common';
import  AwssnsService  from './awssns.service';

@Module({
  providers: [AwssnsService],
  exports: [AwssnsService]
})
export class AwssnsModule {}
