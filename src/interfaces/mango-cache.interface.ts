import type { PlainObject } from '@flex-development/tutils'

/**
 * @file Interface - MangoCache
 * @module interfaces/MangoCache
 */

/**
 * `Mango` plugin data cache.
 *
 * @template D - Document (collection object)
 */
export interface MangoCache<D extends PlainObject = PlainObject> {
  readonly collection: Readonly<D[]>
}
