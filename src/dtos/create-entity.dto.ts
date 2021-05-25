import type { DeepPick, ObjectPlain, Path } from '@flex-development/tutils'

/**
 * @file Data Transfer Objects - CreateEntityDTO
 * @module dto/CreateEntityDTO
 */

/**
 * Data used to create a new entity.
 *
 * @template E - Entity
 * @template P - Object paths of dto
 */
export type CreateEntityDTO<
  E extends ObjectPlain = ObjectPlain,
  P extends Path<E> = Path<E>
> = DeepPick<E, P>
