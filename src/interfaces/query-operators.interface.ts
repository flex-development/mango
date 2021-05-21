import { BSONTypeAlias } from '@/enums/bson-type-alias.enum'
import { BSONTypeCode } from '@/enums/bson-type-code.enum'
import type { Document, Expression } from '@/types'
import type { JSONValue } from '@flex-development/tutils'

/**
 * @file Interface - QueryOperators
 * @module interfaces/QueryOperators
 */

/**
 * [Query Operators][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/query/#query-selectors
 */
export interface QueryOperators<D extends Document = Document> {
  /**
   * Selects the documents where the value of a field is an array that contains
   * all the specified elements.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/all
   */
  $all?: JSONValue[]

  /**
   * Joins query clauses with a logical **AND** returns all documents that match
   * the conditions of both clauses.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/and
   */
  $and?: Record<string, QueryOperators>[]

  /**
   * Matches documents that contain an array field with at least one element
   * that matches all the specified query criteria.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/elemMatch
   */
  $elemMatch?: QueryOperators | Record<string, JSONValue | QueryOperators>

  /**
   * Matches values that are equal to a specified value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/eq
   */
  $eq?: JSONValue

  /**
   * Allows the use of aggregation expressions within the query language.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/expr
   */
  $expr?: Expression<D>

  /**
   * Matches documents that have the specified field.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/exists
   */
  $exists?: boolean

  /**
   * Matches values that are greater than a specified value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/gt
   */
  $gt?: JSONValue

  /**
   * Matches values that are greater than or equal to a specified value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/gte
   */
  $gte?: JSONValue

  /**
   * Matches any of the values specified in an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/in
   */
  $in?: JSONValue[]

  /**
   * Matches values that are less than or equal to a specified value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/lt
   */
  $lt?: JSONValue

  /**
   * Matches values that are less than or equal to a specified value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/lte
   */
  $lte?: JSONValue

  /**
   * Select documents where the value of a field divided by a divisor has the
   * specified remainder (i.e. perform a modulo operation to select documents).
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/mod
   */
  $mod?: [number, number]

  /**
   * Matches all values that are not equal to a specified value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/ne
   */
  $ne?: JSONValue

  /**
   * Matches none of the values specified in an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/nin
   */
  $nin?: JSONValue[]

  /**
   * Joins query clauses with a logical **NOR** returns all documents that fail
   * to match both clauses.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/nor
   */
  $nor?: JSONValue

  /**
   * Inverts the effect of a query expression and returns documents that do
   * *not* match the query expression.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/not
   */
  $not?: QueryOperators

  /**
   * `$regex` options.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/regex/#mongodb-query-op.-options
   */
  $options?: string

  /**
   * Joins query clauses with a logical **OR** returns all documents that match
   * the conditions of either clause.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/or
   */
  $or?: Record<string, QueryOperators>[]

  /**
   * Selects documents where values match a specified regular expression.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/regex
   */
  $regex?: string

  /**
   * Matches any array with the number of elements specified.
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/size
   */
  $size?: number

  /**
   * Selects documents if a field is of the specified [BSON type][1].
   *
   * - https://docs.mongodb.com/manual/reference/operator/query/type
   *
   * [1]: https://docs.mongodb.com/manual/reference/operator/query/type/#available-types
   */
  $type?: BSONTypeAlias | BSONTypeCode
}
