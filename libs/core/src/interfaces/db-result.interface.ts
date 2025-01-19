import { Field, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
export class UpdateManyResultOutput {
  @Field(() => [String])
  successIds: MongoId[];

  @Field(() => [String])
  failedIds: MongoId[];

  @Field(() => Number)
  totalProcessed: number;
}
