import * as faker from 'faker';
import * as mongoose from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { Comment } from 'src/modules/comments/entities/comment.entity';

export function mockCommentRaw(
  postId: MongoId,
  userId?: MongoId,
): Omit<Comment, '_id'> | Omit<Comment, '_id' | 'authorId'> {
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
  const data: Omit<Comment, '_id'> = JSON.parse(JSON.stringify(commentRaw));
  return await commentModel.create(data);
}
