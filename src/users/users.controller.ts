import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    @Get()
    findAll(): string { // this is a dummy function
        return 'This action returns all users';
    }

    @Get(':id')
    findOne(): string { // this is a dummy function
        return 'This action returns a user';
    }

    @Put(':id')
    update(): string { // this is a dummy function
        return 'This action updates a user';
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): string { // this is a dummy function
        return 'This action adds a new user';
    }

}
