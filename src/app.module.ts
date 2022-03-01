import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersServices } from './users/users.service';
import { UserSchema } from './users/user.model';
import { LocalStrategy } from './auth/local.strategy';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb+srv://hira:786786786@cluster0.pwsom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    JwtModule.register(
      {
        secret: 'secret',
        signOptions: { expiresIn: '1d' }
      }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])

  ],
  controllers: [AppController, UsersController],
  providers: [AppService, AuthService, UsersServices, LocalStrategy],
})
export class AppModule { }
