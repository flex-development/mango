import AbstractMangoRepository from '@/abstracts/mango-repo.abstract'
import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type {
  AggregationStages,
  IMangoRepository,
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
  OneOrMany
} from '@flex-development/tutils'

/**
 * @file Repositories - MangoRepository
 * @module repositories/MangoRepository
 */

/**
 * **Synchronous** repository API for in-memory object collections.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @class
 * @extends AbstractMangoRepository
 * @implements {IMangoRepository<E, U, P, Q>}
 */
export default class MangoRepository<
    E extends ObjectPlain = ObjectUnknown,
    U extends string = DUID,
    P extends MangoSearchParams<E> = MangoSearchParams<E>,
    Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
  >
  extends AbstractMangoRepository<E, U, P, Q>
  implements IMangoRepository<E, U, P, Q> {
  /**
   * Runs an aggregation pipeline for `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @param {OneOrMany<AggregationStages<E>>} [pipeline] - Aggregation stage(s)
   * @return {PipelineResult<E>} Pipeline results
   */
  aggregate(pipeline?: OneOrMany<AggregationStages<E>>): PipelineResult<E> {
    return super.aggregate(pipeline)
  }

  /**
   * Clears all data from the repository.
   *
   * @return {true} `true` when data is cleared
   */
  clear(): true {
    return super.clear() as true
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
   * @param {CreateEntityDTO<E>} dto - Data to create new entity
   * @return {E} New entity
   */
  create(dto: CreateEntityDTO<E>): E {
    // Format dto
    let data = MangoRepository.formatCreateEntityDTO<E, U, P>(
      dto,
      this.cache.collection,
      this.options.mingo,
      this.mingo
    )

    // Validate new entity data
    data = this.validator.checkSync<E>(data)

    // Get name of entity uid field
    const uid = this.uid()

    // Get array of entities with new entity
    const entities = Object.values({ ...this.cache.root, [data[uid]]: data })

    // ! Set cache
    this.setCache(entities)

    return data
  }

  /**
   * Deletes a single entity or group of entities.
   *
   * If {@param should_exist} is `true`, a `404 NOT_FOUND` error will be thrown
   * if the entity or one of the entities doesn't exist.
   *
   * @param {OneOrMany<UID>} [uid] - Entity uid or array of uids
   * @param {boolean} [should_exist] - Throw if any entities don't exist
   * @return {UID[]} Array of uids
   */
  delete(uid?: OneOrMany<UID>, should_exist?: boolean): UID[] {
    return super.delete(uid, should_exist) as UID[]
  }

  /**
   * Executes a search against `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {PartialDoc<E, U>[]} Search results
   */
  find(params?: P): PartialDoc<E, U>[] {
    return super.find(params) as PartialDoc<E, U>[]
  }

  /**
   * Finds multiple entities by id.
   *
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {PartialDoc<E, U>[]} Specified entities
   */
  findByIds(uids?: UID[], params?: P): PartialDoc<E, U>[] {
    return super.findByIds(uids, params) as PartialDoc<E, U>[]
  }

  /**
   * Finds a entity by unique identifier.
   *
   * Returns `null` if the entity isn't found.
   *
   * @param {UID} uid - Unique identifier for entity
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {PartialDoc<E, U> | null} Entity
   */
  findOne(uid: UID, params?: P): PartialDoc<E, U> | null {
    return super.findOne(uid, params) as PartialDoc<E, U> | null
  }

  /**
   * Finds a entity by unique identifier.
   *
   * Throws an error if the entity isn't found.
   *
   * @param {UID} uid - Unique identifier for entity
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<E>} [params.options] - Search options
   * @param {ProjectStage<E>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n entities
   * @param {DocumentSortingRules<E>} [params.options.sort] - Sorting rules
   * @return {PartialDoc<E, U>} Entity
   */
  findOneOrFail(uid: UID, params?: P): PartialDoc<E, U> {
    return super.findOneOrFail(uid, params) as PartialDoc<E, U>
  }

  /**
   * Partially updates an entity.
   *
   * The entity's uid field property cannot be updated.
   *
   * Throws an error if the entity isn't found, or if schema validation is
   * enabled and fails.
   *
   * @param {UID} uid - Entity uid
   * @param {PatchEntityDTO<E>} [dto] - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {E} Updated entity
   */
  patch(uid: UID, dto?: PatchEntityDTO<E>, rfields?: string[]): E {
    // Format dto
    let data = MangoRepository.formatPatchEntityDTO<E, U, P>(
      uid,
      dto,
      rfields,
      this.cache.collection,
      this.options.mingo,
      this.mingo
    )

    // Validate dto
    data = this.validator.checkSync<E>(data)

    // ! Set cache
    this.setCache(Object.values({ ...this.cache.root, [uid]: data }))

    return data
  }

  /**
   * Queries `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @param {Q | string} [query] - Document query object or string
   * @return {PartialDoc<E, U>[]} Search results
   */
  query(query?: Q | string): PartialDoc<E, U>[] {
    return super.query(query) as PartialDoc<E, U>[]
  }

  /**
   * Queries multiple entities by unique identifier.
   *
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {Q | string} [query] - Document query object or string
   * @return {PartialDoc<E, U>[]} Specified entities
   */
  queryByIds(uids?: UID[], query?: Q | string): PartialDoc<E, U>[] {
    return super.queryByIds(uids, query) as PartialDoc<E, U>[]
  }

  /**
   * Queries a entity by unique identifier.
   *
   * Returns `null` if the entity isn't found.
   *
   * @param {UID} uid - Unique identifier for entity
   * @param {Q | string} [query] - Document query object or string
   * @return {PartialDoc<E, U> | null} Document or null
   */
  queryOne(uid: UID, query?: Q | string): PartialDoc<E, U> | null {
    return super.queryOne(uid, query) as PartialDoc<E, U> | null
  }

  /**
   * Queries a entity by id.
   *
   * Throws an error if the entity isn't found.
   *
   * @param {UID} uid - Unique identifier for entity
   * @param {Q | string} [query] - Document query object or string
   * @return {PartialDoc<E, U>} Entity
   */
  queryOneOrFail(uid: UID, query?: Q | string): PartialDoc<E, U> {
    return super.queryOneOrFail(uid, query) as PartialDoc<E, U>
  }

  /**
   * Creates or updates a single entity or array of entities.
   *
   * If any entity already exists, it will be patched.
   * If any entity does not exist in the database, it will be inserted.
   *
   * @param {OneOrMany<EntityDTO<E>>} [dto] - Entities to upsert
   * @return {E[]} New or updated entities
   */
  save(dto: OneOrMany<EntityDTO<E>> = []): E[] {
    /**
     * Creates or updates a single entity.
     *
     * If the entity already exists in the database, it will be updated.
     * If the entity does not exist in the database, it will be inserted.
     *
     * @template F - Object field paths of `dto`
     *
     * @param {EntityDTO<E>} dto - Data to upsert entity
     * @return {E} New or updated entity
     */
    const upsert = (dto: EntityDTO<E>): E => {
      const uid = dto[this.uid()] as UID

      const exists = this.findOne(uid)

      if (!exists) return this.create(dto as CreateEntityDTO<E>)
      return this.patch(uid, dto as PatchEntityDTO<E>)
    }

    // Convert into array of DTOs
    const dtos: EntityDTO<E>[] = Array.isArray(dto) ? dto : [dto]

    // @ts-expect-error performing upsert
    return dtos.map(d => upsert(d))
  }

  /**
   * Updates the repository's the data cache.
   *
   * @param {E[]} [collection] - Entities to insert into cache
   * @return {MangoCacheRepo<E>} Copy of updated repository cache
   */
  setCache(collection?: E[]): MangoCacheRepo<E> {
    return super.setCache(collection) as MangoCacheRepo<E>
  }
}
