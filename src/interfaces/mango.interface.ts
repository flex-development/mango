import type {
  AggregationPipelineResult,
  DocumentPartial,
  MangoParsedUrlQuery,
  MangoSearchParams
} from '@/types'
import type {
  NumberString,
  OneOrMany,
  PlainObject
} from '@flex-development/tutils'
import type { Debugger } from 'debug'
import mingo from 'mingo'
import type { AggregationStages } from './aggregation-stages.interface'
import type { MangoCache } from './mango-cache.interface'
import type { MangoOptions } from './mango-options.interface'
import type { IMangoParser } from './mango-parser.interface'

/**
 * @file Interface - Mango
 * @module interfaces/Mango
 */

/**
 * `Mango` plugin interface.
 *
 * - https://github.com/kofrasa/mingo
 * - https://github.com/fox1t/qs-to-mongo
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 */
export interface IMango<
  D extends PlainObject = PlainObject,
  U extends keyof D = '_id',
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> {
  readonly cache: Readonly<MangoCache<D>>
  readonly logger: Debugger
  readonly mingo: typeof mingo
  readonly mparser: IMangoParser<D>
  readonly options: MangoOptions<D, U>

  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): AggregationPipelineResult<D>
  find(params?: P): DocumentPartial<D, U>[]
  findByIds(uids?: NumberString[], params?: P): DocumentPartial<D, U>[]
  findOne(uid: NumberString, params?: P): DocumentPartial<D, U> | null
  findOneOrFail(uid: NumberString, params?: P): DocumentPartial<D, U>
  query(query?: Q | string): DocumentPartial<D, U>[]
  queryByIds(uids?: NumberString[], query?: Q | string): DocumentPartial<D, U>[]
  queryOne(uid: NumberString, query?: Q | string): DocumentPartial<D, U> | null
  queryOneOrFail(uid: NumberString, query?: Q | string): DocumentPartial<D, U>
  resetCache(collection?: D[]): MangoCache<D>
}
