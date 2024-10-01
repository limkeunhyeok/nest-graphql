import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class PostLoader {
  constructor(private readonly postService: PostService) {}

  generateDataLoader() {
    return new DataLoader<string, Post[]>((authorIds: string[]) =>
      this.batchLoadPosts(authorIds),
    );
  }

  private async batchLoadPosts(authorIds: string[]): Promise<Post[][]> {
    const authorObjectIds = authorIds.map(
      (authorId) => new mongoose.Types.ObjectId(authorId),
    );

    const posts: Post[] = await this.postService.findByQuery({
      _id: { $in: authorObjectIds },
    });

    const postsByAuthorId = authorIds.map((authorId) =>
      posts.filter((post) => post._id.toString() === authorId.toString()),
    );
    return postsByAuthorId;
  }
}
