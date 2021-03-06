import type { MangoFinderOptions } from '@/interfaces'
import type { DUID } from '@/types'
import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'

/**
 * @file Data Transfer Object - MangoFinderOptionsDTO
 * @module dtos/MangoFinderOptionsDTO
 */

/**
 * Options accepted by the `Mango` class constructor.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface MangoFinderOptionsDTO<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID
> {
  /**
   * Initial data cache.
   */
  cache?: { collection: D[] }

  /**
   * Aggregation and query client options.
   *
   * See: https://github.com/kofrasa/mingo
   */
  mingo?: Partial<MangoFinderOptions<D, U>['mingo']>

  /**
   * `MangoParser` options.
   */
  parser?: MangoFinderOptions<D, U>['parser']
}
