import type { Document, MangoParsedUrlQuery, MangoSearchParams } from '@/types'
import qsm from 'qs-to-mongo'
import type { ParsedOptions } from 'qs-to-mongo/lib/query/options-to-mongo'
import type { MangoParserOptions } from './mango-parser-options.interface'
import type { QueryCriteriaOptions } from './query-criteria-options.interface'

/**
 * @file Interface - IMangoParser
 * @module interfaces/IMangoParser
 */

/**
 * `MangoParser` mixin interface.
 *
 * @template D - Document (collection object)
 */
export interface IMangoParser<D extends Document = Document> {
  readonly parser: typeof qsm
  readonly options: MangoParserOptions

  params(query?: MangoParsedUrlQuery<D> | string): MangoSearchParams<D>
  queryCriteriaOptions(base?: Partial<ParsedOptions>): QueryCriteriaOptions<D>
}
