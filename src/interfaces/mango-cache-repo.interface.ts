import type { RepoRoot } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { MangoCacheFinder } from './mango-cache-finder.interface'

/**
 * @file Interface - MangoCacheRepo
 * @module interfaces/MangoCacheRepo
 */

/**
 * `MangoRepository` data cache.
 *
 * @template E - Entity
 */
export interface MangoCacheRepo<E extends PlainObject = PlainObject>
  extends MangoCacheFinder<E> {
  root: RepoRoot<E>
}
