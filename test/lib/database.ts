import mongoose from 'mongoose';

export async function cleanupDatabase(models: mongoose.Model<any>[]) {
  // const UserModel = model<UserDocument>('user', UserSchema);
  // const PostModel = model<PostDocument>('post', PostSchema);
  // const CommentModel = model<CommentDocument>('comment', CommentSchema);
  if (process.env.IS_CLEANUP === 'true') {
    for (let model of models) {
      model.deleteMany({});
    }
  }
}
