import type { RepoRoot } from '@/types'
import type { ObjectPlain } from '@flex-development/tutils'
import type { MangoCacheFinder } from './mango-cache-finder.interface'

/**
 * @file Interface - MangoCacheRepo
 * @module interfaces/MangoCacheRepo
 */

/**
 * `MangoRepository` data cache.
 *
 * @template E - Entity
 *
 * @extends MangoCacheFinder
 */
export interface MangoCacheRepo<E extends ObjectPlain = ObjectPlain>
  extends MangoCacheFinder<E> {
  root: RepoRoot<E>
}
