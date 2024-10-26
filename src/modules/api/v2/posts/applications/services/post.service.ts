import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import {
  ACCESS_IS_DENIED,
  ID_DOES_NOT_EXIST,
} from 'src/constants/exception-message.const';
import { paginateResponse, PaginateResponse } from 'src/libs/paginate';
import { sanitizeQuery } from 'src/libs/utils';
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

    return PostDomain.fromJson(createdPost).toJson();
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

    return PostDomain.fromJson(updatedPost).toJson();
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

    return PostDomain.fromJson(deletedPost).toJson();
  }

  async paginateByQuery(
    filterQuery: FilterQuery<PostRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<PostJson>> {
    const sanitizedFilterQuery = sanitizeQuery(filterQuery);

    const docsPromise = this.postRepository.findDocsPromise(
      sanitizedFilterQuery,
      sortQuery,
      limit,
      offset,
    );

    const totalCountPromise =
      this.postRepository.getTotalCountPromise(sanitizedFilterQuery);

    const [total, docs] = await Promise.all([totalCountPromise, docsPromise]);
    const posts = docs.map((doc) => PostDomain.fromJson(doc).toJson());
    return paginateResponse({ total, limit, offset, docs: posts });
  }

  async findByQuery(filterQuery: FilterQuery<PostJson>): Promise<PostRaw[]> {
    const posts = await this.postRepository.find(filterQuery);
    return posts;
  }
}
