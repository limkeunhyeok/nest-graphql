import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/abstract/base.repository';
import {
  CommentDomain,
  CommentJson,
  CommentRaw,
} from '../../../domain/comment.domain';
import { CommentRepositoryPort } from '../../../ports/out/comment.repository.port';
import { Comment, CommentDocument } from '../entities/comment.entity';

@Injectable()
export class CommentRepository
  extends BaseRepository<
    CommentDocument,
    CommentRaw,
    CommentJson,
    CommentDomain
  >
  implements CommentRepositoryPort
{
  constructor(@InjectModel(Comment.name) commentModel: Model<CommentDocument>) {
    super(commentModel, CommentDomain);
  }
}
