import { Controller, Post, Body, Get, Param, Patch, Delete, Res, Req } from "@nestjs/common";
import { UsersServices } from "./users.service";
import { Response, Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';


@Controller('users')
export class UsersController extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersServices) {
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
        @Res({ passthrough: true }) response: Response
    ) {
        // insertProduct also returning a promise
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        const generatedId = await this.usersService.insertUser(userEmail, hashedPassword);
        return { id: generatedId };
    }

    @Get()
    async getAllUsers() {
        return await this.usersService.getUsers();
    }

    @Get('/login/')
    async getUser(
        @Body('email') userEmail: string,
        @Body('password') userPassword: string,
        @Res({ passthrough: true }) response: Response,) {

        return this.usersService.getSingleUser(userEmail, userPassword, response);
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