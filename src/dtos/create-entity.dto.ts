import type { DTOFilter } from '@/types'
import type {
  DeepPartialByRequired,
  ObjectPlain,
  ObjectUnknown
} from '@flex-development/tutils'

/**
 * @file Data Transfer Objects - CreateEntityDTO
 * @module dtos/CreateEntityDTO
 */

/**
 * Data used to create a new entity.
 *
 * Constructs a type where properties `F['pick']` are required, and properties
 * `F['omit']` will be omitted.
 *
 * Other properties will remain untouched.
 *
 * @template E - Entity
 * @template F - DTO filter object
 *
 * @example
 *  interface IUser{ ... }
 *  type Filter = DTOFilter<IUser, 'first_name', { created_at: never }>
 *  type CreateUserDTO = CreateEntityDTO<IUser, Filter>
 */
export type CreateEntityDTO<
  E extends ObjectPlain = ObjectUnknown,
  F extends DTOFilter<E> = DTOFilter<E>
> = DeepPartialByRequired<E, F>
