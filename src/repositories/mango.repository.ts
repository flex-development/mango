import logger from '@/config/logger'
import type {
  CreateEntityDTO,
  EntityDTO,
  MangoRepoOptionsDTO,
  PatchEntityDTO
} from '@/dtos'
import type {
  IMangoRepository,
  IMangoValidator,
  MangoCacheRepo,
  MangoParserOptions,
  MangoRepoOptions,
  MangoValidatorOptions,
  MingoOptions
} from '@/interfaces'
import MangoValidator from '@/mixins/mango-validator.mixin'
import MangoFinder from '@/plugins/mango-finder.plugin'
import type {
  DUID,
  MangoParsedUrlQuery,
  MangoSearchParams,
  RepoRoot,
  UID
} from '@/types'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type {
  ObjectPlain,
  OneOrMany,
  OrPromise,
  Path
} from '@flex-development/tutils'
import { classToPlain } from 'class-transformer'
import type { ClassType } from 'class-transformer-validator'
import type { Debugger } from 'debug'
import isEmpty from 'lodash.isempty'
import merge from 'lodash.merge'
import omit from 'lodash.omit'
import uniq from 'lodash.uniq'
import { v4 as uuid } from 'uuid'

/**
 * @file Repositories - MangoRepository
 * @module repositories/MangoRepository
 */

/**
 * Repository API for in-memory object collections.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @class
 * @extends MangoFinder
 * @implements {IMangoRepository<E, U, P, Q>}
 */
