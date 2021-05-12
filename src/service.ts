import { IBaseRepository } from './database/interfaces';
import { ICache } from './cache';
import { FindAllOption, FindAllResponse } from './types';
import { ILogger } from './logger';

export type ServiceCache = {
  cache: ICache;
  prefix: string;
  second: number;
};

export interface IBaseService<T> {
  create(entity: Partial<T>): Promise<T>;
  updateById(id: string, doc: Partial<T>): Promise<boolean>;
  deleteById(id: string): Promise<boolean>;

  findOne(cond: Partial<T>): Promise<T>;
  findOneAndUpdate(cond: Partial<T>, doc: Partial<T>): Promise<T>;
  findMany(cond: Partial<T>): Promise<T[]>;
  findAll(cond: Partial<T>, option?: Partial<FindAllOption>): Promise<FindAllResponse<T>>;
}

const CACHE_REF_ID = '#refId_';

export default abstract class BaseService<T> implements IBaseService<T> {
  repo: IBaseRepository<T>;
  private cache?: ICache;
  private prefix?: string;
  private ttl?: number;
  protected logger?: ILogger;

  constructor(repo: IBaseRepository<T>, cache?: ServiceCache, logger?: ILogger) {
    this.repo = repo;
    this.cache = cache?.cache;
    this.prefix = cache?.prefix;
    this.ttl = cache?.second;
    this.logger = logger;
  }

  async create(entity: Partial<T>): Promise<T> {
    const _entity = await this.repo.create(entity);
    return _entity;
  }

  async updateById(id: string, doc: Partial<T>): Promise<boolean> {
    const result = await this.repo.updateById(id, doc);

    this.deleteCache({ id } as unknown as Partial<T>);
    return result;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.repo.deleteById(id);

    this.deleteCache({ id } as unknown as Partial<T>);
    return result;
  }

  async findOne(cond: Partial<T>): Promise<T> {
    const data = await this.getCache(cond);
    if (data) return data;

    const _entity = await this.repo.findOne(cond);

    if (_entity) this.setCache(cond, _entity);
    return _entity;
  }

  async findOneAndUpdate(cond: Partial<T>, doc: Partial<T>): Promise<T> {
    const _entity = await this.repo.findOneAndUpdate(cond, doc);

    if (_entity) this.setCache(cond, _entity);
    return _entity;
  }

  async findMany(cond: Partial<T>): Promise<T[]> {
    const _entities = await this.repo.findMany(cond);
    return _entities;
  }

  async findAll(cond: Partial<T>, option?: Partial<FindAllOption>): Promise<FindAllResponse<T>> {
    const data = await this.repo.findAll(cond, option);
    return data;
  }

  protected async getCache(cond: Partial<T>): Promise<T | null> {
    if (!this.cache) return null;
    if (!Object.keys(cond).length) return null;

    const key = this.createCacheKey(cond);
    try {
      let result = await this.cache.getAsync(key);
      if (!result) return null;

      // Find again
      if (typeof result === 'string' && result.startsWith(CACHE_REF_ID)) {
        const id = result.split(CACHE_REF_ID)[1];

        result = await this.cache.getAsync(this.createCacheKey({ id }));
        if (result) return JSON.parse(result) as T;

        // Only set cache automatic with this case
        // Another case must call set cache manual
        const entity = await this.repo.findOne({ id } as unknown as Partial<T>);
        if (entity) {
          await this.setCache({ id } as unknown as Partial<T>, entity);
        }

        return entity;
      }

      // Exception
      return JSON.parse(result);
    } catch (error) {
      this.logger?.warn(`Get cache with key ${key} error: `, error);
    }
  }

  protected async deleteCache(cond: Partial<T>): Promise<void> {
    if (!this.cache) return;
    if (!Object.keys(cond).length) return;

    const key = this.createCacheKey(cond);
    try {
      this.cache.delAsync(key);
    } catch (error) {
      this.logger?.warn(`Delete cache with key ${key} error: `, error);
    }
  }

  protected async setCache(cond: Partial<T>, entity: T): Promise<unknown> {
    if (!this.cache) return null;
    if (!Object.keys(cond).length) return null;

    const key = this.createCacheKey(cond);
    try {
      if ((cond as any).id) {
        return this.cache.setAsync(key, JSON.stringify(entity), 'EX', this.ttl);
      }

      return this.cache.setAsync(key, `${CACHE_REF_ID}${(entity as any).id}`, 'EX', this.ttl);
    } catch (error) {
      this.logger?.warn(`Set cache with key ${key} error: `, error);
    }
  }

  protected createCacheKey(obj: Record<string, unknown>): string {
    let result = this.prefix || '';
    for (const key of Object.keys(obj)) {
      result += `|${key}_${obj[key]}`;
    }

    return result;
  }
}
