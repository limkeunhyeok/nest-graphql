import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { NestDataLoader } from 'nestjs-dataloader';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserLoader implements NestDataLoader<string, User> {
  constructor(private readonly userService: UserService) {}

  generateDataLoader(): DataLoader<string, User> {
    return new DataLoader<string, User>((keys) => {
      const userIds = keys.map((key) => new mongoose.Types.ObjectId(key));
      return this.userService.findByQuery({ _id: { $in: userIds } });
    });
  }
}
