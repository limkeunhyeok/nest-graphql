import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/abstract/base.repository';
import { PostRepositoryPort } from '../../../ports/out/post.repository.port';
import { Post, PostDocument } from '../entities/post.entity';

@Injectable()
export class PostRepository
  extends BaseRepository<PostDocument>
  implements PostRepositoryPort
{
  constructor(@InjectModel(Post.name) postModel: Model<PostDocument>) {
    super(postModel);
  }
}
