import AbstractMangoRepository from '@/abstracts/mango-repo.abstract'
import logger from '@/config/logger'
import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type {
  AggregationStages,
  IMangoRepositoryAsync,
  MangoCacheRepo,
  QueryCriteriaOptions
} from '@/interfaces'
import type {
  AggregationPipelineResult as PipelineResult,
  DocumentPartial as PartialDoc,
  DocumentSortingRules,
  DUID,
  MangoParsedUrlQuery,
  MangoSearchParams,
  ProjectStage,
  UID
} from '@/types'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  Path
} from '@flex-development/tutils'
import type { Debugger } from 'debug'

/**
 * @file Repositories - MangoRepositoryAsync
 * @module repositories/MangoRepositoryAsync
 */

/**
 * **Asynchronous** repository API for in-memory object collections.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @class
 * @extends AbstractMangoRepository
 * @implements {IMangoRepositoryAsync<E, U, P, Q>}
 */
export default class MangoRepositoryAsync<
    E extends ObjectPlain = ObjectUnknown,
    U extends string = DUID,
    P extends MangoSearchParams<E> = MangoSearchParams<E>,
    Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
  >
  extends AbstractMangoRepository<E, U, P, Q>
  implements IMangoRepositoryAsync<E, U, P, Q> {
  /**
   * @readonly
   * @instance
   * @property {Debugger} logger - Internal logger
   */
  readonly logger: Debugger = logger.extend('repo').extend('async')

  /**
   * Runs an aggregation pipeline for `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @async
   * @param {OneOrMany<AggregationStages<E>>} [pipeline] - Aggregation stage(s)
   * @return {Promise<PipelineResult<E>>} Promise containing pipeline results
   */
  async aggregate(
    pipeline?: OneOrMany<AggregationStages<E>>
  ): Promise<PipelineResult<E>> {
    return super.aggregate(pipeline)
  }

  /**
   * Clears all data from the repository.
   *
   * @async
   * @return {Promise<true>} Promise containing `true` when data is cleared
   */
  async clear(): Promise<true> {
    return super.clear()
  }

  /**
   * Creates a new entity.
   *
   * If the entity does is missing a uid, it will be assigned a random string
   * using the [uuid][1] module.
   *
   * Throws a `400 BAD_REQUEST` error if schema validation is enabled and fails.
   * Throws a `409 CONFLICT` error if an entity with the same uid exists.
   *
   * [1]: https://github.com/uuidjs/uuid
   *
   * @template F - Object field paths of `dto`
   *
   * @async
   * @param {CreateEntityDTO<E, F>} dto - Data to create new entity
   * @return {Promise<E>} Promise containing new entity
   */
  async create<F extends Path<E>>(dto: CreateEntityDTO<E, F>): Promise<E> {
    // Format dto
    let data = MangoRepositoryAsync.formatCreateEntityDTO(
      dto,
      this.cache.collection,
      this.options.mingo,
      this.mingo
    )

    // Validate new entity data
    data = await this.validator.check<E>(data)

    // Get name of entity uid field
    const uid = this.uid()

    // Get array of entities with new entity
    const entities = Object.values({ ...this.cache.root, [data[uid]]: data })

    // ! Set cache
    await this.setCache(entities)

    return data
  }

  /**
   * Deletes a single entity or group of entities.
   *
   * If {@param should_exist} is `true`, a `404 NOT_FOUND` error will be thrown
   * if the entity or one of the entities doesn't exist.
   *
   * @async
   * @param {OneOrMany<UID>} [uid] - Entity uid or array of uids
   * @param {boolean} [should_exist] - Throw if any entities don't exist
   * @return {Promise<UID[]>} Promise containing array of uids
   */
  async delete(uid?: OneOrMany<UID>, should_exist?: boolean): Promise<UID[]> {
    return super.delete(uid, should_exist)
  }

  /**
   * Executes a search against `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @async
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<E, U>[]>} Promise containing search results
   */
  async find(params?: P): Promise<PartialDoc<E, U>[]> {
    return super.find(params)
  }

  /**
   * Finds multiple entities by id.
   *
   * @async
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<E, U>[]>} Promise containing specified docs
   */
  async findByIds(uids?: UID[], params?: P): Promise<PartialDoc<E, U>[]> {
    return super.findByIds(uids, params)
  }

  /**
   * Finds a entity by unique identifier.
   *
   * Returns `null` if the entity isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for entity
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<E, U> | null>} Promise containing doc or null
   */
  async findOne(uid: UID, params?: P): Promise<PartialDoc<E, U> | null> {
    return super.findOne(uid, params)
  }

  /**
   * Finds a entity by unique identifier.
   *
   * Throws an error if the entity isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for entity
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<E, U>>} Promise containing entity
   */
  async findOneOrFail(uid: UID, params?: P): Promise<PartialDoc<E, U>> {
    return super.findOneOrFail(uid, params)
  }

  /**
   * Partially updates an entity.
   *
   * The entity's uid field property cannot be updated.
   *
   * Throws an error if the entity isn't found, or if schema validation is
   * enabled and fails.
   *
   * @template F - Object field paths of `dto`
   *
   * @async
   * @param {UID} uid - Entity uid
   * @param {PatchEntityDTO<E, F>} [dto] - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<E>} Promise containing updated entity
   */
  async patch<F extends Path<E>>(
    uid: UID,
    dto?: PatchEntityDTO<E, F>,
    rfields?: string[]
  ): Promise<E> {
    // Format dto
    let data = MangoRepositoryAsync.formatPatchEntityDTO(
      uid,
      dto,
      rfields,
      this.cache.collection,
      this.options.mingo,
      this.mingo
    )

    // Validate dto
    data = await this.validator.check<E>(data)

    // ! Set cache
    await this.setCache(Object.values({ ...this.cache.root, [uid]: data }))

    return data
  }

  /**
   * Queries `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @async
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<E, U>[]>} Promise containing search results
   */
  async query(query?: Q | string): Promise<PartialDoc<E, U>[]> {
    return super.query(query)
  }

  /**
   * Queries multiple entities by unique identifier.
   *
   * @async
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<E, U>[]>} Promise containing specified docs
   */
  async queryByIds(
    uids?: UID[],
    query?: Q | string
  ): Promise<PartialDoc<E, U>[]> {
    return super.queryByIds(uids, query)
  }

  /**
   * Queries a entity by unique identifier.
   *
   * Returns `null` if the entity isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for entity
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<E, U> | null>} Promise containing doc or null
   */
  async queryOne(
    uid: UID,
    query?: Q | string
  ): Promise<PartialDoc<E, U> | null> {
    return super.queryOne(uid, query)
  }

  /**
   * Queries a entity by id.
   *
   * Throws an error if the entity isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for entity
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<E, U>>} Promise containing entity
   */
  async queryOneOrFail(
    uid: UID,
    query?: Q | string
  ): Promise<PartialDoc<E, U>> {
    return super.queryOneOrFail(uid, query)
  }

  /**
   * Creates or updates a single entity or array of entities.
   *
   * If any entity already exists, it will be patched.
   * If any entity does not exist in the database, it will be inserted.
   *
   * @template F - Object field paths of `dto`
   *
   * @async
   * @param {OneOrMany<EntityDTO<E, F>>} [dto] - Entities to upsert
   * @return {Promise<E[]>} Promise containing new or updated entities
   */
  async save<F extends Path<E>>(
    dto: OneOrMany<EntityDTO<E, F>> = []
  ): Promise<E[]> {
    /**
     * Creates or updates a single entity.
     *
     * If the entity already exists in the database, it will be updated.
     * If the entity does not exist in the database, it will be inserted.
     *
     * @template F - Object field paths of `dto`
     *
     * @async
     * @param {EntityDTO<E, F>} dto - Data to upsert entity
     * @return {Promise<E>} Promise containing new or updated entiy
     */
    const upsert = async (dto: EntityDTO<E, F>): Promise<E> => {
      const uid = dto[this.uid()] as UID

      const exists = await this.findOne(uid)

      if (!exists) return await this.create<F>(dto as CreateEntityDTO<E, F>)
      return await this.patch<F>(uid, dto as PatchEntityDTO<E, F>)
    }

    // Convert into array of DTOs
    const dtos = Array.isArray(dto) ? dto : [dto]

    // Perform upsert
    return await Promise.all(dtos.map(async d => upsert(d)))
  }

  /**
   * Updates the repository's the data cache.
   *
   * @param {E[]} [collection] - Entities to insert into cache
   * @return {Promise<MangoCacheRepo<E>>} Copy of updated repository cache
   */
  async setCache(collection?: E[]): Promise<MangoCacheRepo<E>> {
    return super.setCache(collection)
  }
}
