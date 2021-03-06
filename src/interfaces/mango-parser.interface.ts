import type { MangoParsedUrlQuery, MangoSearchParams } from '@/types'
import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import qsm from 'qs-to-mongo'
import type { ParsedOptions } from 'qs-to-mongo/lib/query/options-to-mongo'
import type { MangoParserOptions } from './mango-parser-options.interface'
import type { QueryCriteriaOptions } from './query-criteria-options.interface'

/**
 * @file Interface - IMangoParser
 * @module interfaces/MangoParser
 */

/**
 * `MangoParser` mixin interface.
 *
 * See:
 *
 * - https://github.com/fox1t/qs-to-mongo
 *
 * @template D - Document (collection object)
 */
export interface IMangoParser<D extends ObjectPlain = ObjectUnknown> {
  readonly parser: typeof qsm
  readonly options: MangoParserOptions<D>

  params(query?: MangoParsedUrlQuery<D> | string): MangoSearchParams<D>
  queryCriteriaOptions(base?: Partial<ParsedOptions>): QueryCriteriaOptions<D>
}
