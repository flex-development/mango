import type { ParsedUrlQuery } from 'querystring'
import type { MangoParserOptions } from './mango-parser-options.interface'

/**
 * @file Interface - CustomQSMongoParser
 * @module interfaces/CustomQSMongoParser
 * @see https://github.com/fox1t/qs-to-mongo#options
 */

/**
 * Custom MongoDB query object or string parser.
 * If defined, replaces the default [`qs-to-mongo` query parser][1].
 *
 * [1]: https://github.com/fox1t/qs-to-mongo#options
 */
export interface CustomQSMongoParser {
  parse(query: string, options?: MangoParserOptions['parserOptions']): any
  stringify(
    obj: ParsedUrlQuery,
    options?: MangoParserOptions['parserOptions']
  ): string
}
