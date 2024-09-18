import * as bcrypt from 'bcrypt';
import * as faker from 'faker';
import * as mongoose from 'mongoose';
import { Role, User } from 'src/modules/users/entities/user.entity';

export function mockUserRaw(role: Role = Role.MEMBER): Omit<User, '_id'> {
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
  const data: Omit<User, '_id'> = JSON.parse(JSON.stringify(userRaw));
  data.password = bcrypt.hashSync(data.password, 10);
  return await userModel.create(data);
}
