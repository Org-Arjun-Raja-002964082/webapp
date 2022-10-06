import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}


    
    @UseGuards(AuthGuard)
    @Get(':id')
    async findOneById(@Param('id', ParseIntPipe) id: number) { // this is a dummy function
        return await this.userService.findUsersById(id);
    }

    @UseGuards(AuthGuard)
    @Get('username/:username')
    async findOneByUsername(@Param('username') username: string) { // this is a dummy function
        return await this.userService.findOne(username);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Request() req , @Body() updateUserDto : UpdateUserDto, @Param('id') id: string) { // this is a dummy function
        return await this.userService.update(updateUserDto, req.user, id);
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async create(@Body() createUserDto: CreateUserDto) { // this is a dummy function
        return await this.userService.createUser(createUserDto);;
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(): string { // this is a dummy function
        return 'This action returns all users';
    }
}
