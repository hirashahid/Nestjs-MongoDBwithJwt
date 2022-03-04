import { Controller, Post, Body, Get, Patch, Delete, Request, UseGuards } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { UsersServices } from "./users.service";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersServices, private authService: AuthService) { }

    @Post('/register')
    async addUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        const generatedId = await this.usersService.insertUser(userEmail, hashedPassword);
        return { id: generatedId };
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        console.log(req.body)
        return this.authService.login(req.body);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers() {
        return await this.usersService.getUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return `hello: ${req.user.email}`;
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        await this.usersService.updateUser(userEmail, userPassword);
        return null;
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteProduct(@Body('email') userEmail: string,) {
        await this.usersService.deleteUser(userEmail);
        return null;
    }

}
