import type { OneOrMany } from '@flex-development/tutils'
import type { CustomQSMongoParser } from './custom-qs-mongo-parser.interface'

/**
 * @file Interface - MangoParserOptions
 * @module interfaces/MangoParserOptions
 * @see https://github.com/fox1t/qs-to-mongo
 */

/**
 * Options accepted by the `MangoParser` mixin and [`qs-to-mongo`][1] module.
 *
 * **NOTE**: `objectIdFields` and `parameters` are not accepted.
 *
 * [1]: https://github.com/fox1t/qs-to-mongo#options
 */
export interface MangoParserOptions {
  /**
   * Fields that will be converted to `Date`. If no fields are passed, any valid
   * date string will be converted to [ISOString][1].
   *
   * [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  dateFields?: OneOrMany<string>

  /**
   * Fields that will be used as criteria when passing `text` query parameter.
   */
  fullTextFields?: OneOrMany<string>

  /**
   * Array of query parameters that are ignored, in addition to the defaults:
   *
   * - `fields`
   * - `limit`
   * - `offset`
   * - `omit`
   * - `q`
   * - `sort`
   */
  ignoredFields?: OneOrMany<string>

  /**
   * Maximum limit that could be passed to limit option.
   */
  maxLimit?: number

  /**
   * Custom query parser.
   */
  parser?: CustomQSMongoParser

  /**
   * Options to pass to the query parser.
   */
  parserOptions?: any
}
