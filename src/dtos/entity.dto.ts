import type { ObjectPlain, Path } from '@flex-development/tutils'
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
 * @template P - Object paths of `CreateEntityDTO` | `PatchEntityDTO`
 */
export type EntityDTO<
  E extends ObjectPlain = ObjectPlain,
  P extends Path<E> = Path<E>
> = CreateEntityDTO<E, P> | PatchEntityDTO<E, P>
