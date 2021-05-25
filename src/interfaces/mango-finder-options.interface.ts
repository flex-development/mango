import type { DUID } from '@/types'
import type { ObjectPlain } from '@flex-development/tutils'
import type { MangoParserOptions } from './mango-parser-options.interface'
import type { MingoOptions } from './mingo-options.interface'

/**
 * @file Interface - MangoFinderOptions
 * @module interfaces/MangoFinderOptions
 */

/**
 * Options used by the `MangoFinder` class.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface MangoFinderOptions<
  D extends ObjectPlain = ObjectPlain,
  U extends string = DUID
> {
  /**
   * Aggregation and query client options.
   *
   * See: https://github.com/kofrasa/mingo
   */
  mingo: MingoOptions<U>

  /**
   * `MangoParser` options.
   */
  parser: MangoParserOptions<D>
}
