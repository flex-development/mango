import type { DeepPick, ObjectPlain, Path } from '@flex-development/tutils'

/**
 * @file Data Transfer Objects - PatchEntityDTO
 * @module dtos/PatchEntityDTO
 */

/**
 * Data used to patch an entity.
 *
 * @template E - Entity
 * @template P - Object paths of dto
 */
export type PatchEntityDTO<
  E extends ObjectPlain = ObjectPlain,
  P extends Path<E> = Path<E>
> = Partial<DeepPick<E, P>>
