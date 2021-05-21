import type { Document, Expression } from '@/types'
import type { CustomAccumulator } from './custom-accumulator.interface'

/**
 * @file Interface - AccumulatorOperators
 * @module interfaces/AccumulatorOperators
 */

/**
 * [Accumulator operators][1] for the [`$group` Aggregation pipeline][2].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/aggregation/#accumulators---group-
 * [2]: https://docs.mongodb.com/manual/reference/operator/aggregation/group
 */
export interface AccumulatorOperators<D extends Document = Document> {
  /**
   * Returns the result of a user-defined accumulator function.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/accumulator
   */
  $accumulator?: CustomAccumulator

  /**
   * Returns an array of unique expression values for each group.
   * Order of the array elements is undefined.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/addToSet
   */
  $addToSet?: Expression<D>

  /**
   * Returns an average of numerical values. Ignores non-numeric values.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/avg
   */
  $avg?: Expression<D>

  /**
   * Returns a value from the first document for each group.
   *
   * Only meaningful when documents are in a defined order.
   *
   * Order is only defined if the documents are in a defined order.
   *
   * Distinct from the `$first` array operator.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/first
   */
  $first?: Expression<D>

  /**
   * Returns a value from the last document for each group.
   *
   * Only meaningful when documents are in a defined order.
   *
   * Order is only defined if the documents are in a defined order.
   *
   * Distinct from the `$last` array operator.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/last
   */
  $last?: Expression<D>

  /**
   * Returns the maximum value.
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for alues of different types.
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/max
   */
  $max?: Expression<D>

  /**
   * Returns a document created by combining the input documents for each group.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/mergeObjects
   */
  $mergeObjects?: Expression<D>

  /**
   * Returns the minimum value.
   *
   * Compares both value and type, using the [specified BSON comparison
   * order][1] for alues of different types.
   *
   * [1]: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/#std-label-bson-types-comparison-order
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/min
   */
  $min?: Expression<D>

  /**
   * Returns an array of all values that result from applying an expression to
   * each document in a group of documents that share the same group by key.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/push
   */
  $push?: Expression<D>

  /**
   * Calculates the population standard deviation. Ignores non-numeric values.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/stdDevPop
   */
  $stdDevPop?: Expression<D>

  /**
   * Calculates the sample standard deviation. Ignores non-numeric values.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/stdDevSamp
   */
  $stdDevSamp?: Expression<D>

  /**
   * Returns a sum of numerical values. Ignores non-numeric values.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/sum
   */
  $sum?: Expression<D>
}
