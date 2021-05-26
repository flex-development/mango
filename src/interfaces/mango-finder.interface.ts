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
 * @file Interface - IMangoFinder
 * @module interfaces/MangoFinder
 */

/**
 * Synchronous Mango Finder plugin interface.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 */
export interface IMangoFinder<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> extends IAbstractMangoFinder<D, U, P, Q> {
  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): AggregationPipelineResult<D>
  find(params?: P): DocumentPartial<D, U>[]
  findByIds(uids?: UID[], params?: P): DocumentPartial<D, U>[]
  findOne(uid: UID, params?: P): DocumentPartial<D, U> | null
  findOneOrFail(uid: UID, params?: P): DocumentPartial<D, U>
  query(query?: Q | string): DocumentPartial<D, U>[]
  queryByIds(uids?: UID[], query?: Q | string): DocumentPartial<D, U>[]
  queryOne(uid: UID, query?: Q | string): DocumentPartial<D, U> | null
  queryOneOrFail(uid: UID, query?: Q | string): DocumentPartial<D, U>
  setCache(collection?: D[]): MangoCacheFinder<D>
}
