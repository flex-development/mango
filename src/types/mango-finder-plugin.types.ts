import type { QueryCriteriaOptions } from '@/interfaces'
import type { OneOrMany, PlainObject } from '@flex-development/tutils'
import type { DocumentPath } from './document.types'
import type { QueryCriteria } from './mingo.types'

/**
 * @file Type Definitions - MangoFinder
 * @module types/mango-plugin
 */

/**
 * Search parameters (query criteria and options) for collection objects.
 *
 * @template D - Document (collection object)
 */
export type MangoSearchParams<
  D extends PlainObject = PlainObject
> = QueryCriteria<D> & {
  options?: QueryCriteriaOptions<D>
}

/**
 * Parsed URL query parameters for collection objects.
 *
 * @template D - Document (collection object)
 */
export type MangoParsedUrlQuery<D extends PlainObject = PlainObject> = Partial<
  Record<DocumentPath<D>, OneOrMany<string>>
> & {
  fields?: string
  limit?: string
  q?: string
  sort?: string
}
