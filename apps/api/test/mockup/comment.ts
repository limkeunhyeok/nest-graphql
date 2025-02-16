import { MongoId } from '@common/core/@types/datatype';
import { Comment } from 'apps/api/src/modules/comments/adapters/persistence/entities/comment.entity';
import * as faker from 'faker';
import * as mongoose from 'mongoose';

export function mockCommentRaw(
  postId: MongoId,
  userId?: MongoId,
): Partial<Comment> {
  const now = new Date();
  const partialComment = {
    contents: faker.lorem.text(),
    published: faker.datatype.boolean(),
    postId,
    createdAt: now,
    updatedAt: now,
  };

  if (userId) {
    return {
      ...partialComment,
      authorId: userId,
    };
  }
  return partialComment;
}

export async function createComment(
  commentModel: mongoose.Model<Comment>,
  userId: MongoId,
  postId: MongoId,
  commentRaw = mockCommentRaw(postId, userId),
) {
  const data: Partial<Comment> = JSON.parse(JSON.stringify(commentRaw));
  return await commentModel.create(data);
}
