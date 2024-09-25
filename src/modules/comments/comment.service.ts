import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import {
  ACCESS_IS_DENIED,
  ID_DOES_NOT_EXIST,
  RELATION_ID_MISMATCH,
} from 'src/constants/exception-message.const';
import { CreateCommentInput } from './dtos/create.input';
import { UpdateCommentInput } from './dtos/update.input';
import { Comment, CommentDocument } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(
    authorId: MongoId,
    { contents, published, postId }: CreateCommentInput,
  ) {
    const createdPost = new this.commentModel({
      contents,
      published,
      authorId,
      postId,
    });
    return await createdPost.save();
  }

  async updateById(
    authorId: MongoId,
    postId: MongoId,
    commentId: MongoId,
    { contents, published }: UpdateCommentInput,
  ) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (comment.postId !== postId) {
      throw new BadRequestException(RELATION_ID_MISMATCH);
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    return await this.commentModel.findByIdAndUpdate(
      commentId,
      {
        contents,
        published,
      },
      { new: true },
    );
  }

  async deleteById(authorId: MongoId, postId: MongoId, commentId: MongoId) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (comment.postId !== postId) {
      throw new BadRequestException(RELATION_ID_MISMATCH);
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    return await this.commentModel.findByIdAndDelete(commentId, { new: true });
  }

  async findByQuery(query: FilterQuery<Comment>) {
    return await this.commentModel.find(query);
  }
}
