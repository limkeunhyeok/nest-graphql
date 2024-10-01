import mongoose, { model } from 'mongoose';
import {
  CommentDocument,
  CommentSchema,
} from 'src/modules/comments/entities/comment.entity';
import {
  PostDocument,
  PostSchema,
} from 'src/modules/posts/entities/post.entity';
import {
  UserDocument,
  UserSchema,
} from 'src/modules/users/entities/user.entity';

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

  const randomPosts = await PostModel.aggregate([{ $sample: { size: 2 } }]);

  const postIds = randomPosts.map((post) => post._id);

  const comments = await CommentModel.find({ postId: { $in: postIds } });

  await mongoose.connection.close();
})();
