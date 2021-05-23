import type { DUID } from '@/types'
import type { PartialBy, PlainObject } from '@flex-development/tutils'

/**
 * @file Data Transfer Objects - CreateEntityDTO
 * @module dto/CreateEntityDTO
 */

/**
 * Data used to create a new entity.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 */
export type CreateEntityDTO<
  E extends PlainObject = PlainObject,
  U extends string = DUID
> = PartialBy<E, U>
