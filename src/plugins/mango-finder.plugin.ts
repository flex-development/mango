import AbstractMangoFinder from '@/abstracts/mango-finder.abstract'
import type {
  AggregationStages,
  IMangoFinder,
  MangoCacheFinder,
  QueryCriteriaOptions
} from '@/interfaces'
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
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany
} from '@flex-development/tutils'

/**
 * @file Plugin - MangoFinder
 * @module plugins/MangoFinder
 */

/**
 * Synchronous plugin for [`mingo`][1] and [`qs-to-mongo`][2].
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
 * @implements {IMangoFinder<D, U, P, Q>}
 */
export default class MangoFinder<
    D extends ObjectPlain = ObjectUnknown,
    U extends string = DUID,
    P extends MangoSearchParams<D> = MangoSearchParams<D>,
    Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
  >
  extends AbstractMangoFinder<D, U, P, Q>
  implements IMangoFinder<D, U, P, Q> {
  /**
   * Runs an aggregation pipeline for `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @param {OneOrMany<AggregationStages<D>>} [pipeline] - Aggregation stage(s)
   * @return {AggregationPipelineResult<D>} Pipeline results
   */
  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): AggregationPipelineResult<D> {
    return super.aggregate(pipeline)
  }

  /**
   * Executes a search against `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @param {P} [params] - Search parameters
   * @param {QueryCriteriaOptions<D>} [params.options] - Search options
   * @param {ProjectStage<D>} [params.options.$project] - Fields to include
   * @param {number} [params.options.limit] - Limit number of results
   * @param {number} [params.options.skip] - Skips the first n documents
   * @param {DocumentSortingRules} [params.options.sort] - Sorting rules
   * @return {DocumentPartial<D, U>[]} Search results
   * @throws {Exception}
   */
  find(params?: P): DocumentPartial<D, U>[] {
    return super.find(params) as DocumentPartial<D, U>[]
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
   * @return {DocumentPartial<D, U>[]} Documents
   * @throws {Exception}
   */
  findByIds(uids?: UID[], params?: P): DocumentPartial<D, U>[] {
    return super.findByIds(uids, params) as DocumentPartial<D, U>[]
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
   * @return {DocumentPartial<D, U> | null} Document or null
   * @throws {Exception}
   */
  findOne(uid: UID, params?: P): DocumentPartial<D, U> | null {
    return super.findOne(uid, params) as DocumentPartial<D, U> | null
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
   * @return {DocumentPartial<D, U>} Document
   * @throws {Exception}
   */
  findOneOrFail(uid: UID, params?: P): DocumentPartial<D, U> {
    return super.findOneOrFail(uid, params) as DocumentPartial<D, U>
  }

  /**
   * Queries `this.cache.collection`.
   *
   * If the cache is empty, a warning will be logged to the console instructing
   * developers to call `setCache`.
   *
   * @param {Q | string} [query] - Document query object or string
   * @return {DocumentPartial<D, U>[]} Search results
   */
  query(query?: Q | string): DocumentPartial<D, U>[] {
    return super.query(query) as DocumentPartial<D, U>[]
  }

  /**
   * Queries multiple documents by unique identifier.
   *
   * @param {UID[]} [uids] - Array of unique identifiers
   * @param {Q | string} [query] - Document query object or string
   * @return {DocumentPartial<D, U>[]} Documents
   */
  queryByIds(uids?: UID[], query?: Q | string): DocumentPartial<D, U>[] {
    return super.queryByIds(uids, query) as DocumentPartial<D, U>[]
  }

  /**
   * Queries a document by unique identifier.
   *
   * Returns `null` if the document isn't found.
   *
   * @param {UID} uid - Unique identifier for document
   * @param {Q | string} [query] - Document query object or string
   * @return {DocumentPartial<D, U> | null} Document or null
   */
  queryOne(uid: UID, query?: Q | string): DocumentPartial<D, U> | null {
    return super.queryOne(uid, query) as DocumentPartial<D, U> | null
  }

  /**
   * Queries a document by id.
   *
   * Throws an error if the document isn't found.
   *
   * @param {UID} uid - Unique identifier for document
   * @param {Q | string} [query] - Document query object or string
   * @return {DocumentPartial<D, U>} Document
   */
  queryOneOrFail(uid: UID, query?: Q | string): DocumentPartial<D, U> {
    return super.queryOneOrFail(uid, query) as DocumentPartial<D, U>
  }

  /**
   * Overwrites the data collection cache.
   * If `collection` isn't defined, the cache will be cleared.
   *
   * @param {D[]} [collection] - Documents to overwrite cache
   * @return {MangoCacheFinder<D>} Copy of new cache
   */
  setCache(collection?: D[]): MangoCacheFinder<D> {
    return super.setCache(collection) as MangoCacheFinder<D>
  }
}
