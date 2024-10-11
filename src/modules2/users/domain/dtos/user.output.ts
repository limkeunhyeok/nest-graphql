import { Field, ObjectType } from '@nestjs/graphql';
import { ISODateTime, MongoId } from 'src/@types/datatype';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Role } from '../../../../constants/role.const';

@ObjectType()
export class UserOutput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => [Post], { nullable: true })
  posts: Post[];

  @Field(() => String)
  createdAt: ISODateTime;

  @Field(() => String)
  updatedAt: ISODateTime;

  @Field(() => Role, { defaultValue: Role.MEMBER })
  role: Role;
}