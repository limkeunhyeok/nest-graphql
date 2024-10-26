import { Inject, Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { NestDataLoader } from 'nestjs-dataloader';
import { COMMENT_SERVICE } from '../../comment.const';
import {
  CommentDomain,
  CommentJson,
  CommentRaw,
} from '../../domain/comment.domain';
import { CommentServicePort } from '../../ports/in/comment.service.port';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class CommentLoader implements NestDataLoader<string, CommentJson> {
  constructor(
    @Inject(COMMENT_SERVICE)
    private readonly commentService: CommentServicePort,
  ) {}

  generateDataLoader() {
    return new DataLoader<string, CommentJson[]>(
      (postIds: string[]) => this.batchLoadComments(postIds),
      {
        maxBatchSize: 16,
      },
    );
  }

  private async batchLoadComments(postIds: string[]): Promise<CommentJson[][]> {
    const postObjectIds = postIds.map(
      (postId) => new mongoose.Types.ObjectId(postId),
    );

    const comments: CommentRaw[] = await this.commentService.findByQuery({
      postId: { $in: postObjectIds },
    });

    const commentsByPostId = postIds.map((postId) =>
      comments
        .filter((comment) => comment.postId.toString() === postId.toString())
        .map((comment) => CommentDomain.fromJson(comment).toJson()),
    );
    return commentsByPostId;
  }
}
