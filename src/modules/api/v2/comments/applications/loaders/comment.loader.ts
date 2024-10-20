import { Inject, Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import mongoose from 'mongoose';
import { Comment } from '../../adapters/persistence/entities/comment.entity';
import { COMMENT_SERVICE } from '../../comment.const';
import { CommentServicePort } from '../../ports/in/comment.service.port';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class CommentLoader {
  constructor(
    @Inject(COMMENT_SERVICE)
    private readonly commentService: CommentServicePort,
  ) {}

  generateDataLoader() {
    return new DataLoader<string, Comment[]>(
      (postIds: string[]) => this.batchLoadComments(postIds),
      {
        maxBatchSize: 16,
      },
    );
  }

  private async batchLoadComments(postIds: string[]): Promise<Comment[][]> {
    const postObjectIds = postIds.map(
      (postId) => new mongoose.Types.ObjectId(postId),
    );

    const comments: Comment[] = await this.commentService.findByQuery({
      postId: { $in: postObjectIds },
    });

    const commentsByPostId = postIds.map((postId) =>
      comments.filter(
        (comment) => comment.postId.toString() === postId.toString(),
      ),
    );
    return commentsByPostId;
  }
}
