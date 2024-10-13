import { Field, InputType } from '@nestjs/graphql';
import { Role } from 'src/constants/role.const';

export interface SignupParams {
  email: string;
  name: string;
  password: string;
  role: Role;
}

@InputType()
export class SignupInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => Role, { defaultValue: Role.MEMBER })
  role: Role;
}
