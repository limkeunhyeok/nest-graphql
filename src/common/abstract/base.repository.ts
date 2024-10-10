import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';

// 여러 entity를 업데이트 또는 삭제하는 작업은 신중해야 하는 작업이므로,
// 이는 상속 받은 자식 클래스에서 추가 메서드 작성
export abstract class BaseRepository<T extends Document> {
  constructor(public readonly model: Model<T>) {}

  async findById(id: MongoId): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filterQuery);
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filterQuery);
  }

  async create(data: unknown): Promise<T> {
    const entity = new this.model(data);
    return entity.save();
  }

  async updateById(id: MongoId, data: UpdateQuery<unknown>): Promise<T> {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: MongoId): Promise<T> {
    return await this.model.findByIdAndDelete(id, { new: true });
  }
}
