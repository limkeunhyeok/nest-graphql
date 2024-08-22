import { Field, InputType } from '@nestjs/graphql';
import { Role } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => Role, { defaultValue: Role.MEMBER })
  role: Role;
}
