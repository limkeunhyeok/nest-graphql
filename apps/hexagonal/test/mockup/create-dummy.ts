import { Role } from '@common/core/constants/role.const';
import {
  CommentDocument,
  CommentSchema,
} from 'apps/hexagonal/src/modules/comments/adapters/persistence/entities/comment.entity';
import {
  Post,
  PostDocument,
  PostSchema,
} from 'apps/hexagonal/src/modules/posts/adapters/persistence/entities/post.entity';
import {
  UserDocument,
  UserSchema,
} from 'apps/hexagonal/src/modules/users/adapters/persistence/entities/user.entity';
import * as faker from 'faker';
import mongoose, { model } from 'mongoose';
import { mockCommentRaw } from './comment';
import { mockPostRaw } from './post';
import { mockUserRaw } from './user';

const dbUrl = `mongodb://localhost:27017/graphql`;

(async () => {
  await mongoose.connect(dbUrl, {
    authSource: 'admin',
    user: 'root',
    pass: 'password',
  });

  console.log('connect established.');

  mongoose.set('debug', true);

  const UserModel = model<UserDocument>('user', UserSchema);
  const PostModel = model<PostDocument>('post', PostSchema);
  const CommentModel = model<CommentDocument>('comment', CommentSchema);

  const userRaws = Array.from({ length: 100 }).map(() =>
    mockUserRaw(faker.random.objectElement<Role>(Role)),
  );

  const users = await UserModel.create(userRaws);

  let postRaws: Omit<Post, '_id'>[] = [];
  for (let user of users) {
    const newPostRaws = Array.from({
      length: faker.datatype.number({ min: 10, max: 30 }),
    }).map(() => mockPostRaw(user._id)) as Omit<Post, '_id'>[];

    postRaws = postRaws.concat(newPostRaws);
  }

  const posts = await PostModel.create(postRaws);

  let commentRaws: Omit<Comment, '_id'>[] = [];
  for (let post of posts) {
    const newCommentRaws = Array.from({
      length: faker.datatype.number({ min: 20, max: 30 }),
    }).map(() => mockCommentRaw(post._id, post.authorId)) as Omit<
      Comment,
      '_id'
    >[];

    commentRaws = commentRaws.concat(newCommentRaws);
  }

  await CommentModel.create(commentRaws);

  await mongoose.connection.close();
})();
