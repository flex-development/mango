import type { PlainObject } from '@flex-development/tutils'

/**
 * @file Interface - MangoCachePlugin
 * @module interfaces/MangoCachePlugin
 */

/**
 * `MangoPlugin` data cache.
 *
 * @template D - Document (collection object)
 */
export interface MangoCachePlugin<D extends PlainObject = PlainObject> {
  readonly collection: Readonly<D[]>
}
