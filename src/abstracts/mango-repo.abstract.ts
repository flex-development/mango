import logger from '@/config/logger'
import MINGO from '@/config/mingo'
import type {
  CreateEntityDTO,
  EntityDTO,
  MangoRepoOptionsDTO,
  PatchEntityDTO
} from '@/dtos'
import type {
  IAbstractMangoRepository,
  IMangoValidator,
  MangoCacheRepo,
  MangoParserOptions,
  MangoRepoOptions,
  MangoValidatorOptions,
  MingoOptions
} from '@/interfaces'
import MangoValidator from '@/mixins/mango-validator.mixin'
import type {
  DocumentArray,
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
  ObjectUnknown,
  OneOrMany,
  OrPromise,
  Path
} from '@flex-development/tutils'
import type { ClassType } from 'class-transformer-validator'
import type { Debugger } from 'debug'
import merge from 'lodash.merge'
import omit from 'lodash.omit'
import uniq from 'lodash.uniq'
import { v4 as uuid } from 'uuid'
import AbstractMangoFinder from './mango-finder.abstract'

/**
 * @file Abstract Classes - AbstractMangoRepository
 * @module abstracts/MangoRepository
 */

/**
 * Repository API for in-memory object collections.
 *
 * This class is used to inject common functionality into the `MangoRepository`
 * and `MangoRepositoryAsync` classes.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @abstract
 * @class
 * @extends AbstractMangoFinder
 * @implements {IAbstractMangoRepository<E, U, P, Q>}
 */
