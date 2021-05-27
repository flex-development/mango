import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { DUID, MangoParsedUrlQuery, MangoSearchParams, UID } from '@/types'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  Path
} from '@flex-development/tutils'
import type { MangoCacheRepo } from './mango-cache-repo.interface'
import type { IMangoFinderAsync } from './mango-finder-async.interface'

/**
 * @file Interface - IMangoRepositoryAsync
 * @module interfaces/MangoRepositoryAsync
 */

/**
 * `MangoRepositoryAsync` class interface.
 *
 * Perform **asynchronous** CRUD operations on in-memory repositories.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @extends IMangoFinderAsync
 */
export interface IMangoRepositoryAsync<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends IMangoFinderAsync<E, U, P, Q> {
  clear(): Promise<boolean>
  create<F extends Path<E>>(dto: CreateEntityDTO<E, F>): Promise<E>
  delete(uid?: OneOrMany<UID>, should_exist?: boolean): Promise<UID[]>
  patch<F extends Path<E>>(
    uid: UID,
    dto: PatchEntityDTO<E, F>,
    rfields?: string[]
  ): Promise<E>
  setCache(collection?: E[]): Promise<MangoCacheRepo<E>>
  save<F extends Path<E>>(dto: OneOrMany<EntityDTO<E, F>>): Promise<E[]>
}
