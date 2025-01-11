import { NestLoader } from '@common/core/interceptors/loader.interceptor';
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { PostDomain, PostJson } from '../../domain/post.domain';
import { PostServicePort } from '../../ports/in/post.service.port';
import { POST_SERVICE } from '../../post.const';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class PostLoader implements NestLoader<string, PostJson> {
  constructor(
    @Inject(POST_SERVICE) private readonly postService: PostServicePort,
  ) {}

  generateLoader(params?: Record<string, any>) {
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

    const posts: PostDomain[] = await this.postService.findByQuery({
      _id: { $in: authorObjectIds },
    });

    const postsByAuthorId = authorIds.map((authorId) =>
      posts
        .filter((post) => post._id.toString() === authorId.toString())
        .map((post) => post.toJson()),
    );
    return postsByAuthorId;
  }
}
