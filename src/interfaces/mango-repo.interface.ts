import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { DUID, MangoParsedUrlQuery, MangoSearchParams, UID } from '@/types'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany
} from '@flex-development/tutils'
import type { IAbstractMangoRepositoryBase } from './abstract-mango-repo-base.interface'
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
 * @extends IAbstractMangoRepositoryBase
 */
export interface IMangoRepository<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends Omit<IMangoFinder<E, U, P, Q>, 'cache' | 'options'>,
    IAbstractMangoRepositoryBase<E, U> {
  clear(): boolean
  create(dto: CreateEntityDTO<E>): E
  delete(uid?: OneOrMany<UID>, should_exist?: boolean): UID[]
  patch(uid: UID, dto?: PatchEntityDTO<E>, rfields?: string[]): E
  setCache(collection?: E[]): MangoCacheRepo<E>
  save(dto?: OneOrMany<EntityDTO<E>>): E[]
}
