import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenOutput {
  @Field(() => String)
  accessToken: string;
}
