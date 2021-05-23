import type { DUID } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { CreateEntityDTO } from './create-entity.dto'

/**
 * @file Data Transfer Objects - PatchEntityDTO
 * @module dto/PatchEntityDTO
 */

/**
 * Data used to patch an entity.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 */
export type PatchEntityDTO<
  E extends PlainObject = PlainObject,
  U extends string = DUID
> = Partial<CreateEntityDTO<E, U>>
