import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @IsOptional()
    @MinLength(8)
    password: string;

    @IsOptional()
    first_name: string;

    @IsOptional()
    last_name: string;
}