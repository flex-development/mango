import logger from '@/config/logger'
import MINGO from '@/config/mingo'
import type { MangoFinderOptionsDTO } from '@/dtos'
import type {
  AggregationStages,
  IAbstractMangoFinder,
  IMangoParser,
  MangoCacheFinder,
  MangoFinderOptions,
  MangoParserOptions,
  MingoOptions,
  QueryCriteriaOptions
} from '@/interfaces'
import MangoParser from '@/mixins/mango-parser.mixin'
import type {
  AggregationPipelineResult,
  DocumentArray,
  DocumentPartial,
  DocumentSortingRules,
  DUID,
  MangoParsedUrlQuery,
  MangoSearchParams,
  ProjectStage,
  UID
} from '@/types'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  OrPromise
} from '@flex-development/tutils'
import type { Debugger } from 'debug'
import isEmpty from 'lodash.isempty'
import merge from 'lodash.merge'

/**
 * @file Abstract Classes - AbstractMangoFinder
 * @module abstracts/MangoFinder
 */

/**
 * Plugin for [`mingo`][1] and [`qs-to-mongo`][2].
 *
 * This class is used to inject common functionality into the `MangoFinder`
 * and `MangoFinderAsync` classes.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @abstract
 * @class
 * @implements {IAbstractMangoFinder<D, U, P, Q>}
 *
 * [1]: https://github.com/kofrasa/mingo
 * [2]: https://github.com/fox1t/qs-to-mongo
 */
export default abstract class AbstractMangoFinder<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> implements IAbstractMangoFinder<D, U, P, Q> {
  /**
   * @readonly
   * @instance
   * @property {Readonly<MangoCacheFinder<D>>} cache - Data cache
   */
  readonly cache: Readonly<MangoCacheFinder<D>>

  /**
   * @readonly
   * @instance
   * @property {Debugger} logger - Internal logger
   */
  readonly logger: Debugger = logger.extend('plugin')

  /**
   * @readonly
   * @instance
   * @property {typeof MINGO} mingo - MongoDB query language client
   */
  readonly mingo: typeof MINGO = MINGO

  /**
   * @readonly
   * @instance
   * @property {IMangoParser<D>} mparser - MangoParser instance
   */
  readonly mparser: IMangoParser<D>

  /**
   * @readonly
   * @instance
   * @property {MangoFinderOptions<D, U>} options - Plugin options
   */
  readonly options: MangoFinderOptions<D, U>

  /**
   * Creates a new Mango Finder plugin.
   *
   * By default, collection objects are assumed to have an `id` field that maps
   * to a unique identifier (uid) for the document. The name of the uid can be
   * changed by setting {@param options.mingo.idKey}.
   *
   * See: https://github.com/kofrasa/mingo
   *
   * @param {MangoFinderOptionsDTO<D, U>} [options] - Plugin options
   * @param {MingoOptions<U>} [options.mingo] - Global mingo options
   * @param {U} [options.mingo.idKey] - Name of document uid field
   * @param {MangoParserOptions<D>} [options.parser] - MangoParser options
   */
  constructor({
    cache,
    mingo = {},
    parser = {}
  }: MangoFinderOptionsDTO<D, U> = {}) {
    const { collection = [] } = cache || {}
    const { idKey: midk } = mingo

    const documents = Object.freeze(Array.isArray(collection) ? collection : [])
    const idKey = (typeof midk === 'string' && midk.length ? midk : 'id') as U

    this.cache = Object.freeze({ collection: documents })
    this.options = { mingo: { ...mingo, idKey }, parser }
    this.mparser = new MangoParser(this.options.parser)
  }

