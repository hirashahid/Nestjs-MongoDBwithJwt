import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.model";
import { UsersController } from "./users.controller";
import { UsersServices } from "./users.service";

@Module({
    imports: [
        JwtModule.register(
            {
                secret: 'secret',
                signOptions: { expiresIn: '1d' }
            }
        ),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    controllers: [UsersController],
    providers: [UsersServices],
})

export class UsersModule { }
