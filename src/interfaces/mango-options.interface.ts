import type { UnknownObject } from '@flex-development/tutils'
import type { MangoParserOptions } from './mango-parser-options.interface'
import type { MingoOptions } from './mingo-options.interface'

/**
 * @file Interface - MangoOptions
 * @module interfaces/MangoOptions
 */

/**
 * Options used by the `Mango` class.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface MangoOptions<
  D extends UnknownObject = UnknownObject,
  U extends keyof D = '_id'
> {
  /**
   * Aggregation and query client options.
   *
   * See: https://github.com/kofrasa/mingo
   */
  mingo: MingoOptions<D, U>

  /**
   * `MangoParser` options.
   */
  parser: MangoParserOptions<D>
}
