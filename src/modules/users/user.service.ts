import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { encryptPassword } from 'src/libs/utils';
import { CreateUserInput } from './dtos/create.input';
import { UpdateUserInput } from './dtos/update.input';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create({ email, password, name }: CreateUserInput) {
    const hasUser = await this.userModel.findOne({
      email,
    });
    if (hasUser) {
      throw new BadRequestException('Email is already registered.');
    }

    const createdUser = new this.userModel({
      email,
      password: encryptPassword(password),
      name,
    });
    return await createdUser.save();
  }

  async updateById(
    id: MongooseSchema.Types.ObjectId,
    { name, password }: UpdateUserInput,
  ) {
    const hasUser = await this.userModel.findById(id);
    if (!hasUser) {
      throw new BadRequestException('Id does not exist.');
    }

    return await this.userModel.findByIdAndUpdate(
      id,
      { name, password: encryptPassword(password) },
      {
        new: true,
      },
    );
  }

  async deleteById(id: MongooseSchema.Types.ObjectId) {
    const hasUser = await this.userModel.findById(id);
    if (!hasUser) {
      throw new BadRequestException('Id does not exist.');
    }

    return await this.userModel.findByIdAndDelete(id, {
      new: true,
    });
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOneById(id: MongooseSchema.Types.ObjectId) {
    const hasUser = await this.userModel.findById(id);
    if (!hasUser) {
      throw new BadRequestException('Id does not exist.');
    }

    return await this.userModel.findById(id);
  }
}
