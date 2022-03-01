import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersServices } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersServices) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findUser(email, password);
        if (user) {
            const { email, password, ...rest } = user;
            return user;
        }
        if (!user) {
            throw new NotFoundException('Could not find user, at Auth');
        }

        return null;
    }

}
