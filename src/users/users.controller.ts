import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { UsersServices } from "./users.service";


import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersServices) { }

    @Post()
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

    @Get(':id')
    getUser(@Param('id') userId: string) {
        return this.usersService.getSingleUser(userId);
    }

    @Patch(':id')
    async updateUser(
        @Param('id') userId: string,
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        await this.usersService.updateUser(userId, userEmail, userPassword);
        return null;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') userId: string,) {
        await this.usersService.deleteUser(userId);
        return null;
    }

}