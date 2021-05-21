import type {
  ObjectPath,
  OrPartial,
  PlainObject
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
  D extends Document = Document
> = DocumentPartial<D> & {
  [x: string]: any
}

/**
 * Response that includes all attributes of a document or a subset.
 *
 * Even when a subset of attributes are requested, a partial `Document` response
 * will always include the `id` field, or the field used as the id key.
 *
 * @template D - Document (collection object)
 * @template ID - Field used as id key
 */
export type DocumentPartial<
  D extends Document = Document,
  ID extends string = 'id'
> = Omit<OrPartial<D>, 'id'> & Record<ID, string>

/**
 * Nested or top level document key.
 *
 * @template D - Document (collection object)
 */
export type DocumentPath<
  D extends Document = Document
> = ObjectPath<D> extends string ? ObjectPath<D> : never

/**
 * Type representing a collection object.
 */
export type Document = PlainObject
