import { BSONTypeAlias } from '@/enums/bson-type-alias.enum'
import { BSONTypeCode } from '@/enums/bson-type-code.enum'
import type { Expression } from '@/types'
import type {
  JSONValue,
  ObjectPlain,
  ObjectUnknown
} from '@flex-development/tutils'
import type { AccumulatorOperators } from './accumulator-operators.interface'
import type { CustomAccumulator } from './custom-accumulator.interface'

/**
 * @file Interface - AggregationOperators
 * @module interfaces/AggregationOperators
 */

/**
 * [Aggregation Pipeline Operators][1].
 *
 * The only operators documented are those loaded by {@module config/mingo}.
 *
 * @template D - Document (collection object)
 *
 * @extends AccumulatorOperators
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/aggregation/#alphabetical-listing-of-expression-operators
 */
export interface AggregationOperators<D extends ObjectPlain = ObjectUnknown>
  extends AccumulatorOperators<D> {
  /**
   * Support package users loading additional operators.
   *
   * @todo Ensure index signature begins with dollar (`$`) sign
   */
  [x: string]: Expression<D> | CustomAccumulator | undefined

  /**
   * Returns the absolute value of a number.
   *
   * Can be any valid [expression][1] as long as it resolves to a number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/abs
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $abs?: Expression<D>

  /**
   * Adds numbers together or adds numbers and a date.
   *
   * If one of the arguments is a date, `$add` treats the other arguments as
   * milliseconds to add to the date.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * either all numbers or to numbers and a date.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/add
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $add?: Expression<D>[]

  /**
   * Evaluates an array as a set and returns `true` if no element in the array
   * is `false`. Otherwise, returns `false`.
   *
   * An empty array returns `true`.
   *
   * Each item can be any valid [expression][1] as long as it resolves to an
   * array, separate from the outer array that denotes the argument list.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/allElementsTrue
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $allElementsTrue?: Expression<D>[]

  /**
   * Evaluates one or more expressions and returns `true` if all of the
   * expressions are `true` or if evoked with no argument expressions.
   * Otherwise, returns `false`.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/and
   */
  $and?: Expression<D>[]

  /**
   * Evaluates an array as a set and returns `true` if any of the elements are
   * `true` and `false` otherwise. An empty array returns `false`.
   *
   * Each item can be any valid [expression][1] as long as it resolves to an
   * array, separate from the outer array that denotes the argument list.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/anyElementTrue
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $anyElementTrue?: Expression<D>[]

  /**
   * Returns the element at the specified array index.
   *
   * The first item in the `$arrayElemAt` expression should be an array or an
   * [expression][1] that resolves to an array. The second should be an integer
   * or an [expression][1] that resolves to an integer.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/arrayElemAt
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $arrayElemAt?: [Expression<D>, Expression<D>]

  /**
   * Converts an array into a single object.
   *
   * Can be any valid [expression][1] as long as it resolves to an array of
   * two-element arrays or array of documents that contains "k" and "v" fields.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/arrayToObject
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $arrayToObject?:
    | [[string, any], [string, any]]
    | Record<'k' | 'v', any>[]
    | Expression<D>

  /**
   * Returns the smallest integer greater than or equal to the specified number.
   *
   * Can be any valid [expression][1] as long as it resolves to a number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/ceil
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $ceil?: Expression<D>

  /**
   * Compares two values and returns:
   *
   * - `-1`: if the first value is less than the second
   * - `1`: if the first value is greater than the second
   * - `0`: if the two values are equivalent
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for values of different types.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/cmp
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $cmp?: [Expression<D>, Expression<D>]

  /**
   * Concatenates strings and returns the concatenated string.
   *
   * Each item can be any valid [expression][1] as long as it resolves to a
   * string.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/concat
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $concat?: Expression<D>[]

  /**
   * Converts a value to a specified type.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/convert
   */
  $convert?: {
    input: Expression<D>
    onError?: Expression<D>
    onNull?: Expression<D>
    to: BSONTypeAlias | BSONTypeCode
  }

  /**
   * Concatenates arrays to return the concatenated array.
   *
   * Each item can be any valid [expression][1] as long as it resolves to an
   * array, separate from the outer array that denotes the argument list.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/concatArrays
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $concatArrays?: Expression<D>[][]

  /**
   * Evaluates a boolean expression to return one of the two specified return
   * expressions.
   *
   * Each item can be any valid [expression][1].
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/cond
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $cond?:
    | { if: Expression<D>; then: Expression<D>; else: Expression<D> }
    | [Expression<D>, Expression<D>, Expression<D>]

  /**
   * Converts a date/time string to a date object.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/dateFromString
   */
  $dateFromString?: {
    dateString: Expression<D>
    format?: string
    onError?: Expression<D>
    onNull?: Expression<D>
    timezone?: string
  }

  /**
   * Converts a date object to a string according to a user-specified format.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString
   */
  $dateToString?: {
    date: Expression<D>
    format: string
    onNull?: Expression<D>
    timezone?: string
  }

  /**
   * Divides one number by another and returns the result.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/divide
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $divide?: [Expression<D>, Expression<D>]

  /**
   * Compares two values and returns:
   *
   * - `false`: values are **not** equivalent
   * - `true`: values are equivalent
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for values of different types.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/eq
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $eq?: [Expression<D>, Expression<D>]

  /**
   * Raises Euler's number (`e`) to the specified exponent and returns the
   * result.
   *
   * Can be any valid [expression][1] as long as it resolves to a number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/exp
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $exp?: Expression<D>

  /**
   * Selects a subset of an array to return based on the specified condition.
   * Returns an array with only those elements that match the condition. The
   * returned elements are in the original order.
   *
   * The `input` field can be any valid [expression][1] as long as it resolves
   * to an array. The `cond` field can be any valid [expression][1] as long as
   * it resolves to a boolean.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/filter
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $filter?: { as?: string; cond: Expression<D>; input: Expression<D> }

  /**
   * Returns the largest integer less than or equal to the specified number.
   *
   * Can be any valid [expression][1] as long as it resolves to a number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/floor
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $floor?: Expression<D>

  /**
   * Compares two values and returns:
   *
   * - `false`: first value is *less than or equal to* the second value
   * - `true`: first value is *greater than* the second value
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for values of different types.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/gt
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $gt?: [Expression<D>, Expression<D>]

  /**
   * Compares two values and returns:
   *
   * - `false`: first value is *less than* the second value
   * - `true`: first value is *greater than or equal to* the second value
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for values of different types.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/gte
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $gte?: [Expression<D>, Expression<D>]

  /**
   * Evaluates an expression and returns the value of the expression if the
   * expression evaluates to a non-null value.
   *
   * If the expression evaluates to a `null` value, including instances of
   * `undefined` values or missing fields, returns the value of the replacement
   * expression.
   *
   * Each item can be any valid [expression][1].
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/ifNull
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $ifNull?: [Expression<D>, Expression<D>]

  /**
   * Returns a boolean indicating whether a specified value is in an array.
   *
   * Each item can be any valid [expression][1] as long as the second item
   * resolves to an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/in
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $in?: [Expression<D>, Expression<D>]

  /**
   * Searches an array for an occurrence of a specified value and returns the
   * array index (zero-based) of the first occurrence. If the value is not
   * found, returns `-1`.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/indexOfArray
   */
  $indexOfArray?:
    | [Expression<D>, Expression<D>, Expression<D>, Expression<D>]
    | [Expression<D>, Expression<D>]

  /**
   * Determines if the operand is an array. Returns a boolean.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/isArray
   */
  $isArray?: Expression<D>

  /**
   * Binds [variables][1] for use in the specified expression, and returns the
   * result of the expression.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/let
   *
   * [1]: https://docs.mongodb.com/manual/reference/aggregation-variables/
   */
  $let?: { in: Expression<D>; vars: Record<string, Expression<D>> }

  /**
   * Returns a value without parsing. Use for values that the aggregation
   * pipeline may interpret as an [expression][1].
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/literal
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $literal?: JSONValue

  /**
   * Calculates the natural logarithm ln (`log e`) of a number and returns the
   * result as a double.
   *
   * Can be any valid [expression][1] as long as it resolves to a non-negative
   * number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/ln
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $ln?: Expression<D>

  /**
   * Calculates the log of a number in the specified base and returns the result
   * as a double.
   *
   * Each item can be any valid [expression][1] as long as the first item
   * resolves to a non-negative number and the second resolves to a positive
   * number greater than 1.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/log
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $log?: [Expression<D>, Expression<D>]

  /**
   * Calculates the log base 10 of a number and returns the result as a double.
   *
   * Can be any valid [expression][1] as long as it resolves to a non-negative
   * number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/log10
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $log10?: Expression<D>

  /**
   * Compares two values and returns:
   *
   * - `false`: first value is *greater than or equal to* the second value
   * - `true`: first value is *less than* the second value
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for values of different types.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/lt
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $lt?: [Expression<D>, Expression<D>]

  /**
   * Compares two values and returns:
   *
   * - `false`: first value is *greater than* the second value
   * - `true`: first value is *less than or equal to* the second value
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for values of different types.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/lte
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $lte?: [Expression<D>, Expression<D>]

  /**
   * Returns a document created by combining the input documents for each group.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/mergeObjects
   */
  $mergeObjects?: Expression<D>[]

  /**
   * Applies an expression to each item in an array and returns an array with
   * the applied results.
   *
   * The `input` field can be any valid [expression][1] as long as it resolves
   * to an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/map
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $map?: { as?: string; input: Expression<D>; in: Expression<D> }

  /**
   * Divides one number by another and returns the remainder.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/mod
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $mod?: [Expression<D>, Expression<D>]

  /**
   * Multiplies numbers together and returns the result.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/multiply
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $multiply?: Expression<D>[]

  /**
   * Compares two values and returns:
   *
   * - `false`: values are equivalent
   * - `true`: values are **not** equivalent
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for values of different types.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/ne
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   */
  $ne?: [Expression<D>, Expression<D>]

  /**
   * Returns a boolean indicating whether a specified value is NOT in an array.
   *
   * Each item can be any valid [expression][1] as long as the second item
   * resolves to an array.
   *
   * NOTE: This expression operator is missing from the documentation.
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $nin?: [Expression<D>, Expression<D>]

  /**
   * Evaluates a boolean and returns the opposite boolean value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/not
   */
  $not?: Expression<D>[]

  /**
   * Converts a document to an array.
   *
   * The return array contains an element for each field/value pair in the
   * original document. Each element in the return array is a document that
   * contains two fields k and v:
   *
   * - `k`: field name in the original document
   * - `v`: value of the field in the original document
   *
   * Can be any valid [expression][1] as long as it resolves to an object.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/objectToArray
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $objectToArray?: Expression<D>

  /**
   * Evaluates one or more expressions and returns `true` if any of the
   * expressions are `true`. Otherwise, returns `false`.
   */
  $or?: Expression<D>[]

  /**
   * Raises a number to the specified exponent and returns the result.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/pow
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $pow?: [Expression<D>, Expression<D>]

  /**
   * Returns an array whose elements are a generated sequence of numbers.
   *
   * Generates the sequence from the specified starting number by successively
   * incrementing the starting number by the specified step value up to but not
   * including the end point.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers. If defined, the third expression must resolve to a non-zero
   * number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/range
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $range?:
    | [Expression<D>, Expression<D>, Expression<D>]
    | [Expression<D>, Expression<D>]

  /**
   * Applies an expression to each element in an array and combines them into a
   * single value.
   *
   * The `input` field can be any valid [expression][1] as long as it resolves
   * to an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/reduce
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $reduce?: {
    initialValue: Expression<D>
    input: Expression<D>
    in: Expression<D>
  }

  /**
   * Returns an array with the elements in reverse order.
   *
   * Can be any valid [expression][1] as long as it resolves to an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/reverseArray
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $reverseArray?: Expression<D>

  /**
   * Rounds a number to a whole integer or to a specified decimal place.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers. The second item, if defined, should resolve to a number between
   * `-20` and `100`.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/round
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $round?: [Expression<D>, Expression<D>] | [Expression<D>]

  /**
   * Takes two sets and returns an array containing the elements that only exist
   * in the first set.
   *
   * Each item can be any valid [expression][1] as long as they each resolve to
   * an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/setDifference
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $setDifference?: [Expression<D>, Expression<D>]

  /**
   * Compares two or more arrays and returns `true` if they have the same
   * distinct elements and `false` otherwise.
   *
   * Each item can be any valid [expression][1] as long as they each resolve to
   * an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/setEquals
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $setEquals?: Expression<D>[]

  /**
   * Takes two or more arrays and returns an array that contains the elements
   * that appear in every input array.
   *
   * Each item can be any valid [expression][1] as long as they each resolve to
   * an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/setIntersection
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $setIntersection?: Expression<D>[]

  /**
   * Takes two arrays and returns `true` when the first array is a subset of the
   * second, including when the first array equals the second array, and `false`
   * otherwise.
   *
   * Each item can be any valid [expression][1] as long as they each resolve to
   * an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/setIsSubset
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $setIsSubset?: [Expression<D>, Expression<D>]

  /**
   * Takes two or more arrays and returns an array containing the elements that
   * appear in any input array.
   *
   * Each item can be any valid [expression][1] as long as they each resolve to
   * an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/setUnion
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $setUnion?: Expression<D>[]

  /**
   * Counts and returns the total number of items in an array.
   *
   * Can be any valid [expression][1] as long as it resolves to an array.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/size
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $size?: Expression<D>

  /**
   * Returns a subset of an array.
   *
   * Each item can be any valid [expression][1] as long as the first item
   * resolves to an array, and the second and (optional) third item resolve to
   * numbers.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/slice
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $slice?:
    | [Expression<D>, Expression<D>, Expression<D>]
    | [Expression<D>, Expression<D>]

  /**
   * Divides a string into an array of substrings based on a delimiter.
   *
   * Each item can be any valid [expression][1] as long as they each resolve to
   * strings.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/split
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $split?: [Expression<D>, Expression<D>]

  /**
   * Calculates the square root of a positive number and returns the result as a
   * double.
   *
   * Can be any valid [expression][1] as long as it resolves to a non-negative
   * number.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/sqrt
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $sqrt?: Expression<D>

  /**
   * Returns the number of UTF-8 [code points][1] in the specified string.
   *
   * Can be any valid [expression][2] as long as it resolves to a string.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/strLenCP
   *
   * [1]: http://www.unicode.org/glossary/#code_point
   * [2]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $strLenCP?: Expression<D>

  /**
   * Performs case-insensitive comparison of two strings. Returns:
   *
   * - `1`: first string is "greater than" the second string
   * - `0`: the two strings are equal
   * - `-1`: first string is "less than" the second string
   *
   * Each item can be any valid [expression][1] as long as they each resolve to
   * strings.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/strcasecmp
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $strcasecmp?: [Expression<D>, Expression<D>]

  /**
   * Subtracts two numbers to return the difference, or two dates to return the
   * difference in milliseconds, or a date and a number in milliseconds to
   * return the resulting date.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers and/or dates.
   *
   * To subtract a number from a date, the date must be the first argument.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/subtract
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $subtract?: [Expression<D>, Expression<D>]

  /**
   * Evaluates a series of case expressions. When an expression that evaluates
   * to `true` is found, `$switch` executes a specified expression and breaks
   * out of the control flow.
   *
   * The `case` field of each branch in the `branches` can be any valid
   * [expression][1] that resolves to a boolean value.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/switch
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $switch?: {
    branches: { case: Expression<D>; then: Expression<D> }[]
    default: Expression<D>
  }

  /**
   * Converts a string to lowercase, returning the result.
   *
   * Can be any valid [expression][1] as long as it resolves to a string.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/toLower
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $toLower?: Expression<D>

  /**
   * Converts a string to uppercase, returning the result.
   *
   * Can be any valid [expression][1] as long as it resolves to a string.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/toUpper
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $toUpper?: Expression<D>

  /**
   * Removes whitespace characters, including `null`, or the specified
   * characters (`chars`) from the beginning and end of a string.
   *
   * Both the `chars` and `input` fields can be any valid [expression][1] as
   * long as they each resolve to a string.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/trim
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $trim?: { chars?: Expression<D>; input: Expression<D> }

  /**
   * Truncates a number to a whole integer or to a specified decimal place.
   *
   * Each item can be any valid [expression][1] as long as they resolve to
   * numbers. The second item, if defined, should resolve to a number between
   * `-20` and `100`.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/trunc
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $trunc?: [Expression<D>, Expression<D>] | [Expression<D>]

  /**
   * Transposes an array of input arrays so that the first element of the output
   * array would be an array containing, the first element of the first input
   * array, the first element of the second input array, etc.
   *
   * For example, `$zip` would transform `[ [ 1, 2, 3 ], [ 'a', 'b', 'c' ] ]`
   * into `[ [ 1, 'a' ], [ 2, 'b' ], [ 3, 'c' ] ]`.
   *
   * The `defaults` field can be any valid [expression][1] that resolves to an
   * array. The `inputs` field can be any valid [expression][1] that resolves to
   * an array of arrays.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/zip
   *
   * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#std-label-aggregation-expressions
   */
  $zip?: {
    defaults?: Expression<D>
    inputs: Expression<D>[]
    useLongestLength?: boolean
  }
}
