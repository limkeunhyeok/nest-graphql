import * as faker from 'faker';
import * as mongoose from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { Post } from 'src/modules/posts/entities/post.entity';

export function mockPostRaw(
  userId?: MongoId,
): Omit<Post, '_id'> | Omit<Post, '_id' | 'authorId'> {
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
  const data: Omit<Post, '_id'> = JSON.parse(JSON.stringify(postRaw));
  return await postModel.create(data);
}
