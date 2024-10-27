import { ISODateTime, MongoId } from 'src/@types/datatype';
import { BaseDomain } from 'src/common/interfaces/domain.interface';
import { Role } from 'src/constants/role.const';

export interface UserRaw {
  readonly _id: MongoId;
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly role: Role;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UserJson {
  readonly _id: MongoId;
  readonly email: string;
  readonly name: string;
  readonly role: Role;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}

export interface UserInfo {
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly role: Role;
}

export class UserDomain implements BaseDomain<UserJson> {
  constructor(
    public readonly _id: MongoId,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromJson(json: UserRaw) {
    if (!json) {
      return null;
    }

    return new UserDomain(
      json._id,
      json.email,
      json.name,
      json.password,
      json.role,
      new Date(json.createdAt),
      new Date(json.updatedAt),
    );
  }

  public toJson(): UserJson {
    return {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
