import { ProjectRule } from '@/enums/project-rule.enum'
import type {
  AggregationOperators,
  ProjectionOperators,
  QueryOperators
} from '@/interfaces'
import type { JSONValue, OneOrMany } from '@flex-development/tutils'
import type { Document, DocumentPath } from './document.types'

/**
 * @file Type Definitions - Mingo
 * @module types/mingo
 * @see https://github.com/kofrasa/mingo
 */

/**
 * Type representing an [Aggregation expression][1].
 *
 * ! Does not include `ExpressionObject` definition due to circular referencing.
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#expressions
 */
export type ExpressionBase<D extends Document = Document> =
  | AggregationOperators
  | JSONValue
  | LiteralExpression
  | OneOrMany<FieldPath<D>>
  | OneOrMany<typeof Date>
  | OneOrMany<typeof Number.NaN>
  | unknown[]

/**
 * Type representing an [Expression object][1].
 *
 * ! Does not include `ExpressionObject` definition due to circular referencing.
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#expression-objects
 */
export type ExpressionObject<D extends Document = Document> = Record<
  DocumentPath<D>,
  ExpressionBase<D>
>

/**
 * Type representing ALL [Expression objects][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#expression-objects
 */
export type ExpressionObject2<D extends Document = Document> =
  | ExpressionObject<D>
  | Record<DocumentPath<D>, ExpressionObject<D>>

/**
 * Type representing ALL [Aggregation expressions][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#expressions
 */
export type Expression<D extends Document = Document> =
  | ExpressionBase<D>
  | ExpressionObject2<D>

/**
 * Nested or top level document field used as MongoDB operator.
 *
 * @template D - Document (collection object)
 */
export type FieldPath<D extends Document = Document> = `$${DocumentPath<D>}`

/**
 * MongoDB [Literal expression][1].
 *
 * @template T - Type of literal
 *
 * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#literals
 */
export type LiteralExpression<T = any> = { $literal: T }

/**
 * Document fields mapped to [Projection Operators][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/query/#projection-operators
 */
export type Projection<D extends Document = Document> = Partial<
  Record<DocumentPath<D>, ProjectionOperators>
>

/**
 * [Aggregation Pipeline Stage - `$project`][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/aggregation/project
 */
export type ProjectStage<D extends Document = Document> = Partial<
  Record<DocumentPath<D>, ProjectRule | boolean>
>

/**
 * Document fields mapped to [JSON Values][1] and [Query Operators][2].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://restfulapi.net/json-data-types
 * [2]: https://docs.mongodb.com/manual/reference/operator/query/#query-selectors
 */
export type QueryCriteria<D extends Document = Document> = Partial<
  Record<DocumentPath<D>, JSONValue | QueryOperators>
>
