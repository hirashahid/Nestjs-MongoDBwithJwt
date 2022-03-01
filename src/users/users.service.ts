import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'
import { User } from "./user.model";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersServices {
    private users: User[] = [];
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async insertUser(email: string, password: string) {
        const newUser = new this.userModel({
            email,
            password,
        });
        const user = await newUser.save();
        return user.id as string;

    }

    async getUsers(): Promise<any> {
        const users = await this.userModel.find().exec();
        return users.map((user) => ({
            id: user.id,
            email: user.email,
            password: user.password,
        }));
    }

    async getSingleUser(email: string, password: string) {
        const user = await this.findUser(email, password);
        //const jwt = await this.jwtService.signAsync({ id: user.id });
        const payload = { email: user.email, sub: user.id };
        return {
            id: user.id,
            email: user.email,
            access_token: this.jwtService.sign(payload),
        }
    }

    async updateUser(userEmail: string, password: string) {
        const updatedUser = await this.updateSingleUser(userEmail, password);
        updatedUser.save();
    }

    async deleteUser(userEmail: string) {
        const result = await this.userModel.deleteOne({ email: userEmail }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Could not find user');
        }
    }

    private async updateSingleUser(email: string, password: string): Promise<User> {
        let user;
        try {
            user = await this.userModel.findOne({ email }).exec();
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 12);
                user.password = hashedPassword;
            }
        } catch (error) {
            throw new NotFoundException('Could not find user');
        }
        return user;
    }


    async findUser(email: string, password: string): Promise<User> {
        let user;
        try {
            user = await this.userModel.findOne({ email }).exec();
            if (!await bcrypt.compare(password, user.password)) {
                throw new NotFoundException('Password incorrect');
            }
        } catch (error) {
            throw new NotFoundException('Could not find user');
        }
        return user;
    }
}