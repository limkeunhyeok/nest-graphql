import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as DataLoader from 'dataloader';
import mongoose, { Model } from 'mongoose';
import { NestDataLoader } from 'nestjs-dataloader';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserLoader implements NestDataLoader<string, User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  generateDataLoader(): DataLoader<string, User> {
    return new DataLoader<string, User>((keys) => {
      const userIds = keys.map((key) => new mongoose.Types.ObjectId(key));
      return this.userModel.find({
        _id: { $in: userIds },
      });
    });
  }
}
