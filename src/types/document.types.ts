import { SortOrder } from '@/enums/sort-order.enum'
import type {
  NumberString,
  ObjectPath,
  OrPartial,
  PlainObject,
  UnknownObject
} from '@flex-development/tutils'

/**
 * @file Type Definitions - Documents (Collection Objects)
 * @module types/document
 */

/**
 * Document that can have additional properties after being evaluated during an
 * aggregation pipeline.
 *
 * @template D - Document (collection object)
 */
export type DocumentEnhanced<
  D extends UnknownObject = UnknownObject
> = DocumentPartial<D> & {
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
  D extends UnknownObject = UnknownObject,
  U extends keyof D = '_id'
> = Omit<OrPartial<D>, 'id'> & Record<U, NumberString>

/**
 * Nested or top level document key.
 *
 * @template D - Document (collection object)
 */
export type DocumentPath<D extends PlainObject> = ObjectPath<D> extends string
  ? ObjectPath<D>
  : never

/**
 * Document sorting rules.
 *
 * @template D - Document (collection object)
 */
export type DocumentSortingRules<
  D extends UnknownObject = UnknownObject
> = Partial<Record<DocumentPath<D>, SortOrder>>
