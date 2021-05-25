import type {
  CustomQSMongoParser,
  IMangoParser,
  MangoParserOptions,
  QueryCriteriaOptions
} from '@/interfaces'
import type { MangoParsedUrlQuery, MangoSearchParams } from '@/types'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany
} from '@flex-development/tutils'
import qsm from 'qs-to-mongo'
import type { ParsedOptions } from 'qs-to-mongo/lib/query/options-to-mongo'

/**
 * @file Mixin - MangoParser
 * @module mixins/MangoParser
 */

/**
 * Converts Mongo URL queries into repository search parameters objects.
 *
 * @template D - Document (collection object)
 *
 * @class
 * @implements {IMangoParser<D>}
 */
export default class MangoParser<D extends ObjectUnknown = ObjectUnknown>
  implements IMangoParser<D> {
  /**
   * @readonly
   * @instance
   * @property {typeof qsm} parser - `qs-to-mongo` module
   * @see https://github.com/fox1t/qs-to-mongo
   */
  readonly parser: typeof qsm = qsm

  /**
   * @readonly
   * @instance
   * @property {MangoParserOptions<D>} options - `qs-to-mongo` module options
   */
  readonly options: MangoParserOptions<D>

  /**
   * Creates a new `MangoParser` client.
   *
   * Converts MongoDB query objects and strings into search parameters objects,
   * and formats query criteria objects.
   *
   * - https://github.com/fox1t/qs-to-mongo
   * - https://github.com/kofrasa/mingo
   *
   * @param {MangoParserOptions<D>} [options] - Parser options
   * @param {OneOrMany<string>} [options.dateFields] - Fields that will be
   * converted to `Date`; if no fields are passed, any valid date string will be
   * converted to an ISO-8601 string
   * @param {OneOrMany<string>} [options.fullTextFields] - Fields that will be
   * used as criteria when passing `text` query parameter
   * @param {OneOrMany<string>} [options.ignoredFields] - Array of query
   * parameters that are ignored, in addition to the defaults (`fields`,
   * `limit`, `offset`, `omit`, `sort`, `text`)
   * @param {number} [options.maxLimit] - Max that can be passed to limit option
   * @param {CustomQSMongoParser} [options.parser] - Custom query parser
   * @param {any} [options.parserOptions] - Custom query parser options
   */
  constructor(options: MangoParserOptions<D> = {}) {
    const parser_options = Object.assign({}, options)

    Reflect.deleteProperty(parser_options, 'objectIdFields')
    Reflect.deleteProperty(parser_options, 'parameters')

    this.options = parser_options
  }

  /**
   * Convert URL query objects and strings into a search parameters objects.
   *
   * @param {MangoParsedUrlQuery<D> | string} [query] - Query object or string
   * @return {MangoSearchParams<D>} Mango search parameters object
   * @throws {Exception}
   */
  params(query: MangoParsedUrlQuery<D> | string = ''): MangoSearchParams<D> {
    let build: ObjectPlain = {}

    try {
      // @ts-expect-error `dateFields` and `fullTextFields` mapped to document
      build = this.parser(query, this.options)
    } catch ({ message, stack }) {
      const code = ExceptionStatusCode.BAD_REQUEST
      const data = { parser_options: this.options, query }

      throw new Exception(code, message, data, stack)
    }

    return {
      ...build.criteria,
      options: this.queryCriteriaOptions(build.options)
    } as MangoSearchParams<D>
  }

  /**
   * Converts parsed URL query criteria options into `QueryCriteriaOptions`
   * objects.
   *
   * @param {Partial<ParsedOptions>} [base] - Parsed query criteria options
   * @return {QueryCriteriaOptions<D>} Query criteria options
   */
  queryCriteriaOptions(
    base: Partial<ParsedOptions> = {}
  ): QueryCriteriaOptions<D> {
    const { projection, sort, ...rest } = base

    return {
      ...rest,
      $project: projection as QueryCriteriaOptions<D>['$project'],
      sort: sort as QueryCriteriaOptions<D>['sort']
    }
  }
}
