import { ISODateTime, MongoId } from 'src/@types/datatype';
import { BaseDomain } from 'src/common/interfaces/domain.interface';

export interface CommentRaw {
  readonly _id: MongoId;
  readonly contents: string;
  readonly published: boolean;
  readonly authorId: MongoId;
  readonly postId: MongoId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CommentJson {
  readonly _id: MongoId;
  readonly contents: string;
  readonly published: boolean;
  readonly authorId: MongoId;
  readonly postId: MongoId;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}

export interface CommentInfo {
  readonly contents: string;
  readonly published: boolean;
  readonly authorId: MongoId;
  readonly postId: MongoId;
}

export class CommentDomain implements BaseDomain<CommentJson> {
  constructor(
    public readonly _id: MongoId,
    public readonly contents: string,
    public readonly published: boolean,
    public readonly authorId: MongoId,
    public readonly postId: MongoId,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromJson(json: CommentRaw): CommentDomain | null {
    if (!json) {
      return null;
    }

    return new CommentDomain(
      json._id,
      json.contents,
      json.published,
      json.authorId,
      json.postId,
      new Date(json.createdAt),
      new Date(json.updatedAt),
    );
  }

  public toJson(): CommentJson {
    return {
      _id: this._id,
      contents: this.contents,
      published: this.published,
      authorId: this.authorId,
      postId: this.postId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
