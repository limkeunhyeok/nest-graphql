import { ISODateTime, MongoId } from 'src/@types/datatype';

export interface PostRaw {
  readonly _id: MongoId;
  readonly title: string;
  readonly contents: string;
  readonly published: boolean;
  readonly authorId: MongoId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PostJson {
  readonly _id: MongoId;
  readonly title: string;
  readonly contents: string;
  readonly published: boolean;
  readonly authorId: MongoId;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}

export interface PostInfo {
  readonly title: string;
  readonly contents: string;
  readonly published: boolean;
  readonly authorId: MongoId;
}

export class PostDomain {
  constructor(
    public readonly _id: MongoId,
    public readonly title: string,
    public readonly contents: string,
    public readonly published: boolean,
    public readonly authorId: MongoId,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromJson(json: PostRaw) {
    if (!json) {
      return null;
    }

    return new PostDomain(
      json._id,
      json.title,
      json.contents,
      json.published,
      json.authorId,
      new Date(json.createdAt),
      new Date(json.updatedAt),
    );
  }

  public toJson(): PostJson {
    return {
      _id: this._id,
      title: this.title,
      contents: this.contents,
      published: this.published,
      authorId: this.authorId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
