import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateUserInput } from './dtos/create.input';
import { UpdateUserInput } from './dtos/update.input';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput) {
    const createdUser = new this.userModel(createUserInput);
    return await createdUser.save();
  }

  async updateById(
    id: MongooseSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    return await this.userModel.findByIdAndUpdate(id, updateUserInput, {
      new: true,
    });
  }

  async deleteById(id: MongooseSchema.Types.ObjectId) {
    return await this.userModel.findByIdAndDelete(id, {
      new: true,
    });
  }

  async findAll() {
    throw new BadRequestException('TESTESTESTSETEST!!');
    return await this.userModel.find();
  }

  async findOneById(id: MongooseSchema.Types.ObjectId) {
    return await this.userModel.findById(id);
  }
}
