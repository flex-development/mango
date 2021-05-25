import type { DUID } from '@/types'
import type { ObjectPlain, Path } from '@flex-development/tutils'
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
 * @template P - Object paths of `CreateEntityDTO` | `PatchEntityDTO`
 */
export type EntityDTO<
  E extends ObjectPlain = ObjectPlain,
  // @ts-expect-error default uid field for documents
  P extends Path<E> = DUID
> = CreateEntityDTO<E, P> | PatchEntityDTO<E, P>
