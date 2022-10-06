// import { Repository, EntityRepository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ProductRepository extends Repository<Product> {

//   public async createUser(
//     createUserDto: CreateUserDto,
//   ): Promise<User> {
//     const { email, password, firstName, lastName } = createUserDto;

//     const user = new User();
//     user.email = email;
//     user.password = password;
//     user.firstName = firstName;
//     user.lastName = lastName;

//     await user.save();
//     return user;
//   }

//   public async editUser(
//     createUserDto: CreateUserDto,
//     editedUser: User,
//   ): Promise<User> {
//     const { name, description, price } = createUserDto;

//     editedUser.name = name;
//     editedUser.description = description;
//     editedUser.price = price;
//     await editedUser.save();

//     return editedUser;
//   }
// }