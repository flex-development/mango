import type { DTOFilter } from '@/types'
import type {
  DeepPartial,
  ObjectPlain,
  ObjectUnknown
} from '@flex-development/tutils'
import type { CreateEntityDTO } from './create-entity.dto'

/**
 * @file Data Transfer Objects - PatchEntityDTO
 * @module dtos/PatchEntityDTO
 */

/**
 * Data used to patch an entity.
 *
 * @template E - Entity
 * @template F - DTO filter object
 *
 * @example
 *  interface IUser{ ... }
 *  type Filter = DTOFilter<IUser, 'first_name', { created_at: never }>
 *  type PatchUserDTO = PatchEntityDTO<IUser, Filter>
 */
export type PatchEntityDTO<
  E extends ObjectPlain = ObjectUnknown,
  F extends DTOFilter<E> = DTOFilter<E>
> = DeepPartial<CreateEntityDTO<E, F>>
