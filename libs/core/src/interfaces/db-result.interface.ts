import { MongoId } from '../@types/datatype';

export interface UpdateManyResult {
  successIds: MongoId[];
  failedIds: MongoId[];
  totalProcessed: number;
}

export interface CreateManyResult {
  successDocs: any[];
  failedDocs: { doc: any; reason: string }[];
}
