import { Controller, Post, Body, Get, Patch, Delete, UseGuards, forwardRef, Inject } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

import { UsersServices } from "./users.service";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { LocalStrategy } from "src/auth/local.strategy";


@Controller('users')
export class UsersController extends PassportStrategy(Strategy) {

    constructor(
        private readonly usersService: UsersServices,
        private localStrategy: LocalStrategy) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }

    @Post('register')
    async addUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        const generatedId = await this.usersService.insertUser(userEmail, hashedPassword);
        return { id: generatedId };
    }

    @Get()
    async getAllUsers() {
        return await this.usersService.getUsers();
    }

    @UseGuards(LocalAuthGuard)
    @Get('/login')
    async getUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        return await this.usersService.findUser(userEmail, userPassword);
    }

    @Patch()
    async updateUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
    ) {
        await this.usersService.updateUser(userEmail, userPassword);
        return null;
    }

    @Delete()
    async deleteProduct(@Body('email') userEmail: string,) {
        await this.usersService.deleteUser(userEmail);
        return null;
    }

}