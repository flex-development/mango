import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { DUID, MangoParsedUrlQuery, MangoSearchParams, UID } from '@/types'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  Path
} from '@flex-development/tutils'
import type { MangoCacheRepo } from './mango-cache-repo.interface'
import type { IMangoFinder } from './mango-finder.interface'

/**
 * @file Interface - IMangoRepository
 * @module interfaces/MangoRepository
 */

/**
 * `MangoRepository` class interface.
 *
 * Perform **synchronous** CRUD operations on in-memory repositories.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @extends IMangoFinder
 */
export interface IMangoRepository<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends IMangoFinder<E, U, P, Q> {
  clear(): boolean
  create<F extends Path<E>>(dto: CreateEntityDTO<E, F>): E
  delete(uid: OneOrMany<UID>, should_exist?: boolean): UID[]
  patch<F extends Path<E>>(
    uid: UID,
    dto: PatchEntityDTO<E, F>,
    rfields?: string[]
  ): E
  setCache(collection?: E[]): MangoCacheRepo<E>
  save<F extends Path<E>>(dto: OneOrMany<EntityDTO<E, F>>): E[]
}
