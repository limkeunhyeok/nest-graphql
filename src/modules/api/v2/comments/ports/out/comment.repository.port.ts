import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import {
  CommentDomain,
  CommentInfo,
  CommentJson,
  CommentRaw,
} from '../../domain/comment.domain';

export interface CommentRepositoryPort {
  findById(id: MongoId): Promise<CommentDomain | null>;
  find(filterQuery: FilterQuery<CommentJson>): Promise<CommentDomain[]>;
  findOne(filterQuery: FilterQuery<CommentJson>): Promise<CommentDomain | null>;
  create(data: CommentInfo): Promise<CommentDomain>;
  updateById(
    id: MongoId,
    data: UpdateQuery<CommentRaw>,
  ): Promise<CommentDomain | null>;
  deleteById(id: MongoId): Promise<CommentDomain | null>;
  getTotalCountPromise(filterQuery: FilterQuery<CommentJson>): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<CommentJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<CommentRaw[]>;
  getTotalAndDocs(
    filterQuery: FilterQuery<CommentJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<{
    total: number;
    docs: CommentJson[];
  }>;
}
