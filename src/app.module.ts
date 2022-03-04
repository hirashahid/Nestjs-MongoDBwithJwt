import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb+srv://hira:CQf61hLUgTsmHASx@cluster0.pwsom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule { }
