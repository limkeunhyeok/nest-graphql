import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as DataLoader from 'dataloader';
import mongoose, { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
} from 'src/modules/comments/entities/comment.entity';

@Injectable({ scope: Scope.REQUEST }) // 요청당 하나의 DataLoader 인스턴스
export class CommentLoader {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  generateDataLoader() {
    return new DataLoader<string, Comment[]>((postIds: string[]) =>
      this.batchLoadComments(postIds),
    );
  }

  private async batchLoadComments(postIds: string[]): Promise<Comment[][]> {
    const postObjectIds = postIds.map(
      (postId) => new mongoose.Types.ObjectId(postId),
    );

    const comments: Comment[] = await this.commentModel.find({
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
