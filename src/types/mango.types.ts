import type { QueryCriteriaOptions } from '@/interfaces'
import type { OneOrMany } from '@flex-development/tutils'
import type { Document, DocumentPath } from './document.types'
import type { QueryCriteria } from './mingo.types'

/**
 * @file Type Definitions - Mango API
 * @module types/mango
 */

/**
 * Search parameters (query criteria and options) for collection objects.
 *
 * @template D - Document (collection object)
 */
export type MangoSearchParams<
  D extends Document = Document
> = QueryCriteria<D> & {
  options?: QueryCriteriaOptions<D>
}

/**
 * Parsed URL query parameters for collection objects.
 *
 * @template D - Document (collection object)
 */
export type MangoParsedUrlQuery<D extends Document = Document> = Partial<
  Record<DocumentPath<D>, OneOrMany<string>>
> & {
  fields?: string
  limit?: string
  q?: string
  sort?: string
}
