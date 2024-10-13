import { Field, ObjectType } from '@nestjs/graphql';

export interface TokenResponse {
  accessToken: string;
}

@ObjectType()
export class TokenOutput {
  @Field(() => String)
  accessToken: string;
}