  /**
   * Runs an aggregation pipeline for `collection`.
   *
   * @template AD - Document (collection object)
   * @template AU - Name of document uid field
   *
   * @param {OneOrMany<AggregationStages<AD>>} [pipeline] - Aggregation stage(s)
   * @param {DocumentArray<AD, AU>} [collection] - Document collection
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {AggregationPipelineResult<AD>} Pipeline results
   * @throws {Exception}
   */
  static aggregate<
    AD extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID
  >(
    pipeline: OneOrMany<AggregationStages<AD>> = [],
    collection: DocumentArray<AD, AU> = [],
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): AggregationPipelineResult<AD> {
    let _pipeline = pipeline as ObjectPlain[]
    if (!Array.isArray(_pipeline)) _pipeline = [_pipeline]

    try {
      return mingo.aggregate(collection as AD[], _pipeline, mingo_options)
    } catch ({ message, stack }) {
      const data = { pipeline: _pipeline }

      throw new Exception(ExceptionStatusCode.BAD_REQUEST, message, data, stack)
    }
  }

  /**
   * Executes a search against `collection`.
   *
   * @template AD - Document (collection object)
   * @template AU - Name of document uid field
   * @template AP - Search parameters (query criteria and options)
   *
   * @param {AP} [params] - Search parameters
   * @param {QueryCriteriaOptions<AD>} [params.options] - Search options
   * @param {ProjectStage<AD>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @param {DocumentArray<AD, AU>} [collection] - Document collection
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {DocumentPartial<AD, AU>[]} Search results
   * @throws {Exception}
   */
  static find<
    AD extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID,
    AP extends MangoSearchParams<AD> = MangoSearchParams<AD>
  >(
    params: AP = {} as AP,
    collection: DocumentArray<AD, AU> = [],
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): OrPromise<DocumentPartial<AD, AU>[]> {
    const { options = {}, ...criteria } = params
    const { $project = {}, limit, skip, sort } = options

    try {
      let source = Object.assign([], collection) as DocumentPartial<AD, AU>[]

      // Pick fields from each document
      if ($project && !isEmpty($project)) {
        const pipeline = { $project }

        source = AbstractMangoFinder.aggregate<AD, AU>(
          pipeline,
          source,
          mingo_options,
          mingo
        ) as DocumentPartial<AD, AU>[]
      }

      // Handle query criteria
      let cursor = mingo.find(source, criteria, {}, mingo_options)

      // Apply sorting rules
      if (sort && !isEmpty(sort)) cursor = cursor.sort(sort)

      // Apply offset
      if (typeof skip === 'number') cursor = cursor.skip(skip)

      // Limit results
      if (typeof limit === 'number') cursor = cursor.limit(limit)

      // Return search results
      return cursor.all() as DocumentPartial<AD, AU>[]
    } catch (error) {
      const { message, stack } = error
      const data = { params }

      if (error.constructor.name === 'Exception') {
        error.data = merge(error.data, data)
        throw error
      }

      throw new Exception(ExceptionStatusCode.BAD_REQUEST, message, data, stack)
    }
  }

  /**
   * Finds multiple documents by id.
   *
   * @template AD - Document (collection object)
   * @template AU - Name of document uid field
   * @template AP - Search parameters (query criteria and options)
   *
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {AP} [params] - Search parameters
   * @param {QueryCriteriaOptions<AD>} [params.options] - Search options
   * @param {ProjectStage<AD>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @param {DocumentArray<AD, AU>} [collection] - Document collection
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {OrPromise<DocumentPartial<AD, AU>[]>} Specified documents
   * @throws {Exception}
   */
  static findByIds<
    AD extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID,
    AP extends MangoSearchParams<AD> = MangoSearchParams<AD>
  >(
    uids: UID[] = [],
    params: AP = {} as AP,
    collection: DocumentArray<AD, AU> = [],
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): OrPromise<DocumentPartial<AD, AU>[]> {
    try {
      // Perform search
      const documents = AbstractMangoFinder.find<AD, AU, AP>(
        params,
        collection,
        mingo_options,
        mingo
      ) as DocumentPartial<AD, AU>[]

      // Get specified documents
      const idKey = mingo_options.idKey as string
      return documents.filter(doc => uids.includes(doc[idKey] as UID))
    } catch (error) {
      /* eslint-disable-next-line sort-keys */
      const data = { uids, params }

      if (error.constructor.name === 'Exception') {
        error.data = merge(error.data, data)
        throw error
      }

      const { message, stack } = error

      throw new Exception(ExceptionStatusCode.BAD_REQUEST, message, data, stack)
    }
  }

