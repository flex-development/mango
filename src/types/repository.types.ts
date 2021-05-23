import type { EmptyObject, PlainObject } from '@flex-development/tutils'
import type { UID } from './utils.types'

/**
 * @file Type Definitions - Repositories
 * @module types/repository
 */

/**
 * Type representing the root of a repository.
 *
 * @template E - Entity
 */
export type RepoRoot<E extends PlainObject = PlainObject> =
  | Record<UID, E>
  | EmptyObject
