import logger from '@src/logger';
import { BaseModel } from '@src/models';
import { Error, Model } from 'mongoose';
import { FilterOptions, WithId } from '.';
import {
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
  Repository,
} from './repository';

export abstract class DefaultMongoDBRepository<
  T extends BaseModel
> extends Repository<T> {
  constructor(private model: Model<T>) {
    super();
  }

  async create(data: T) {
    try {
      const model = new this.model(data);
      const createdData = await model.save();
      return createdData.toJSON<WithId<T>>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(options: FilterOptions) {
    try {
      const data = await this.model.findOne(options);
      return data?.toJSON<WithId<T>>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async find(filter: FilterOptions) {
    try {
      const data = await this.model.find(filter);
      return data.map((d) => d.toJSON<WithId<T>>());
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(filter: FilterOptions, payload: T) {
    try {
      const data = await this.model.findOneAndUpdate(
        { _id: filter.id },
        payload,
        { new: true }
      );
      return data?.toJSON<WithId<T>>();
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteAll() {
    try {
      await this.model.deleteMany({});
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        (err) => err.name === 'ValidatorError'
      );
      if (duplicatedKindErrors.length) {
        throw new DatabaseValidationError(error.message);
      }
      throw new DatabaseUnknownClientError(error.message);
    }
    logger.warn('Database error', error);
    throw new DatabaseInternalError(
      'Something unexpected happened to the database'
    );
  }
}
