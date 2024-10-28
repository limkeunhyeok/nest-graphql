import { BaseRepository } from '@common/core/abstract/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDomain, PostJson, PostRaw } from '../../../domain/post.domain';
import { PostRepositoryPort } from '../../../ports/out/post.repository.port';
import { Post, PostDocument } from '../entities/post.entity';

@Injectable()
export class PostRepository
  extends BaseRepository<PostDocument, PostRaw, PostJson, PostDomain>
  implements PostRepositoryPort
{
  constructor(@InjectModel(Post.name) postModel: Model<PostDocument>) {
    super(postModel, PostDomain);
  }
}
