import type { Document } from '@/types'

/**
 * @file Interface - MangoCache
 * @module interfaces/MangoCache
 */

/**
 * `Mango` client data cache.
 *
 * @template D - Document (collection object)
 */
export interface MangoCache<D extends Document = Document> {
  collection: D[]
}
