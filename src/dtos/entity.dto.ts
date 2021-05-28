import type { DTOFilter } from '@/types'
import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { CreateEntityDTO } from './create-entity.dto'
import type { PatchEntityDTO } from './patch-entity.dto'

/**
 * @file Data Transfer Objects - EntityDTO
 * @module dtos/EntityDTO
 */

/**
 * Data used to create or patch an entity.
 *
 * @template E - Entity
 * @template F - DTO filter object
 *
 * @example
 *  interface IUser{ ... }
 *  type Filter = DTOFilter<IUser, 'first_name', { created_at: never }>
 *  type SaveUserDTO = SaveEntityDTO<IUser, Filter>
 */
export type EntityDTO<
  E extends ObjectPlain = ObjectUnknown,
  F extends DTOFilter<E> = DTOFilter<E>
> = CreateEntityDTO<E, F> | PatchEntityDTO<E, F>
