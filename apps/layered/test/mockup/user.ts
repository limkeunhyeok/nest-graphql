import { Role } from '@common/core/constants/role.const';
import { User } from 'apps/layered/src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as faker from 'faker';
import * as mongoose from 'mongoose';

export function mockUserRaw(role: Role = Role.MEMBER): Partial<User> {
  const now = new Date();
  return {
    email: faker.internet.email(),
    name: faker.internet.userName(),
    password: faker.internet.password(8),
    role,
    createdAt: now,
    updatedAt: now,
  };
}

export async function createUser(
  userModel: mongoose.Model<User>,
  userRaw = mockUserRaw(),
) {
  const data: Partial<User> = JSON.parse(JSON.stringify(userRaw));
  data.password = bcrypt.hashSync(data.password, 10);
  return await userModel.create(data);
}
