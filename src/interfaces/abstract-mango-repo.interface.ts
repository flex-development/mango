import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { DUID, MangoParsedUrlQuery, MangoSearchParams, UID } from '@/types'
import type {
  ObjectPlain,
  ObjectUnknown,
  OneOrMany,
  OrPromise
} from '@flex-development/tutils'
import type { IAbstractMangoFinder } from './abstract-mango-finder.interface'
import type { IAbstractMangoRepositoryBase } from './abstract-mango-repo-base.interface'
import type { MangoCacheRepo } from './mango-cache-repo.interface'

/**
 * @file Interface - IAbstractMangoRepository
 * @module interfaces/AbstractMangoRepository
 */

/**
 * `AbstractMangoRepository` class interface.
 *
 * Used to define class contract of `MangoRepository`, `MangoRepositoryAsync`,
 * and possible derivatives.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @extends IAbstractMangoFinder
 * @extends IAbstractMangoRepositoryBase
 */
export interface IAbstractMangoRepository<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends Omit<IAbstractMangoFinder<E, U, P, Q>, 'cache' | 'options'>,
    IAbstractMangoRepositoryBase<E, U> {
  clear(): OrPromise<boolean>
  create(dto: CreateEntityDTO<E>): OrPromise<E>
  delete(uid?: OneOrMany<UID>, should_exist?: boolean): OrPromise<UID[]>
  patch(uid: UID, dto?: PatchEntityDTO<E>, rfields?: string[]): OrPromise<E>
  setCache(collection?: E[]): OrPromise<MangoCacheRepo<E>>
  save(dto?: OneOrMany<EntityDTO<E>>): OrPromise<E[]>
}
