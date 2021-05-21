import type { Options as MingoOptions } from 'mingo/core'
import type { MangoParserOptions } from './mango-parser-options.interface'

/**
 * @file Interface - MangoOptions
 * @module interfaces/MangoOptions
 */

/**
 * Options accepted by the `Mango` class.
 */
export interface MangoOptions {
  /**
   * Aggregation and query client options.
   *
   * See: https://github.com/kofrasa/mingo
   */
  mingo?: MingoOptions

  /**
   * `MangoParser` options.
   */
  parser?: MangoParserOptions
}
