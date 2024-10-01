import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { Role } from '../entities/user.entity';

@InputType()
export class ReadUserInput {
  @Field(() => String, { nullable: true })
  _id?: MongoId;

  @Field(() => String, { nullable: true })
  role?: Role;
}
