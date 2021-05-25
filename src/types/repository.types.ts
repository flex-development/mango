import type { ObjectEmpty, ObjectPlain } from '@flex-development/tutils'
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
export type RepoRoot<E extends ObjectPlain = ObjectPlain> =
  | Record<UID, E>
  | ObjectEmpty
