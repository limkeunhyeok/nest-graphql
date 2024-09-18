import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { CreatePostInput } from './dtos/create.input';
import { UpdatePostInput } from './dtos/update.input';
import { Post, PostDocument } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(
    authorId: MongoId,
    { title, contents, published }: CreatePostInput,
  ) {
    const createdPost = new this.postModel({
      title,
      contents,
      published,
      authorId,
    });
    return await createdPost.save();
  }

  async updateById(
    authorId: MongoId,
    postId: MongoId,
    { title, contents, published }: UpdatePostInput,
  ) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new BadRequestException('Id does not exist.');
    }

    if (post.id !== authorId) {
      throw new ForbiddenException('Access is denied.');
    }

    return await this.postModel.findByIdAndUpdate(
      postId,
      {
        title,
        contents,
        published,
      },
      { new: true },
    );
  }

  async deleteById(authorId: MongoId, postId: MongoId) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new BadRequestException('Id does not exist.');
    }

    if (post.id !== authorId) {
      throw new ForbiddenException('Access is denied.');
    }

    return await this.postModel.findByIdAndDelete(postId, { new: true });
  }

  async findByQuery(query: FilterQuery<Post>) {
    // const t = await this.postModel.find(query);
    // return t;
    return await this.postModel.find(query);
  }
}