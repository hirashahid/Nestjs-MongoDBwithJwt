import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    MongooseModule.forRoot('mongodb+srv://hira:CbqJtNi9NvbRNcMl@cluster0.pwsom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    JwtModule.register(
      {
        secret: 'secret',
        signOptions: { expiresIn: '1d' }
      }
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
