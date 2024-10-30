import {
  CommentDocument,
  CommentSchema,
} from 'apps/hexagonal/src/modules/comments/adapters/persistence/entities/comment.entity';
import {
  PostDocument,
  PostSchema,
} from 'apps/hexagonal/src/modules/posts/adapters/persistence/entities/post.entity';
import {
  UserDocument,
  UserSchema,
} from 'apps/hexagonal/src/modules/users/adapters/persistence/entities/user.entity';
import mongoose, { model } from 'mongoose';

const dbUrl = `mongodb://localhost:27017/graphql`;

(async () => {
  await mongoose.connect(dbUrl, {
    authSource: 'admin',
    user: 'root',
    pass: 'password',
  });

  console.log('connect established.');

  mongoose.set('debug', true);

  const _UserModel = model<UserDocument>('user', UserSchema);
  const PostModel = model<PostDocument>('post', PostSchema);
  const CommentModel = model<CommentDocument>('comment', CommentSchema);

  const randomPosts = await PostModel.aggregate([{ $sample: { size: 2 } }]);

  const postIds = randomPosts.map((post) => post._id);

  await CommentModel.find({ postId: { $in: postIds } });

  await mongoose.connection.close();
})();
