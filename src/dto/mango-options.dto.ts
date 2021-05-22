import type { MangoOptions } from '@/interfaces'
import type { PlainObject } from '@flex-development/tutils'

/**
 * @file Interface - MangoOptions
 * @module interfaces/MangoOptions
 */

/**
 * Options accepted by the `Mango` class constructor.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface MangoOptionsDTO<
  D extends PlainObject = PlainObject,
  U extends keyof D = '_id'
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
  mingo?: Partial<MangoOptions<D, U>['mingo']>

  /**
   * `MangoParser` options.
   */
  parser?: MangoOptions<D, U>['parser']
}
