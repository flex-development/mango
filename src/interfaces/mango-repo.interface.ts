import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { DUID, MangoParsedUrlQuery, MangoSearchParams, UID } from '@/types'
import type {
  ObjectPlain,
  OneOrMany,
  OrPromise,
  Path
} from '@flex-development/tutils'
import type { ClassType } from 'class-transformer-validator'
import type { IAbstractMangoFinder } from './abstract-mango-finder.interface'
import type { MangoCacheRepo } from './mango-cache-repo.interface'
import type { MangoRepoOptions } from './mango-repo-options.interface'
import type { IMangoValidator } from './mango-validator.interface'

/**
 * @file Interface - IMangoRepository
 * @module interfaces/MangoRepository
 */

/**
 * `MangoRepository` class interface.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 */
export interface IMangoRepository<
  E extends ObjectPlain = ObjectPlain,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends IAbstractMangoFinder<E, U, P, Q> {
  readonly cache: MangoCacheRepo<E>
  readonly model: ClassType<E>
  readonly options: MangoRepoOptions<E, U>
  readonly validator: IMangoValidator<E>

  clear(): OrPromise<boolean>
  create<F extends Path<E>>(dto: CreateEntityDTO<E, F>): OrPromise<E>
  delete(uid: OneOrMany<UID>, should_exist?: boolean): OrPromise<UID[]>
  euid(): string
  patch<F extends Path<E>>(
    uid: UID,
    dto: PatchEntityDTO<E, F>,
    rfields?: string[]
  ): OrPromise<E>
  setCache(collection?: E[]): OrPromise<MangoCacheRepo<E>>
  save<F extends Path<E>>(dto: OneOrMany<EntityDTO<E, F>>): OrPromise<E[]>
}
