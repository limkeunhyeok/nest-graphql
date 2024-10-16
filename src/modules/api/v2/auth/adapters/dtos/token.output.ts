import { Field, ObjectType } from '@nestjs/graphql';

export interface Tokens {
  accessToken: string;
}

@ObjectType()
export class TokenOutput {
  @Field(() => String)
  accessToken: string;
}