  /**
   * Finds a document by unique identifier.
   *
   * Returns `null` if the document isn't found.
   *
   * @template AD - Document (collection object)
   * @template AU - Name of document uid field
   * @template AP - Search parameters (query criteria and options)
   *
   * @param {UID} uid - Unique identifier for document
   * @param {AP} [params] - Search parameters
   * @param {QueryCriteriaOptions<AD>} [params.options] - Search options
   * @param {ProjectStage<AD>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @param {DocumentArray<AD, AU>} [collection] - Document collection
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {OrPromise<DocumentPartial<AD, AU> | null>} Document or null
   * @throws {Exception}
   */
  static findOne<
    AD extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID,
    AP extends MangoSearchParams<AD> = MangoSearchParams<AD>
  >(
    uid: UID,
    params: AP = {} as AP,
    collection: DocumentArray<AD, AU> = [],
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): OrPromise<DocumentPartial<AD, AU> | null> {
    params = { ...params, [mingo_options.idKey]: uid }

    // Perform search
    const { 0: doc = null } = AbstractMangoFinder.find<AD, AU, AP>(
      params,
      collection,
      mingo_options,
      mingo
    ) as DocumentPartial<AD, AU>[]

    // Return document or null if not found
    return doc && doc[mingo_options.idKey as string] === uid ? doc : null
  }

  /**
   * Finds a document by unique identifier.
   *
   * Throws an error if the document isn't found.
   *
   * @template AD - Document (collection object)
   * @template AU - Name of document uid field
   * @template AP - Search parameters (query criteria and options)
   *
   * @param {UID} uid - Unique identifier for document
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<AD>} [params.options] - Search options
   * @param {ProjectStage<AD>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @param {DocumentArray<AD, AU>} [collection] - Document collection
   * @param {MingoOptions<AU>} [mingo_options] - `mingo` options
   * @param {typeof MINGO} [mingo] - MongoDB query language client
   * @return {OrPromise<DocumentPartial<AD, AU>>} Document
   * @throws {Exception}
   */
  static findOneOrFail<
    AD extends ObjectPlain = ObjectUnknown,
    AU extends string = DUID,
    AP extends MangoSearchParams<AD> = MangoSearchParams<AD>
  >(
    uid: UID,
    params?: AP,
    collection: DocumentArray<AD, AU> = [],
    mingo_options: MingoOptions<AU> = { idKey: 'id' as AU },
    mingo: typeof MINGO = MINGO
  ): OrPromise<DocumentPartial<AD, AU>> {
    const document = AbstractMangoFinder.findOne(
      uid,
      params,
      collection,
      mingo_options,
      mingo
    ) as DocumentPartial<AD, AU>

    if (!document) {
      const { idKey } = mingo_options
      const uidstr = typeof uid === 'number' ? uid : `"${uid}"`

      const message = `Document with ${idKey} ${uidstr} does not exist`
      const data = { errors: { [idKey]: uid }, params }

      throw new Exception(ExceptionStatusCode.NOT_FOUND, message, data)
    }

    return document
  }

