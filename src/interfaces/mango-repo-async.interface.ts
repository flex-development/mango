import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { DUID, MangoParsedUrlQuery, MangoSearchParams, UID } from '@/types'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany
} from '@flex-development/tutils'
import { IAbstractMangoRepositoryBase } from './abstract-mango-repo-base.interface'
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
 * @extends IAbstractMangoRepositoryBase
 */
export interface IMangoRepositoryAsync<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends Omit<IMangoFinderAsync<E, U, P, Q>, 'cache' | 'options'>,
    IAbstractMangoRepositoryBase<E, U> {
  clear(): Promise<boolean>
  create(dto: CreateEntityDTO<E>): Promise<E>
  delete(uid?: OneOrMany<UID>, should_exist?: boolean): Promise<UID[]>
  patch(uid: UID, dto?: PatchEntityDTO<E>, rfields?: string[]): Promise<E>
  setCache(collection?: E[]): Promise<MangoCacheRepo<E>>
  save(dto?: OneOrMany<EntityDTO<E>>): Promise<E[]>
}
