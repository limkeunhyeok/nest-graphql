import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import {
  CommentInfo,
  CommentJson,
  CommentRaw,
} from '../../domain/comment.domain';

export interface CommentRepositoryPort {
  findById(id: MongoId): Promise<CommentRaw | null>;
  find(filterQuery: FilterQuery<CommentJson>): Promise<CommentRaw[]>;
  findOne(filterQuery: FilterQuery<CommentJson>): Promise<CommentRaw>;
  create(data: CommentInfo): Promise<CommentRaw>;
  updateById(id: MongoId, data: UpdateQuery<CommentRaw>): Promise<CommentRaw>;
  deleteById(id: MongoId): Promise<CommentRaw>;
  getTotalCountPromise(filterQuery: FilterQuery<CommentJson>): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<CommentJson>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<CommentRaw[]>;
}
