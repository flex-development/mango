import { SortOrder } from '@/enums/sort-order.enum'
import type {
  Document,
  DocumentPath,
  Expression,
  FieldPath,
  ProjectStage,
  QueryCriteria
} from '@/types'
import type { OneOrMany } from '@flex-development/tutils'
import type { RawObject } from 'mingo/util'
import type { AccumulatorOperators } from './accumulator-operators.interface'
import type { BucketStageAuto } from './bucket-stage-auto.interface'
import type { BucketStage } from './bucket-stage.interface'
import type { QueryOperators } from './query-operators.interface'

/**
 * @file Interface - AggregationStages
 * @module interfaces/AggregationStages
 */

/**
 * [Aggregation Pipeline Stages][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline
 */
export interface AggregationStages<D extends Document = Document> {
  /**
   * Adds new fields to documents.
   *
   * Outputs documents that contain all existing fields from the input documents
   * and newly added fields.
   *
   * If the name of the new field is the same as an existing field name, the
   * existing field value will be overwritten with the value of the specified
   * expression.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/addFields
   */
  $addFields?: Partial<Record<string, Expression<D>>>

  /**
   * Categorizes incoming documents into groups, called buckets, based on a
   * specified expression and boundaries and outputs a document per bucket.
   *
   * Each output document contains an `id` field whose value specifies the
   * inclusive lower bound of the bucket.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/bucket
   */
  $bucket?: BucketStage<D>

  /**
   * Categorizes incoming documents into a specific number of groups, called
   * buckets, based on a specified expression.
   *
   * Bucket boundaries are automatically determined in an attempt to evenly
   * distribute the documents into the specified number of buckets.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto
   */
  $bucketAuto?: BucketStageAuto<D>

  /**
   * Name of the field that contains a count of the number of documents at this
   * stage of the aggregation pipeline.
   */
  $count?: string

  /**
   * Processes multiple aggregation pipelines within a single stage on the same
   * set of input documents.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/facet
   */
  $facet?: Partial<Record<string, AggregationStages<D>>>

  /**
   * Groups input documents by a specified identifier expression and applies the
   * accumulator expression(s), if specified, to each group.
   *
   * The output documents only contain the identifier field and, if specified,
   * accumulated fields.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/group
   */
  $group?: Record<string, AccumulatorOperators<D>> & {
    id: Expression<D> | null
  }

  /**
   * Limits the number of documents passed to the next stage in the pipeline.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/limit
   */
  $limit?: number

  /**
   * Filters the documents to pass only the documents that match the specified
   * condition(s) to the next pipeline stage.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/match
   */
  $match?: QueryCriteria<D> | QueryOperators | { $expr: Expression<D> }

  /**
   * Passes along the documents with the requested fields to the next stage in
   * the pipeline. The specified fields can be existing fields from the input
   * documents or newly computed fields.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/project
   */
  $project?: ProjectStage<D>

  /**
   * Restricts the contents of the documents based on information stored in the
   * documents themselves.
   *
   * The expression must resolve to **$$DESCEND**, **$$PRUNE**, or **$$KEEP**
   * system variables.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/redact
   */
  $redact?: Expression<D>

  /**
   * Replaces the input document with the specified object.
   *
   * The operation replaces all existing fields in the input document, including
   * the `id` field.
   *
   * `$replaceWith` is an alias for `$replaceRoot` stage.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot
   */
  $replaceRoot?: { newRoot: Expression<D> | RawObject }

  /**
   * Replaces the input document with the specified object.
   *
   * The operation replaces all existing fields in the input document, including
   * the `id` field.
   *
   * `$replaceWith` is an alias for `$replaceRoot` stage.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/replaceWith
   */
  $replaceWith?: Expression<D> | RawObject

  /**
   * Randomly selects the specified number of documents from its input.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/sample
   */
  $sample?: { size: number }

  /**
   * Skips the first n documents where n is the specified skip number and passes
   * the remaining documents unmodified to the pipeline.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/skip
   */
  $skip?: number

  /**
   * Reorders the document stream by a specified sort key.
   * Only the order changes; the documents remain unmodified.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/sort
   */
  $sort?: Partial<Record<DocumentPath<D>, SortOrder | { $meta: 'textScore' }>>

  /**
   * Groups incoming documents based on the value of a specified expression,
   * then computes the count of documents in each distinct group.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/sortByCount
   */
  $sortByCount?: Expression<D>

  /**
   * Removes/excludes fields from documents.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/unset
   */
  $unset?: OneOrMany<DocumentPath<D>>

  /**
   * Deconstructs an array field from the input documents to output a document
   * for each element.
   *
   * Each output document is the input document with the value of the array field
   * replaced by the element.
   *
   * - https://docs.mongodb.com/manual/reference/operator/aggregation/unwind
   */
  $unwind?: FieldPath<D>
}
