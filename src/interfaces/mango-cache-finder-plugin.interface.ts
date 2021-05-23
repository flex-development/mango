import type { PlainObject } from '@flex-development/tutils'

/**
 * @file Interface - MangoCacheFinderPlugin
 * @module interfaces/MangoCacheFinderPlugin
 */

/**
 * `MangoFinderPlugin` data cache.
 *
 * @template D - Document (collection object)
 */
export interface MangoCacheFinderPlugin<D extends PlainObject = PlainObject> {
  readonly collection: Readonly<D[]>
}
