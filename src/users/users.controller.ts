import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe, Request, Query } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('v1/account')
export class UsersController {
    constructor(private readonly userService: UsersService) {}


    
    @UseGuards(AuthGuard)
    @Get(':id')
    async findOneById(@Request() req, @Param('id', ParseIntPipe) id: number) { // this is a dummy function
        return await this.userService.findUsersById(id, req.user);
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

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createUserDto: CreateUserDto) { // this is a dummy function
        return await this.userService.createUser(createUserDto);;
    }


    @Get('verify')
    async verifyUser(@Query() queryData) {
         // this is a dummy function
        return await this.userService.verifyUser(queryData.email, queryData.token);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(): string { // this is a dummy function
        return 'This action returns all users';
    }
}
