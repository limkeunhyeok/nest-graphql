import { MongoId } from '@common/core/@types/datatype';
import { Post } from 'apps/layered/src/modules/posts/entities/post.entity';
import * as faker from 'faker';
import * as mongoose from 'mongoose';

export function mockPostRaw(userId?: MongoId): Partial<Post> {
  const now = new Date();
  const partialPost = {
    title: faker.lorem.sentence(),
    contents: faker.lorem.text(),
    published: faker.datatype.boolean(),
    createdAt: now,
    updatedAt: now,
  };

  if (userId) {
    return {
      ...partialPost,
      authorId: userId,
    };
  }
  return partialPost;
}

export async function createPost(
  postModel: mongoose.Model<Post>,
  userId: MongoId,
  postRaw = mockPostRaw(userId),
) {
  const data: Partial<Post> = JSON.parse(JSON.stringify(postRaw));
  return await postModel.create(data);
}
