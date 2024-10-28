import { ISODateTime, MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserOutput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  createdAt: ISODateTime;

  @Field(() => String)
  updatedAt: ISODateTime;

  @Field(() => Role, { defaultValue: Role.MEMBER })
  role: Role;
}
