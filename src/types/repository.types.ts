import type {
  DeepPartialByRequiredHelper,
  ObjectEmpty,
  ObjectPlain,
  ObjectUnknown,
  Path
} from '@flex-development/tutils'
import type { UID } from './utils.types'

/**
 * @file Type Definitions - Repositories
 * @module types/repository
 */

/**
 * DTO filter object.
 *
 * @template E - Entity
 * @template P - Required object field paths
 * @template F - Object field path filter object. Omits fields
 *
 * @example
 *  interface IUser{ ... }
 *  type Filter = DTOFilter<IUser, 'first_name', { created_at: never }>
 */
export type DTOFilter<
  E extends ObjectPlain = ObjectUnknown,
  P extends Path<E> = Path<E>,
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  F extends Partial<Record<Path<E>, never>> = {}
> = DeepPartialByRequiredHelper<E, P, F>

/**
 * Type representing the root of a repository.
 *
 * @template E - Entity
 */
export type RepoRoot<E extends ObjectPlain = ObjectPlain> =
  | Record<UID, E>
  | ObjectEmpty
