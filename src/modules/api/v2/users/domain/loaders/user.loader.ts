import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { NestDataLoader } from 'nestjs-dataloader';
import { User } from '../models/user.entity';
import { UserService } from '../services/user.service';

@Injectable()
export class UserLoader implements NestDataLoader<string, User> {
  constructor(private readonly userService: UserService) {}

  generateDataLoader() {
    return new DataLoader<string, User[]>(
      (userIds: string[]) => this.batchLoadUsers(userIds),
      {
        maxBatchSize: 16,
      },
    );
  }

  private async batchLoadUsers(userIds: string[]): Promise<User[][]> {
    const userObjectIds = userIds.map(
      (userId) => new mongoose.Types.ObjectId(userId),
    );

    const users: User[] = await this.userService.findByQuery({
      _id: { $in: userObjectIds },
    });

    const usersById = userIds.map((userId) =>
      users.filter((user) => user._id.toString() === userId.toString()),
    );
    return usersById;
  }
}
