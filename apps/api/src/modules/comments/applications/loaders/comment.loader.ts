import { NestLoader } from '@common/core/interceptors/loader.interceptor';
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { COMMENT_SERVICE } from '../../comment.const';
import { CommentDomain, CommentJson } from '../../domain/comment.domain';
import { CommentServicePort } from '../../ports/in/comment.service.port';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class CommentLoader implements NestLoader<string, CommentJson> {
  constructor(
    @Inject(COMMENT_SERVICE)
    private readonly commentService: CommentServicePort,
  ) {}

  generateLoader(params?: Record<string, any>) {
    return new DataLoader<string, CommentJson[]>(
      (postIds: string[]) => this.batchLoadComments(postIds, params),
      {
        maxBatchSize: 16,
      },
    );
  }

  private async batchLoadComments(
    postIds: string[],
    params,
  ): Promise<CommentJson[][]> {
    const postObjectIds = postIds.map(
      (postId) => new mongoose.Types.ObjectId(postId),
    );

    const comments: CommentDomain[] = await this.commentService.findByQuery({
      postId: { $in: postObjectIds },
    });

    const commentsByPostId = postIds.map((postId) =>
      comments
        .filter((comment) => comment.postId.toString() === postId.toString())
        .map((comment) => comment.toJson()),
    );
    return commentsByPostId;
  }
}
