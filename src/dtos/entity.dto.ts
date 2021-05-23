import type { DUID } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { CreateEntityDTO } from './create-entity.dto'
import type { PatchEntityDTO } from './patch-entity.dto'

/**
 * @file Data Transfer Objects - EntityDTO
 * @module dto/EntityDTO
 */

/**
 * Data used to create or patch an entity.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 */
export type EntityDTO<
  E extends PlainObject = PlainObject,
  U extends string = DUID
> = CreateEntityDTO<E, U> | PatchEntityDTO<E, U>
