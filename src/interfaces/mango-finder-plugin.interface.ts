import type {
  AggregationPipelineResult,
  DocumentPartial,
  DUID,
  MangoParsedUrlQuery,
  MangoSearchParams,
  UID
} from '@/types'
import type {
  OneOrMany,
  OrPromise,
  PlainObject
} from '@flex-development/tutils'
import type { Debugger } from 'debug'
import mingo from 'mingo'
import type { AggregationStages } from './aggregation-stages.interface'
import type { MangoCacheFinderPlugin } from './mango-cache-finder-plugin.interface'
import type { MangoFinderPluginOptions } from './mango-finder-plugin-options.interface'
import type { IMangoParser } from './mango-parser.interface'

/**
 * @file Interface - IMangoFinderPlugin
 * @module interfaces/MangoFinderPlugin
 */

/**
 * `MangoFinderPlugin` interface.
 *
 * - https://github.com/kofrasa/mingo
 * - https://github.com/fox1t/qs-to-mongo
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 */
export interface IMangoFinderPlugin<
  D extends PlainObject = PlainObject,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> {
  readonly cache: Readonly<MangoCacheFinderPlugin<D>>
  readonly logger: Debugger
  readonly mingo: typeof mingo
  readonly mparser: IMangoParser<D>
  readonly options: MangoFinderPluginOptions<D, U>

  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): OrPromise<AggregationPipelineResult<D>>
  find(params?: P): OrPromise<DocumentPartial<D, U>[]>
  findByIds(uids?: UID[], params?: P): OrPromise<DocumentPartial<D, U>[]>
  findOne(uid: UID, params?: P): OrPromise<DocumentPartial<D, U> | null>
  findOneOrFail(uid: UID, params?: P): OrPromise<DocumentPartial<D, U>>
  query(query?: Q | string): OrPromise<DocumentPartial<D, U>[]>
  queryByIds(
    uids?: UID[],
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U>[]>
  queryOne(
    uid: UID,
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U> | null>
  queryOneOrFail(uid: UID, query?: Q | string): OrPromise<DocumentPartial<D, U>>
  resetCache(collection?: D[]): OrPromise<MangoCacheFinderPlugin<D>>
}
