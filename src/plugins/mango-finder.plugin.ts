import logger from '@/config/logger'
import MINGO from '@/config/mingo'
import type { MangoFinderOptionsDTO } from '@/dtos'
import type {
  AggregationStages,
  IMangoFinder,
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
  OneOrMany,
  OrPromise
} from '@flex-development/tutils'
import type { Debugger } from 'debug'
import isEmpty from 'lodash.isempty'
import merge from 'lodash.merge'
import type { Options as OriginalMingoOptions } from 'mingo/core'

/**
 * @file Plugin - MangoFinder
 * @module plugins/MangoFinder
 */

/**
 * Plugin for [`mingo`][1] and [`qs-to-mongo`][2].
 *
 * [1]: https://github.com/kofrasa/mingo
 * [2]: https://github.com/fox1t/qs-to-mongo
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @class
 * @implements {IMangoFinder<D, U, P, Q>}
 */
export default class MangoFinder<
  D extends ObjectPlain = ObjectPlain,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> implements IMangoFinder<D, U, P, Q> {
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
   * See:
   *
   * - https://github.com/kofrasa/mingo
   * - https://github.com/fox1t/qs-to-mongo
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
   * Runs an aggregation pipeline for `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call {@method Mango#resetCache}.
   *
   * @param {OneOrMany<AggregationStages<D>>} pipeline - Aggregation stage(s)
   * @return {OrPromise<AggregationPipelineResult<D>>} Pipeline results
   * @throws {Exception}
   */
  aggregate(
    pipeline: OneOrMany<AggregationStages<D>> = []
  ): OrPromise<AggregationPipelineResult<D>> {
    const collection = Object.assign([], this.cache.collection)

    if (!collection.length) {
      this.logger('Cache empty; calling #resetCache before running pipeline.')
      return collection
    }

    let _pipeline = pipeline as ObjectPlain[]
    if (!Array.isArray(_pipeline)) _pipeline = [_pipeline]

    const options = this.options.mingo as OriginalMingoOptions

    try {
      return this.mingo.aggregate(collection, _pipeline, options)
    } catch ({ message, stack }) {
      const data = { pipeline: _pipeline }

      throw new Exception(ExceptionStatusCode.BAD_REQUEST, message, data, stack)
    }
  }

  /**
   * Executes a search against `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call {@method Mango#resetCache}.
   *
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {OrPromise<DocumentPartial<D, U>[]>} Search results
   * @throws {Exception}
   */
  find(params: P = {} as P): OrPromise<DocumentPartial<D, U>[]> {
    const { options = {}, ...criteria } = params
    const { $project = {}, limit, skip, sort } = options

    const collection = Object.assign([], this.cache.collection)

    if (!collection.length) {
      this.logger('Cache empty; consider calling #resetCache before search.')
      return collection
    }

    let source = Object.assign([], collection) as DocumentPartial<D, U>[]

    const mingo_options = this.options.mingo as OriginalMingoOptions

    try {
      // Pick fields from each document
      if ($project && !isEmpty($project)) {
        source = this.aggregate({ $project }) as DocumentPartial<D, U>[]
      }

      // Handle query criteria
      let cursor = this.mingo.find(source, criteria, {}, mingo_options)

      // Apply sorting rules
      if (sort && !isEmpty(sort)) cursor = cursor.sort(sort)

      // Apply offset
      if (typeof skip === 'number') cursor = cursor.skip(skip)

      // Limit results
      if (typeof limit === 'number') cursor = cursor.limit(limit)

      // Return search results
      return cursor.all() as DocumentPartial<D, U>[]
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
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {OrPromise<DocumentPartial<D, U>[]>} Documents
   * @throws {Exception}
   */
  findByIds(
    uids: UID[] = [],
    params: P = {} as P
  ): OrPromise<DocumentPartial<D, U>[]> {
    try {
      // Perform search
      const documents = this.find(params) as DocumentPartial<D, U>[]

      // Get specified documents
      const idKey = this.options.mingo.idKey as string
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
   * @param {UID} uid - Unique identifier for document
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {OrPromise<DocumentPartial<D, U> | null>} Document or null
   * @throws {Exception}
   */
  findOne(
    uid: UID,
    params: P = {} as P
  ): OrPromise<DocumentPartial<D, U> | null> {
    // Perform search
    const documents = this.find({ ...params, [this.options.mingo.idKey]: uid })
    const doc = documents[0]

    // Return document or null if not found
    return doc && doc[this.options.mingo.idKey as string] === uid ? doc : null
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
  findOneOrFail(
    uid: UID,
    params: P = {} as P
  ): OrPromise<DocumentPartial<D, U>> {
    const document = this.findOne(uid, params) as DocumentPartial<D, U>

    if (!document) {
      const { idKey } = this.options.mingo
      const uidstr = typeof uid === 'number' ? uid : `"${uid}"`

      const message = `Document with ${idKey} ${uidstr} does not exist`
      const data = { errors: { [idKey]: uid }, params }

      throw new Exception(ExceptionStatusCode.NOT_FOUND, message, data)
    }

    return document
  }

  /**
   * Queries `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call {@method Mango#resetCache}.
   *
   * @param {Q | string} [query] - Document query object or string
   * @return {OrPromise<DocumentPartial<D, U>[]>} Search results
   */
  query(query?: Q | string): OrPromise<DocumentPartial<D, U>[]> {
    return this.find(this.mparser.params(query) as P)
  }

  /**
   * Queries multiple documents by unique identifier.
   *
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {Q | string} [query] - Document query object or string
   * @return {OrPromise<DocumentPartial<D, U>[]>} Documents
   */
  queryByIds(
    uids: UID[] = [],
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U>[]> {
    return this.findByIds(uids, this.mparser.params(query) as P)
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
    return this.findOne(uid, this.mparser.params(query) as P)
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
    return this.findOneOrFail(uid, this.mparser.params(query) as P)
  }

  /**
   * Updates the plugin's the data cache.
   *
   * @param {D[]} collection - Documents to insert into cache
   * @return {OrPromise<MangoCacheFinder<D>>} Copy of updated cache
   */
  resetCache(collection: D[] = []): OrPromise<MangoCacheFinder<D>> {
    const documents = Object.freeze(Object.assign([], collection))

    // @ts-expect-error resetting cache
    this.cache = Object.freeze({ collection: documents })

    return { ...this.cache }
  }
}
