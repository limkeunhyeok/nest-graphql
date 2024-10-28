import { MongoId } from '@common/core/@types/datatype';
import {
  ACCESS_IS_DENIED,
  ID_DOES_NOT_EXIST,
  RELATION_ID_MISMATCH,
} from '@common/core/constants/exception-message.const';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { paginateResponse, PaginateResponse } from '@common/utils';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(commentRaw: Partial<Comment>) {
    const createdPost = new this.commentModel(commentRaw);
    return await createdPost.save();
  }

  async updateById(
    commentId: MongoId,
    postId: MongoId,
    authorId: MongoId,
    updateQuery: UpdateQuery<Comment>,
  ) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (comment.postId !== postId) {
      throw new BadRequestException(RELATION_ID_MISMATCH);
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    return await this.commentModel
      .findByIdAndUpdate(commentId, updateQuery, { new: true })
      .exec();
  }

  async deleteById(commentId: MongoId, postId: MongoId, authorId: MongoId) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (comment.postId !== postId) {
      throw new BadRequestException(RELATION_ID_MISMATCH);
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    return await this.commentModel
      .findByIdAndDelete(commentId, { new: true })
      .exec();
  }

  async findByQuery(query: FilterQuery<Comment>) {
    return await this.commentModel.find(query).exec();
  }

  async paginateByQuery(
    filterQuery: FilterQuery<Comment>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<Comment>> {
    const sanitizedFilterQuery = this.sanitizeQuery(filterQuery);

    const docsPromise = this.findDocsPromise(
      sanitizedFilterQuery,
      sortQuery,
      limit,
      offset,
    );

    const totalCountPromise = this.getTotalCountPromise(sanitizedFilterQuery);

    const [total, docs] = await Promise.all([totalCountPromise, docsPromise]);
    return paginateResponse({ total, limit, offset, docs });
  }

  private getTotalCountPromise(
    filterQuery: FilterQuery<Comment>,
  ): Promise<number> {
    return this.commentModel.countDocuments(filterQuery).exec();
  }

  private findDocsPromise(
    filterQuery: FilterQuery<Comment>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<CommentDocument[]> {
    return this.commentModel
      .find(filterQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  private sanitizeQuery(query: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined),
    );
  }
}
