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
  OneOrMany
} from '@flex-development/tutils'
import type { IAbstractMangoFinder } from './abstract-mango-finder.interface'
import type { AggregationStages } from './aggregation-stages.interface'
import type { MangoCacheFinder } from './mango-cache-finder.interface'

/**
 * @file Interface - IMangoFinderAsync
 * @module interfaces/MangoFinderAsync
 */

/**
 * Asynchronous Mango Finder plugin interface.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @extends IAbstractMangoFinder
 */
export interface IMangoFinderAsync<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> extends IAbstractMangoFinder<D, U, P, Q> {
  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): Promise<AggregationPipelineResult<D>>
  find(params?: P): Promise<DocumentPartial<D, U>[]>
  findByIds(uids?: UID[], params?: P): Promise<DocumentPartial<D, U>[]>
  findOne(uid: UID, params?: P): Promise<DocumentPartial<D, U> | null>
  findOneOrFail(uid: UID, params?: P): Promise<DocumentPartial<D, U>>
  query(query?: Q | string): Promise<DocumentPartial<D, U>[]>
  queryByIds(uids?: UID[], query?: Q | string): Promise<DocumentPartial<D, U>[]>
  queryOne(uid: UID, query?: Q | string): Promise<DocumentPartial<D, U> | null>
  queryOneOrFail(uid: UID, query?: Q | string): Promise<DocumentPartial<D, U>>
  setCache(collection?: D[]): Promise<MangoCacheFinder<D>>
}