export default class MangoRepository<
    E extends ObjectPlain = ObjectPlain,
    U extends string = DUID,
    P extends MangoSearchParams<E> = MangoSearchParams<E>,
    Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
  >
  extends MangoFinder<E, U, P, Q>
  implements IMangoRepository<E, U, P, Q> {
  /**
   * @readonly
   * @instance
   * @property {MangoCacheRepo} cache - Repository data cache
   */
  readonly cache: MangoCacheRepo<E>

  /**
   * @readonly
   * @instance
   * @property {Debugger} logger - Internal logger
   */
  readonly logger: Debugger = logger.extend('repo')

  /**
   * @readonly
   * @instance
   * @property {ClassType<E>} model - Entity model
   */
  readonly model: ClassType<E>

  /**
   * @readonly
   * @instance
   * @property {MangoRepoOptions<E, U>} options - Repository options
   */
  readonly options: MangoRepoOptions<E, U>

  /**
   * @readonly
   * @instance
   * @property {IMangoValidator<E>} validator - Repository Validation API client
   */
  readonly validator: IMangoValidator<E>

  /**
   * Creates a new in-memory repository.
   *
   * See:
   *
   * - https://github.com/pleerock/class-validator
   * - https://github.com/typestack/class-transformer
   * - https://github.com/MichalLytek/class-transformer-validator
   *
   * @param {ClassType<E>} model - Entity model
   * @param {MangoRepoOptionsDTO<E, U>} [options] - Repository options
   * @param {MingoOptions<U>} [options.mingo] - Global mingo options
   * @param {MangoParserOptions<E>} [options.parser] - MangoParser options
   * @param {MangoValidatorOptions} [options.validation] - Validation options
   */
  constructor(model: ClassType<E>, options: MangoRepoOptionsDTO<E, U> = {}) {
    super(options)

    const cache = merge({}, this.cache, { root: {} })

    if (cache.collection.length) {
      cache.collection.forEach(e => (cache.root[e[this.euid()]] = e))
    }

    this.cache = Object.freeze(cache)
    this.model = model
    this.validator = new MangoValidator(this.model, options.validation)
    this.options = merge(this.options, { validation: this.validator.tvo })
  }

  /**
   * Clears all data from the repository.
   *
   * @return {OrPromise<true>} `true` when data is cleared
   */
  clear(): OrPromise<true> {
    this.setCache()
    return true
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
   * @template W - Object paths of `dto`
   *
   * @async
   * @param {CreateEntityDTO<E, W>} dto - Data to create new entity
   * @return {Promise<E>} Promise containing new entity
   * @throws {Exception}
   */
  async create<W extends Path<E>>(dto: CreateEntityDTO<E, W>): Promise<E> {
    // Get name of entity uid field
    const euid = this.euid()

    try {
      // Get entity uid
      let uid = isEmpty(dto[euid]) ? uuid() : dto[euid]
      if (typeof uid === 'string') uid = uid.trim()

      // Check if uid is number or string
      if (typeof uid !== 'number' && typeof uid !== 'string') {
        const type = typeof uid

        const message = `Entity uid must be number or string; received ${type}`
        const edata = { dto, errors: { [euid]: uid } }
        const code = ExceptionStatusCode.UNPROCESSABLE_ENTITY

        throw new Exception(code, message, edata)
      }

      // Merge dto with formatted entity uid
      let data = merge({}, dto, { [euid]: uid }) as E

      // Check if another entity with the same uid already exists
      if (this.findOne(data[euid])) {
        const uidstr = typeof uid === 'number' ? uid : `"${uid}"`

        const message = `Entity with uid ${uidstr} already exists`
        const edata = { dto: data, errors: { [euid]: uid } }

        throw new Exception(ExceptionStatusCode.CONFLICT, message, edata)
      }

      // Validate DTO schema
      data = classToPlain<E>(await this.validator.check<E>(data)) as E

      // ! Create new entity and reset cache
      this.setCache(Object.values({ ...this.cache.root, [uid]: data }))

      return data
    } catch (error) {
      if (error.constructor.name === 'Exception') throw error

      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const { message, stack } = error

      throw new Exception(code, message, { dto }, stack)
    }
  }

  /**
   * Deletes a single entity or group of entities.
   *
   * If {@param should_exist} is `true`, a `404 NOT_FOUND` error will be thrown
   * if the entity or one of the entities doesn't exist.
   *
   * @param {OneOrMany<UID>} uid - Entity uid or array of uids
   * @param {boolean} [should_exist] - Throw if any entities don't exist
   * @return {OrPromise<UID[]>} Array of uids
   * @throws {Exception}
   */
  delete(uid: OneOrMany<UID>, should_exist: boolean = false): OrPromise<UID[]> {
    let uids = Array.isArray(uid) ? uid : [uid]

    try {
      // Check if all entities exist or filter our non-existent entities
      if (should_exist) uids.forEach(id => this.findOneOrFail(id))
      else uids = uids.filter(id => this.findOne(id))

      // ! Remove entities and update cache
      this.setCache(Object.values(omit(this.cache.root, uids)) as E[])

      return uids
    } catch (error) {
      /* eslint-disable-next-line sort-keys */
      const data = { uids, should_exist }

      if (error.constructor.name === 'Exception') {
        error.data = merge(error.data, data)
        throw error
      }

      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const { message, stack } = error

      throw new Exception(code, message, data, stack)
    }
  }

  /**
   * Returns the name of the entity uid field.
   *
   * @return {string} Name of entity UID field
   */
  euid(): string {
    return this.options.mingo.idKey as string
  }

  /**
   * Partially updates an entity.
   *
   * The entity's uid field property cannot be updated.
   *
   * Throws an error if the entity isn't found, or if schema validation is
   * enabled and fails.
   *
   * @template W - Object paths of `dto`
   *
   * @async
   * @param {UID} uid - Entity uid
   * @param {PatchEntityDTO<E, W>} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<E>} Promise containing updated entity
   * @throws {Exception}
   */
  async patch<W extends Path<E>>(
    uid: UID,
    dto: PatchEntityDTO<E, W>,
    rfields: string[] = []
  ): Promise<E> {
    // Make sure entity exists
    const entity = this.findOneOrFail(uid)

    try {
      // Get readonly properties
      rfields = uniq([this.euid()].concat(rfields))

      // Remove readonly properties from dto
      dto = omit(dto, rfields)

      // Merge entity with dto
      let data = merge({}, entity, { ...dto }) as E

      // Validate DTO schema
      data = classToPlain<E>(await this.validator.check<E>(data)) as E

      // ! Refresh cache
      this.setCache(Object.values({ ...this.cache.root, [uid]: data }))

      return data
    } catch (error) {
      if (error.constructor.name === 'Exception') throw error

      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const { message, stack } = error

      /* eslint-disable-next-line sort-keys */
      throw new Exception(code, message, { uid, dto, rfields }, stack)
    }
  }

  /**
   * Refreshes the repository data cache.
   *
   * @param {E[]} collection - Entities to insert into cache
   * @return {OrPromise<MangoCacheRepo<E>>} Updated repository cache
   * @throws {Exception}
   */
  // @ts-expect-error in the midst of adding separate async and sync apis
  setCache(collection: E[] = []): OrPromise<MangoCacheRepo<E>> {
    // Get name of entity uid field
    const euid = this.euid()

    // Init new root
    const root: RepoRoot<E> = {}

    try {
      // Add entities to new root
      if (collection.length) collection.forEach(e => (root[e[euid]] = e))

      // @ts-expect-error updating caches (mango plugin and repository)
      this.cache = { collection: Object.freeze(Object.values(root)), root }

      return this.cache
    } catch (error) {
      if (error.constructor.name === 'Exception') throw error

      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const { message, stack } = error

      throw new Exception(code, message, { collection, root }, stack)
    }
  }

  /**
   * Creates or updates a single entity or array of entities.
   *
   * If any entity already exists, it will be patched.
   * If any entity does not exist in the database, it will be inserted.
   *
   * @template W - Object paths of `dto`
   *
   * @async
   * @param {OneOrMany<EntityDTO<E, W>>} dto - Entities to upsert
   * @return {Promise<E[]>} Promise containing new or updated entities
   */
  async save<W extends Path<E>>(dto: OneOrMany<EntityDTO<E, W>>): Promise<E[]> {
    /**
     * Creates or updates a single entity.
     *
     * If the entity already exists in the database, it will be updated.
     * If the entity does not exist in the database, it will be inserted.
     *
     * @template W - Object paths of `dto`
     *
     * @async
     * @param {EntityDTO<E, W>} dto - Data to upsert entity
     * @return {Promise<E>} Promise containing new or updated entiy
     */
    const upsert = async (dto: EntityDTO<E, W>): Promise<E> => {
      const uid = dto[this.euid()] as UID

      const exists = this.findOne(uid)

      if (!exists) return await this.create<W>(dto as CreateEntityDTO<E, W>)
      return await this.patch<W>(uid, dto as PatchEntityDTO<E, W>)
    }

    // Convert into array of DTOs
    const dtos = Array.isArray(dto) ? dto : [dto]

    // Perform upsert
    return await Promise.all(dtos.map(async d => upsert(d)))
  }
}
