import { SortOrder } from '@/enums/sort-order.enum'
import type {
  ObjectPath,
  OrPartial,
  PlainObject
} from '@flex-development/tutils'
import type { UID } from './utils.types'

/**
 * @file Type Definitions - Documents (Collection Objects)
 * @module types/document
 */

/**
 * Default field used as unique identifier for documents.
 */
export type DUID = 'id'

/**
 * Document that can have additional properties after being evaluated during an
 * aggregation pipeline.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export type DocumentEnhanced<
  D extends PlainObject = PlainObject,
  U extends string = DUID
> = DocumentPartial<D, U> & {
  [x: string]: any
}

/**
 * Response that includes all attributes of a document or a subset.
 *
 * Even when a subset of attributes are requested, a partial `Document` response
 * will always include the `id` field, or the selected uid field.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export type DocumentPartial<
  D extends PlainObject = PlainObject,
  U extends string = DUID
> = Omit<OrPartial<D>, U> & Record<U, UID>

/**
 * Nested or top level document key.
 *
 * @template D - Document (collection object)
 */
export type DocumentPath<D extends PlainObject> = ObjectPath<D>

/**
 * Document sorting rules.
 *
 * @template D - Document (collection object)
 */
export type DocumentSortingRules<D extends PlainObject = PlainObject> = Partial<
  Record<DocumentPath<D>, SortOrder>
>
