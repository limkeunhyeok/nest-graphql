import { Inject, Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { NestDataLoader } from 'nestjs-dataloader';
import { UserDomain, UserJson } from '../../domain/user.domain';
import { UserServicePort } from '../../ports/in/user.service.port';
import { USER_SERVICE } from '../../user.const';

// CacheMap을 사용하기 때문에, 객체를 key로 삼지 않는 이상 키가 중복되지 않음
// key 값의 순서와 entity 값의 순서가 보장되어야 맞게 매핑됨
@Injectable({ scope: Scope.REQUEST })
export class UserLoader implements NestDataLoader<string, UserJson> {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserServicePort,
  ) {}

  generateDataLoader() {
    return new DataLoader<string, UserJson>(
      (userIds: string[]) => this.batchLoadUsers(userIds),
      {
        maxBatchSize: 16,
      },
    );
  }

  private async batchLoadUsers(userIds: string[]): Promise<UserJson[]> {
    const userObjectIds = userIds.map(
      (userId) => new mongoose.Types.ObjectId(userId),
    );

    const users: UserDomain[] = await this.userService.findByQuery({
      _id: { $in: userObjectIds },
    });

    const usersById = userIds.map((userId) =>
      users.find((user) => user._id.toString() === userId.toString()).toJson(),
    );
    return usersById;
  }
}
