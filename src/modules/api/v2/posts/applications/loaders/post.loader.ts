import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { PostJson } from '../../domain/models/post.domain';
import { PostService } from '../services/post.service';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class PostLoader {
  constructor(private readonly postService: PostService) {}

  generateDataLoader() {
    return new DataLoader<string, PostJson[]>(
      (authorIds: string[]) => this.batchLoadPosts(authorIds),
      {
        maxBatchSize: 16,
      },
    );
  }

  private async batchLoadPosts(authorIds: string[]): Promise<PostJson[][]> {
    const authorObjectIds = authorIds.map(
      (authorId) => new mongoose.Types.ObjectId(authorId),
    );

    const posts: PostJson[] = await this.postService.findByQuery({
      _id: { $in: authorObjectIds },
    });

    const postsByAuthorId = authorIds.map((authorId) =>
      posts.filter((post) => post._id.toString() === authorId.toString()),
    );
    return postsByAuthorId;
  }
}
