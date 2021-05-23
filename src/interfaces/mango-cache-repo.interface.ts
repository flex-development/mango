import type { RepoRoot } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { MangoCacheFinderPlugin } from './mango-cache-finder-plugin.interface'

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
  extends MangoCacheFinderPlugin<E> {
  root: RepoRoot<E>
}
