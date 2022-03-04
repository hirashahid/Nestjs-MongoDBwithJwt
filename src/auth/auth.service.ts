import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersServices } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersServices,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        console.log('at auth');
        const user = await this.usersService.findUser(email, password);
        if (!user) {
            throw new NotFoundException('Could not find user at Auth');
        }
        return user;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.password };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}