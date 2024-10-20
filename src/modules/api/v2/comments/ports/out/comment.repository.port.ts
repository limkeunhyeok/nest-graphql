import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { CommentDocument } from '../../adapters/persistence/entities/comment.entity';
import {
  CommentInfo,
  CommentJson,
  CommentRaw,
} from '../../domain/comment.domain';

export interface CommentRepositoryPort {
  findById(id: MongoId): Promise<CommentDocument | null>;
  find(filterQuery: FilterQuery<CommentJson>): Promise<CommentDocument[]>;
  findOne(filterQuery: FilterQuery<CommentJson>): Promise<CommentDocument>;
  create(data: CommentInfo): Promise<CommentDocument>;
  updateById(
    id: MongoId,
    data: UpdateQuery<CommentRaw>,
  ): Promise<CommentDocument>;
  deleteById(id: MongoId): Promise<CommentDocument>;
  getTotalCountPromise(filterQuery: FilterQuery<CommentJson>): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<CommentJson>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<CommentDocument[]>;
}
