import { Injectable, NotFoundException } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'
import { User } from "./user.model";

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersServices {
    private users: User[] = [];

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async insertUser(email: string, password: string) {
        const newUser = new this.userModel({
            email,
            password,
        });
        // SAVE() provided by mongoose to save the data, and it returns promise
        const user = await newUser.save();
        // result contains the whole object having all product properties.
        return user.id as string;
    }

    async getUsers(): Promise<any> {
        //find() use to find the data
        //exec(), gives a real promise
        const users = await this.userModel.find().exec();
        return users.map((user) => ({
            id: user.id,
            email: user.email,
            password: user.password,
        }));
    }

    async getSingleUser(email: string, password: string) {
        const user = await this.findUser(email, password);
        return {
            id: user.id,
            email: user.email,
            password: user.password,
        }
    }

    async updateUser(userEmail: string, email: string, password: string) {
        const updatedUser = await this.findUser(userEmail, password);
        if (email) {
            updatedUser.email = email;
        }
        if (password) {
            updatedUser.password = password;
        }
        updatedUser.save();
    }

    async deleteUser(userEmail: string) {
        const result = await this.userModel.deleteOne({ email: userEmail }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Could not find user');
        }
    }

    private async findUser(email: string, password: string): Promise<User> {
        let user;
        try {
            user = await this.userModel.findOne({ email }).exec();
            if (!await bcrypt.compare(password, user.password)) {
                throw new NotFoundException('Could not find user');
            }
        } catch (error) {
            throw new NotFoundException('Could not find user');
        }
        if (!user) {
            throw new NotFoundException('Could not find user');
        }
        return user;
    }
}