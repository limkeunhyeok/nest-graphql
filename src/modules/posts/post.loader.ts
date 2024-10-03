import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as DataLoader from 'dataloader';
import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class PostLoader {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  generateDataLoader() {
    return new DataLoader<string, Post[]>((authorIds: string[]) =>
      this.batchLoadPosts(authorIds),
    );
  }

  private async batchLoadPosts(authorIds: string[]): Promise<Post[][]> {
    const authorObjectIds = authorIds.map(
      (authorId) => new mongoose.Types.ObjectId(authorId),
    );

    const posts: Post[] = await this.postModel
      .find({
        _id: { $in: authorObjectIds },
      })
      .exec();

    const postsByAuthorId = authorIds.map((authorId) =>
      posts.filter((post) => post._id.toString() === authorId.toString()),
    );
    return postsByAuthorId;
  }
}
