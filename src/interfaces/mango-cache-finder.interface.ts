import type { ObjectPlain } from '@flex-development/tutils'

/**
 * @file Interface - MangoCacheFinder
 * @module interfaces/MangoCacheFinder
 */

/**
 * `MangoFinder` data cache.
 *
 * @template D - Document (collection object)
 */
export interface MangoCacheFinder<D extends ObjectPlain = ObjectPlain> {
  readonly collection: Readonly<D[]>
}
