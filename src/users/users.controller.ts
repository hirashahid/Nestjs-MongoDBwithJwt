import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { UsersServices } from "./users.service";


import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersServices) { }

    @Post('register')
    async addUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        // insertProduct also returning a promise
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        const generatedId = await this.usersService.insertUser(
            userEmail,
            hashedPassword);

        return { id: generatedId };
    }

    @Get()
    async getAllUsers() {
        return await this.usersService.getUsers();
    }

    @Get(':email')
    getUser(@Param('email') userEmail: string) {
        return this.usersService.getSingleUser(userEmail);
    }

    @Patch(':email')
    async updateUser(
        @Param('email') Email: string,
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        await this.usersService.updateUser(Email, userEmail, userPassword);
        return null;
    }

    @Delete(':email')
    async deleteProduct(@Param('email') userEmail: string,) {
        await this.usersService.deleteUser(userEmail);
        return null;
    }

}