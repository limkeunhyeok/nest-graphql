import { MongoId } from '@common/core/@types/datatype';
import {
  ACCESS_IS_DENIED,
  ID_DOES_NOT_EXIST,
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
import { Post, PostDocument } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(postRaw: Partial<Post>) {
    const createdPost = new this.postModel(postRaw);
    return await createdPost.save();
  }

  async updateById(
    postId: MongoId,
    authorId: MongoId,
    updateQuery: UpdateQuery<Post>,
  ) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    return await this.postModel
      .findByIdAndUpdate(postId, updateQuery, {
        new: true,
      })
      .exec();
  }

  async deleteById(postId: MongoId, authorId: MongoId) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    return await this.postModel
      .findByIdAndDelete(postId, {
        new: true,
      })
      .exec();
  }

  async paginateByQuery(
    filterQuery: FilterQuery<Post>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<Post>> {
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

  async getPostsForLoaderTest(limit: number) {
    const posts = await this.postModel.find({}).limit(limit).exec();
    return posts;
  }

  private getTotalCountPromise(
    filterQuery: FilterQuery<Post>,
  ): Promise<number> {
    return this.postModel.countDocuments(filterQuery).exec();
  }

  private findDocsPromise(
    filterQuery: FilterQuery<Post>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PostDocument[]> {
    return this.postModel
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
