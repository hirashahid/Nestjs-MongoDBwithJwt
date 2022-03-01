import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from 'src/users/user.model';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersServices } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [PassportModule, forwardRef(() => UsersModule),
        JwtModule.register(
            {
                secret: 'secret',
                signOptions: { expiresIn: '1d' }
            }
        ),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [AuthService, LocalStrategy, UsersServices],
    controllers: [UsersController],
})


export class AuthModule { }
