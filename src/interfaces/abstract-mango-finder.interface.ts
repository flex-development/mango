import type {
  AggregationPipelineResult,
  DocumentPartial,
  DUID,
  MangoParsedUrlQuery,
  MangoSearchParams,
  UID
} from '@/types'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  OrPromise
} from '@flex-development/tutils'
import type { IAbstractMangoFinderBase } from './abstract-mango-finder-base.interface'
import type { AggregationStages } from './aggregation-stages.interface'
import type { MangoCacheFinder } from './mango-cache-finder.interface'

/**
 * @file Interface - IAbstractMangoFinder
 * @module interfaces/AbstractMangoFinder
 */

/**
 * `AbstractMangoFinder` plugin interface.
 *
 * Used to define class contract of `MangoFinder`, `MangoFinderAsync`, and
 * possible derivatives.
 *
 * See:
 *
 * - https://github.com/kofrasa/mingo
 * - https://github.com/fox1t/qs-to-mongo
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @extends IAbstractMangoFinderBase
 */
export interface IAbstractMangoFinder<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> extends IAbstractMangoFinderBase<D, U> {
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
  setCache(collection?: D[]): OrPromise<MangoCacheFinder<D>>
  uid(): string
}
