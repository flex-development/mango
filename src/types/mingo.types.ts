import { ProjectRule } from '@/enums/project-rule.enum'
import type {
  AggregationOperators,
  ProjectionOperators,
  QueryOperators
} from '@/interfaces'
import type {
  JSONValue,
  ObjectPlain,
  OneOrMany,
  OrPartial,
  Path
} from '@flex-development/tutils'
import { RawArray } from 'mingo/util'
import type { DocumentEnhanced, DocumentPath } from './document.types'

/**
 * @file Type Definitions - Mingo
 * @module types/mingo
 * @see https://github.com/kofrasa/mingo
 */

/**
 * Result from running aggregation pipeline.
 *
 * @template D - Document (collection object)
 */
export type AggregationPipelineResult<D extends ObjectPlain = ObjectPlain> =
  | OrPartial<DocumentEnhanced<D>>[]
  | RawArray
  | ObjectPlain

/**
 * Type representing an [Aggregation expression][1].
 *
 * ! Does not include `ExpressionObject` definition due to circular referencing.
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#expressions
 */
export type ExpressionBase<D extends ObjectPlain = ObjectPlain> =
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
export type ExpressionObject<D extends ObjectPlain = ObjectPlain> = Record<
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
export type ExpressionObject2<D extends ObjectPlain = ObjectPlain> =
  | ExpressionObject<D>
  | Record<DocumentPath<D>, ExpressionObject<D>>

/**
 * Type representing ALL [Aggregation expressions][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#expressions
 */
export type Expression<D extends ObjectPlain = ObjectPlain> =
  | ExpressionBase<D>
  | ExpressionObject2<D>

/**
 * Nested or top level document field used as MongoDB operator.
 *
 * @template D - Document (collection object)
 */
export type FieldPath<
  D extends ObjectPlain = ObjectPlain
> = `$${Path<D> extends string ? Path<D> : never}`

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
export type Projection<D extends ObjectPlain = ObjectPlain> = Partial<
  Record<DocumentPath<D>, ProjectionOperators>
>

/**
 * [Aggregation Pipeline Stage - `$project`][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/aggregation/project
 */
export type ProjectStage<D extends ObjectPlain = ObjectPlain> = Partial<
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
export type QueryCriteria<D extends ObjectPlain = ObjectPlain> = Partial<
  Record<DocumentPath<D>, JSONValue | QueryOperators>
>
