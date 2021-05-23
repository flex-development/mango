import type { MangoFinderPluginOptions } from '@/interfaces'
import type { DUID } from '@/types'
import type { PlainObject } from '@flex-development/tutils'

/**
 * @file Data Transfer Object - MangoFinderPluginOptionsDTO
 * @module dto/MangoFinderPluginOptionsDTO
 */

/**
 * Options accepted by the `Mango` class constructor.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface MangoFinderPluginOptionsDTO<
  D extends PlainObject = PlainObject,
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
  mingo?: Partial<MangoFinderPluginOptions<D, U>['mingo']>

  /**
   * `MangoParser` options.
   */
  parser?: MangoFinderPluginOptions<D, U>['parser']
}
