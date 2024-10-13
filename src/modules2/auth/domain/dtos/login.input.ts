import { Field, InputType } from '@nestjs/graphql';

export interface LoginParams {
  email: string;
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
