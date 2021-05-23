import type { DUID } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { MangoParserOptions } from './mango-parser-options.interface'
import type { MingoOptions } from './mingo-options.interface'

/**
 * @file Interface - MangoFinderPluginOptions
 * @module interfaces/MangoFinderPluginOptions
 */

/**
 * Options used by the `MangoFinderPlugin` class.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface MangoFinderPluginOptions<
  D extends PlainObject = PlainObject,
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
