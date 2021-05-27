import AbstractMangoFinder from '@/abstracts/mango-finder.abstract'
import logger from '@/config/logger'
import type {
  AggregationStages,
  IMangoFinderAsync,
  MangoCacheFinder,
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
import type { Debugger } from 'debug'

/**
 * @file Plugin - MangoFinderAsync
 * @module plugins/MangoFinderAsync
 */

/**
 * Asynchronous plugin for [`mingo`][1] and [`qs-to-mongo`][2].
 *
 * Run aggregation pipelines and execute searches against in-memory object
 * collections. Query documents using a URL query, or search for them using a
 * query criteria and options object.
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
 * @extends AbstractMangoFinder
 * @implements {IMangoFinderAsync<D, U, P, Q>}
 */
export default class MangoFinderAsync<
    D extends ObjectPlain = ObjectUnknown,
    U extends string = DUID,
    P extends MangoSearchParams<D> = MangoSearchParams<D>,
    Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
  >
  extends AbstractMangoFinder<D, U, P, Q>
  implements IMangoFinderAsync<D, U, P, Q> {
  /**
   * @readonly
   * @instance
   * @property {Debugger} logger - Internal logger
   */
  readonly logger: Debugger = logger.extend('plugin').extend('async')

  /**
   * Runs an aggregation pipeline for `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @async
   * @param {OneOrMany<AggregationStages<D>>} [pipeline] - Aggregation stage(s)
   * @return {Promise<PipelineResult<D>>} Promise containing pipeline results
   */
  async aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): Promise<PipelineResult<D>> {
    return super.aggregate(pipeline)
  }

  /**
   * Executes a search against `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @async
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules<D>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<D, U>[]>} Promise containing search results
   */
  async find(params?: P): Promise<PartialDoc<D, U>[]> {
    return super.find(params)
  }

  /**
   * Finds multiple documents by id.
   *
   * @async
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules<D>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<D, U>[]>} Promise containing specified docs
   */
  async findByIds(uids?: UID[], params?: P): Promise<PartialDoc<D, U>[]> {
    return super.findByIds(uids, params)
  }

  /**
   * Finds a document by unique identifier.
   *
   * Returns `null` if the document isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for document
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules<D>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<D, U> | null>} Promise containing doc or null
   */
  async findOne(uid: UID, params?: P): Promise<PartialDoc<D, U> | null> {
    return super.findOne(uid, params)
  }

  /**
   * Finds a document by unique identifier.
   *
   * Throws an error if the document isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for document
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules<D>} [params.options.sort] - Sorting rules
   * @return {Promise<PartialDoc<D, U>>} Promise containing document
   * @throws {Exception}
   */
  async findOneOrFail(uid: UID, params?: P): Promise<PartialDoc<D, U>> {
    return super.findOneOrFail(uid, params)
  }

  /**
   * Queries `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @async
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<D, U>[]>} Promise containing search results
   */
  async query(query?: Q | string): Promise<PartialDoc<D, U>[]> {
    return super.query(query)
  }

  /**
   * Queries multiple documents by unique identifier.
   *
   * @async
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<D, U>[]>} Promise containing specified docs
   */
  async queryByIds(
    uids?: UID[],
    query?: Q | string
  ): Promise<PartialDoc<D, U>[]> {
    return super.queryByIds(uids, query)
  }

  /**
   * Queries a document by unique identifier.
   *
   * Returns `null` if the document isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for document
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<D, U> | null>} Promise containing doc or null
   */
  async queryOne(
    uid: UID,
    query?: Q | string
  ): Promise<PartialDoc<D, U> | null> {
    return super.queryOne(uid, query)
  }

  /**
   * Queries a document by id.
   *
   * Throws an error if the document isn't found.
   *
   * @async
   * @param {UID} uid - Unique identifier for document
   * @param {Q | string} [query] - Document query object or string
   * @return {Promise<PartialDoc<D, U>>} Promise containing document
   */
  async queryOneOrFail(
    uid: UID,
    query?: Q | string
  ): Promise<PartialDoc<D, U>> {
    return super.queryOneOrFail(uid, query)
  }

  /**
   * Overwrites the data collection cache.
   *
   * If `collection` isn't defined, the cache will be cleared.
   *
   * @async
   * @param {D[]} [collection] - Documents to overwrite cache
   * @return {Promise<MangoCacheFinder<D>>} Promise containing copy of new cache
   */
  async setCache(collection?: D[]): Promise<MangoCacheFinder<D>> {
    return super.setCache(collection)
  }
}
