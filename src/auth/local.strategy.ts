import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super(); // config 
    }

    async validate(userEmail: string, userPassword: string): Promise<any> {
        const user = await this.authService.validateUser(userEmail, userPassword);

        if (!user) {
            throw new NotFoundException('Could not find user, at Local');
        }

        return user;
    }
}