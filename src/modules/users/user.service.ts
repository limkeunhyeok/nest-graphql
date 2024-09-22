import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import {
  EMAIL_IS_ALREADY_REGISTERED,
  ID_DOES_NOT_EXIST,
} from 'src/constants/exception-message.const';
import { encryptPassword } from 'src/libs/utils';
import { CreateUserInput } from './dtos/create.input';
import { UpdateUserInput } from './dtos/update.input';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create({
    email,
    password,
    name,
    role,
  }: CreateUserInput): Promise<UserDocument> {
    const hasUser = await this.findOneByEmail(email);
    if (hasUser) {
      throw new BadRequestException(EMAIL_IS_ALREADY_REGISTERED);
    }

    const createdUser = new this.userModel({
      email,
      password: encryptPassword(password),
      name,
      role,
    });
    return await createdUser.save();
  }

  async updateById(
    id: MongoId,
    { name, password }: UpdateUserInput,
  ): Promise<UserDocument> {
    const hasUser = await this.userModel.findById(id);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    return await this.userModel.findByIdAndUpdate(
      id,
      { name, password: encryptPassword(password) },
      {
        new: true,
      },
    );
  }

  async deleteById(id: MongoId): Promise<UserDocument> {
    const hasUser = await this.userModel.findById(id);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    return await this.userModel.findByIdAndDelete(id, {
      new: true,
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

  async findOneById(id: MongoId): Promise<UserDocument> {
    const hasUser = await this.userModel.findById(id);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    return hasUser;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }
}