  /**
   * Runs an aggregation pipeline for `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `resetCache`.
   *
   * @param {OneOrMany<AggregationStages<D>>} [pipeline] - Aggregation stage(s)
   * @return {OrPromise<AggregationPipelineResult<D>>} Pipeline results
   */
  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): OrPromise<AggregationPipelineResult<D>> {
    const collection = Object.assign([], this.cache.collection)

    if (!collection.length) {
      this.logger('Cache empty; calling #resetCache before running pipeline.')
      return collection
    }

    return AbstractMangoFinder.aggregate<D, U>(
      pipeline,
      collection,
      this.options.mingo
    )
  }

  /**
   * Executes a search against `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `resetCache`.
   *
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {OrPromise<DocumentPartial<D, U>[]>} Search results
   */
  find(params?: P): OrPromise<DocumentPartial<D, U>[]> {
    if (!this.cache.collection.length) {
      this.logger('Cache empty; consider calling #resetCache before search.')
      return Object.assign([], this.cache.collection)
    }

    return AbstractMangoFinder.find<D, U, P>(
      params,
      this.cache.collection,
      this.options.mingo
    )
  }

  /**
   * Finds multiple documents by id.
   *
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {OrPromise<DocumentPartial<D, U>[]>} Specified documents
   */
  findByIds(uids?: UID[], params?: P): OrPromise<DocumentPartial<D, U>[]> {
    return AbstractMangoFinder.findByIds<D, U, P>(
      uids,
      params,
      this.cache.collection,
      this.options.mingo
    ) as DocumentPartial<D, U>[]
  }

  /**
   * Finds a document by unique identifier.
   *
   * Returns `null` if the document isn't found.
   *
   * @param {UID} uid - Unique identifier for document
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {OrPromise<DocumentPartial<D, U> | null>} Document or null
   */
  findOne(uid: UID, params?: P): OrPromise<DocumentPartial<D, U> | null> {
    return AbstractMangoFinder.findOne(
      uid,
      params,
      this.cache.collection,
      this.options.mingo
    )
  }

  /**
   * Finds a document by unique identifier.
   *
   * Throws an error if the document isn't found.
   *
   * @param {UID} uid - Unique identifier for document
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {OrPromise<DocumentPartial<D, U>>} Document
   * @throws {Exception}
   */
  findOneOrFail(uid: UID, params?: P): OrPromise<DocumentPartial<D, U>> {
    return AbstractMangoFinder.findOneOrFail(
      uid,
      params,
      this.cache.collection,
      this.options.mingo
    ) as DocumentPartial<D, U>
  }

  /**
   * Queries `this.cache.collection`.
   *
   * @param {Q | string} [query] - Document query object or string
   * @return {OrPromise<DocumentPartial<D, U>[]>} Search results
   */
  query(query?: Q | string): OrPromise<DocumentPartial<D, U>[]> {
    return AbstractMangoFinder.find<D, U, P>(
      this.mparser.params(query) as P,
      this.cache.collection,
      this.options.mingo
    )
  }

  /**
   * Queries multiple documents by unique identifier.
   *
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {Q | string} [query] - Document query object or string
   * @return {OrPromise<DocumentPartial<D, U>[]>} Documents
   */
  queryByIds(
    uids?: UID[],
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U>[]> {
    return AbstractMangoFinder.findByIds<D, U, P>(
      uids,
      this.mparser.params(query) as P,
      this.cache.collection,
      this.options.mingo
    )
  }

  /**
   * Queries a document by unique identifier.
   *
   * Returns `null` if the document isn't found.
   *
   * @param {UID} uid - Unique identifier for document
   * @param {Q | string} [query] - Document query object or string
   * @return {OrPromise<DocumentPartial<D, U> | null>} Document or null
   */
  queryOne(
    uid: UID,
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U> | null> {
    return AbstractMangoFinder.findOne(
      uid,
      this.mparser.params(query) as P,
      this.cache.collection,
      this.options.mingo
    )
  }

  /**
   * Queries a document by id.
   *
   * Throws an error if the document isn't found.
   *
   * @param {UID} uid - Unique identifier for document
   * @param {Q | string} [query] - Document query object or string
   * @return {OrPromise<DocumentPartial<D, U>>} Document
   */
  queryOneOrFail(
    uid: UID,
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U>> {
    return AbstractMangoFinder.findOneOrFail(
      uid,
      this.mparser.params(query) as P,
      this.cache.collection,
      this.options.mingo
    )
  }

  /**
   * Updates the plugin's the data cache.
   *
   * @param {D[]} [collection] - Documents to insert into cache
   * @return {OrPromise<MangoCacheFinder<D>>} Copy of updated cache
   */
  resetCache(collection: D[] = []): OrPromise<MangoCacheFinder<D>> {
    if (!Array.isArray(collection)) collection = []

    const documents = Object.freeze(Object.assign([], collection))

    // @ts-expect-error resetting cache
    this.cache = Object.freeze({ collection: documents })

    return { ...this.cache }
  }

  /**
   * Returns the name of the document uid field.
   *
   * @return {string} Name of document uid field
   */
  uid(): string {
    return this.options.mingo.idKey as string
  }
}
