import type { RepoRoot } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { MangoCachePlugin } from './mango-cache-plugin.interface'

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
  extends MangoCachePlugin<E> {
  root: RepoRoot<E>
}
