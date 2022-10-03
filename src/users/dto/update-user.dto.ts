import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateBuserDto extends PartialType(CreateUserDto) {}