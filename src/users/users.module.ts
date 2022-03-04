import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "src/auth/auth.module";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { LocalStrategy } from "src/auth/local.strategy";
import { UserSchema } from "./user.model";
import { UsersController } from "./users.controller";
import { UsersServices } from "./users.service";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        JwtModule.register(
            {
                secret: 'secret',
                signOptions: { expiresIn: '1d' }
            }
        ),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    controllers: [UsersController],
    providers: [UsersServices, LocalStrategy, JwtStrategy],
    exports: [UsersServices],
})

export class UsersModule { }