export default abstract class AbstractMangoRepository<
    E extends ObjectPlain = ObjectUnknown,
    U extends string = DUID,
    P extends MangoSearchParams<E> = MangoSearchParams<E>,
    Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
  >
  extends AbstractMangoFinder<E, U, P, Q>
  implements IAbstractMangoRepository<E, U, P, Q> {
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
      cache.collection.forEach(entity => {
        cache.root[entity[this.options.mingo.idKey]] = entity
      })
    }

    this.cache = Object.freeze(cache)
    this.validator = new MangoValidator(model, options.validation)
    this.options = merge(this.options, { validation: this.validator.tvo })
  }

  /**
   * Creates a repository cache.
   *
   * @template AE - Entity
   * @template AU - Name of entity uid field
   *
   * @param {AU} uid - Name of entity uid field
   * @param {DocumentArray<AE>} [collection] - Entities to insert into cache
   * @return {MangoCacheRepo<E>} New repository cache
   * @throws {Exception}
   */
  static createCache<
    AE extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID
  >(uid: AU, collection: DocumentArray<AE> = []): MangoCacheRepo<AE> {
    // Init new root
    const root: RepoRoot<AE> = {}

    // Copy collection
    const entities = Object.assign([], collection)

    try {
      // Add entities to new root
      if (entities.length) entities.forEach(e => (root[e[uid]] = e))

      return { collection: Object.freeze(Object.values(root)), root }
    } catch (error) {
      if (error.constructor.name === 'Exception') throw error

      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const { message, stack } = error

      throw new Exception(code, message, { collection, root }, stack)
    }
  }

  /**
   * Deletes a single entity or group of entities.
   *
   * If {@param should_exist} is `true`, a `404 NOT_FOUND` error will be thrown
   * if the entity or one of the entities doesn't exist.
   *
   * @template AE - Entity
   * @template AU - Name of entity uid field
   * @template AP - Repository search parameters (query criteria and options)
   *
   * @param {OneOrMany<UID>} [uid] - Entity uid or array of uids
   * @param {boolean} [should_exist] - Throw if any entities don't exist
   * @param {MangoCacheRepo<AE>} [cache] - Current cache
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {{ cache: MangoCacheRepo<AE>, uids: UID[]}} New cache and uid array
   * @throws {Exception}
   */
  static delete<
    AE extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID,
    AP extends MangoSearchParams<AE> = MangoSearchParams<AE>
  >(
    uid: OneOrMany<UID> = [],
    should_exist: boolean = false,
    cache: MangoCacheRepo<AE> = { collection: [], root: {} },
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): { cache: MangoCacheRepo<AE>; uids: UID[] } {
    let uids = Array.isArray(uid) ? uid : [uid]

    try {
      if (uids.length) {
        // Check if all entities exist or filter out non-existent entities
        if (should_exist) {
          uids.forEach(uid => {
            return AbstractMangoRepository.findOneOrFail<AE, AU, AP>(
              uid,
              {} as AP,
              cache.collection,
              mingo_options,
              mingo
            )
          })
        } else {
          uids = uids.filter(uid => {
            return AbstractMangoRepository.findOne<AE, AU, AP>(
              uid,
              {} as AP,
              cache.collection,
              mingo_options,
              mingo
            )
          })
        }
      }

      return {
        cache: AbstractMangoRepository.createCache<AE, AU>(
          mingo_options.idKey,
          Object.values(omit(Object.assign({}, cache.root), uids)) as AE[]
        ),
        uids
      }
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
   * Formats the data used to create a new entity. Data is **not** validated.
   *
   * If the entity does is missing a uid, it will be assigned a random string
   * using the [uuid][1] module.
   *
   * Throws a `409 CONFLICT` error if an entity with the same uid exists.
   *
   * @template AF - Object field paths of `dto`
   * @template AE - Entity
   * @template AU - Name of entity uid field
   * @template AP - Repository search parameters (query criteria and options)
   *
   * @param {CreateEntityDTO<AE, AF>} dto - Data to create new entity
   * @param {DocumentArray<AE, AU>} [collection] - Document collection
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {AE} Formatted `dto` casted as entity
   */
  static formatCreateEntityDTO<
    AF extends Path<AE>,
    AE extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID,
    AP extends MangoSearchParams<AE> = MangoSearchParams<AE>
  >(
    dto: CreateEntityDTO<AE, AF>,
    collection: DocumentArray<AE, AU> = [],
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): AE {
    const euid = mingo_options.idKey

    try {
      // Get entity uid
      let uid = dto[euid as string]
      if (typeof uid === 'string') uid = uid.trim()

      // Assign uid if uid is missing or empty string
      if (!uid || uid === '') uid = uuid()

      // Merge dto with formatted entity uid
      const data = merge({}, dto, { [euid]: uid }) as AE

      // Check if another entity with the same uid already exists
      const existing_entity = AbstractMangoRepository.findOne<AE, AU, AP>(
        uid,
        {} as AP,
        collection,
        mingo_options,
        mingo
      )

      // Throw 409 CONFLICT error if existing entity is found
      if (existing_entity) {
        const uidstr = typeof uid === 'number' ? uid : `"${uid}"`

        const message = `Entity with ${euid} ${uidstr} already exists`
        const edata = { dto: data, errors: { [euid]: uid } }

        throw new Exception(ExceptionStatusCode.CONFLICT, message, edata)
      }

      return data
    } catch (error) {
      if (error.constructor.name === 'Exception') throw error

      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const { message, stack } = error

      throw new Exception(code, message, { dto }, stack)
    }
  }

  /**
   * Formats the data used to patch an entity. Data is **not** validated.
   *
   * The entity's uid field property cannot be updated.
   *
   * Throws if the entity isn't found.
   *
   * @template AF - Object field paths of `dto`
   * @template AE - Entity
   * @template AU - Name of entity uid field
   * @template AP - Repository search parameters (query criteria and options)
   *
   * @param {UID} uid - Entity uid
   * @param {PatchEntityDTO<AE, AF>} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @param {DocumentArray<AE, AU>} [collection] - Document collection
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {AE} Formatted `dto` casted as entity
   * @throws {Exception}
   */
  static formatPatchEntityDTO<
    AF extends Path<AE>,
    AE extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID,
    AP extends MangoSearchParams<AE> = MangoSearchParams<AE>
  >(
    uid: UID,
    dto: PatchEntityDTO<AE, AF>,
    rfields: string[] = [],
    collection: DocumentArray<AE, AU> = [],
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): AE {
    // Make sure entity exists
    const entity = AbstractMangoRepository.findOneOrFail<AE, AU, AP>(
      uid,
      {} as AP,
      collection,
      mingo_options,
      mingo
    )

    try {
      // Get readonly properties
      rfields = uniq([mingo_options.idKey as string].concat(rfields))

      // Return entity merged with dto
      return merge({}, entity, { ...omit(dto, rfields) }) as AE
    } catch (error) {
      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const { message, stack } = error

      /* eslint-disable-next-line sort-keys */
      throw new Exception(code, message, { uid, dto, rfields }, stack)
    }
  }

  /**
   * Clears all data from the repository.
   *
   * @return {OrPromise<true>} `true` when data is cleared
   */
  clear(): OrPromise<true> {
    const uid = this.options.mingo.idKey

    // @ts-expect-error updating caches (mango plugin and repository)
    this.cache = AbstractMangoRepository.createCache<E, U>(uid, [])

    return true
  }

  /**
   * Deletes a single entity or group of entities.
   *
   * If {@param should_exist} is `true`, a `404 NOT_FOUND` error will be thrown
   * if the entity or one of the entities doesn't exist.
   *
   * @param {OneOrMany<UID>} [uid] - Entity uid or array of uids
   * @param {boolean} [should_exist] - Throw if any entities don't exist
   * @return {OrPromise<UID[]>} Array of uids
   * @throws {Exception}
   */
  delete(uid?: OneOrMany<UID>, should_exist?: boolean): OrPromise<UID[]> {
    // Delete entities and create new cache
    const { cache, uids } = AbstractMangoRepository.delete(
      uid,
      should_exist,
      this.cache,
      this.options.mingo,
      this.mingo
    )

    // @ts-expect-error updating caches (mango plugin and repository)
    this.cache = cache

    // Return entities that were deleted
    return uids
  }

  /**
   * Updates the repository's the data cache.
   *
   * @param {E[]} [collection] - Entities to insert into cache
   * @return {OrPromise<MangoCacheRepo<E>>} Copy of updated repository cache
   * @throws {Exception}
   */
  setCache(collection?: E[]): OrPromise<MangoCacheRepo<E>> {
    // @ts-expect-error resetting caches (mango plugin and repository)
    this.cache = AbstractMangoRepository.createCache<E, U>(
      this.options.mingo.idKey,
      collection
    )

    return Object.assign({}, this.cache)
  }

  /**
   * @abstract
   * @template F - Object field paths of `dto`
   * @param {CreateEntityDTO<E, F>} dto - Data to create new entity
   * @return {OrPromise<E>} New entity
   * @throws {Exception}
   */
  abstract create<F extends Path<E>>(dto: CreateEntityDTO<E, F>): OrPromise<E>

  /**
   * @abstract
   * @template F - Object field paths of `dto`
   * @param {UID} uid - Entity uid
   * @param {PatchEntityDTO<E, F>} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<E>} Updated entity
   * @throws {Exception}
   */
  abstract patch<F extends Path<E>>(
    uid: UID,
    dto: PatchEntityDTO<E, F>,
    rfields?: string[]
  ): OrPromise<E>

  /**
   * @abstract
   * @template F - Object field paths of `dto`
   * @param {OneOrMany<EntityDTO<E, F>>} dto - Entities to upsert
   * @return {Promise<E[]>} New or updated entities
   */
  abstract save<F extends Path<E>>(
    dto: OneOrMany<EntityDTO<E, F>>
  ): OrPromise<E[]>
}
