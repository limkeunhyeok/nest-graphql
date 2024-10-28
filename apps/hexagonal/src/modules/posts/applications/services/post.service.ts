import { MongoId } from '@common/core/@types/datatype';
import {
  ACCESS_IS_DENIED,
  ID_DOES_NOT_EXIST,
} from '@common/core/constants/exception-message.const';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { paginateResponse, PaginateResponse } from '@common/utils/paginate';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FilterQuery, UpdateQuery } from 'mongoose';
import {
  PostDomain,
  PostInfo,
  PostJson,
  PostRaw,
} from '../../domain/post.domain';
import { PostServicePort } from '../../ports/in/post.service.port';
import { PostRepositoryPort } from '../../ports/out/post.repository.port';
import { POST_REPOSITORY } from '../../post.const';

@Injectable()
export class PostService implements PostServicePort {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async create(postInfo: PostInfo): Promise<PostJson> {
    const createdPost = await this.postRepository.create({
      ...postInfo,
    });

    return createdPost.toJson();
  }

  async updateById(
    postId: MongoId,
    authorId: MongoId,
    updateQuery: UpdateQuery<PostRaw>,
  ): Promise<PostJson> {
    const hasPost = await this.postRepository.findById(postId);

    if (!hasPost) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (hasPost.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    const updatedPost = await this.postRepository.updateById(
      postId,
      updateQuery,
    );

    return updatedPost.toJson();
  }

  async deleteById(postId: MongoId, authorId: MongoId): Promise<PostJson> {
    const hasPost = await this.postRepository.findById(postId);

    if (!hasPost) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (hasPost.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    const deletedPost = await this.postRepository.deleteById(postId);

    return deletedPost.toJson();
  }

  async paginateByQuery(
    filterQuery: FilterQuery<PostRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<PostJson>> {
    const { total, docs } = await this.postRepository.getTotalAndDocs(
      filterQuery,
      sortQuery,
      limit,
      offset,
    );
    return paginateResponse({ total, limit, offset, docs });
  }

  async findByQuery(filterQuery: FilterQuery<PostJson>): Promise<PostDomain[]> {
    const posts = await this.postRepository.find(filterQuery);
    return posts;
  }
}
