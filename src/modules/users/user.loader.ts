// import { Injectable, Scope } from '@nestjs/common';
// import * as DataLoader from 'dataloader';
// import mongoose from 'mongoose';
// import { User } from './entities/user.entity';
// import { UserService } from './user.service';

// @Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
// export class UserLoader {
//   constructor(private readonly userService: UserService) {}

//   generateDataLoader() {
//     return new DataLoader<string, User[]>((userIds: string[]) =>
//       this.batchLoadUsers(userIds),
//     );
//   }

//   private async batchLoadUsers(userIds: string[]): Promise<User[][]> {
//     const userObjectIds = userIds.map(
//       (userId) => new mongoose.Types.ObjectId(userId),
//     );

//     const users: User[] = await this.userService.findByQuery({
//       _id: { $in: userObjectIds },
//     });

//     const usersById = userIds.map((userId) =>
//       users.filter((user) => user._id.toString() === userId.toString()),
//     );
//     return usersById;
//   }
// }

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
