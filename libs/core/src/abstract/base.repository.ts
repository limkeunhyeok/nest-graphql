import { sanitizeQuery } from '@common/utils';
import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { MongoId } from '../@types/datatype';
import { BaseDomain } from '../interfaces/domain.interface';
import { SortQuery } from '../interfaces/sort.interface';

// 여러 entity를 업데이트 또는 삭제하는 작업은 신중해야 하는 작업이므로,
// 이는 상속 받은 자식 클래스에서 추가 메서드 작성
export abstract class BaseRepository<
  T extends Document,
  Raw,
  Json,
  Domain extends BaseDomain<Json>,
> {
  public readonly domain: { fromJson: (json: Raw) => Domain };

  constructor(
    public readonly model: Model<T>,
    domainClass: { fromJson: (json: Raw) => Domain },
  ) {
    this.domain = domainClass;
  }

  async findById(id: MongoId): Promise<Domain | null> {
    const entity = (await this.model.findById(id).lean().exec()) as Raw;
    return this.domain.fromJson(entity) as Domain | null;
  }

  async find(filterQuery: FilterQuery<T>): Promise<Domain[]> {
    const entities = (await this.model
      .find(filterQuery)
      .lean()
      .exec()) as Raw[];
    return entities.map((entity) => this.domain.fromJson(entity) as Domain);
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<Domain | null> {
    const entity = (await this.model.findOne(filterQuery).lean().exec()) as Raw;
    return this.domain.fromJson(entity) as Domain | null;
  }

  async create(data: unknown): Promise<Domain> {
    const entity = (await this.model.create(data)) as Raw;
    return this.domain.fromJson(entity) as Domain;
  }

  async updateById(
    id: MongoId,
    data: UpdateQuery<unknown>,
  ): Promise<Domain | null> {
    const entity = (await this.model
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .lean()
      .exec()) as Raw;
    return this.domain.fromJson(entity) as Domain | null;
  }

  async deleteById(id: MongoId): Promise<Domain> {
    const entity = (await this.model
      .findByIdAndDelete(id, { new: true })
      .lean()
      .exec()) as Raw;
    return this.domain.fromJson(entity) as Domain | null;
  }

  getTotalCountPromise(filterQuery: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }

  findDocsPromise(
    filterQuery: FilterQuery<T>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<Raw[]> {
    return this.model
      .find(filterQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec() as Promise<Raw[]>;
  }

  async getTotalAndDocs(
    filterQuery: FilterQuery<T>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<{
    total: number;
    docs: Json[];
  }> {
    const sanitizedFilterQuery = sanitizeQuery(filterQuery);

    const docsPromise = this.findDocsPromise(
      sanitizedFilterQuery,
      sortQuery,
      limit,
      offset,
    );

    const totalCountPromise = this.getTotalCountPromise(sanitizedFilterQuery);

    const [total, docs] = await Promise.all([totalCountPromise, docsPromise]);
    const contexts = docs.map((doc: Raw) => this.domain.fromJson(doc).toJson());
    return {
      total,
      docs: contexts,
    };
  }
}
