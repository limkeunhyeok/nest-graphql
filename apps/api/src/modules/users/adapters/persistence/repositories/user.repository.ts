import { BaseRepository } from '@common/core/abstract/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDomain, UserJson, UserRaw } from '../../../domain/user.domain';
import { UserRepositoryPort } from '../../../ports/out/user.repository.port';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UserRepository
  extends BaseRepository<UserDocument, UserRaw, UserJson, UserDomain>
  implements UserRepositoryPort
{
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel, UserDomain);
  }
}
