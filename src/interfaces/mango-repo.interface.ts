import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { DUID, MangoParsedUrlQuery, MangoSearchParams, UID } from '@/types'
import type {
  OneOrMany,
  OrPromise,
  PlainObject
} from '@flex-development/tutils'
import type { ClassType } from 'class-transformer-validator'
import type { MangoCacheRepo } from './mango-cache-repo.interface'
import type { IMangoFinderPlugin } from './mango-finder-plugin.interface'
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
  E extends PlainObject = PlainObject,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends IMangoFinderPlugin<E, U, P, Q> {
  readonly cache: MangoCacheRepo<E>
  readonly model: ClassType<E>
  readonly options: MangoRepoOptions<E, U>
  readonly validator: IMangoValidator<E>

  clear(): OrPromise<boolean>
  create(dto: CreateEntityDTO<E, U>): OrPromise<E>
  delete(uid: OneOrMany<UID>, should_exist?: boolean): OrPromise<UID[]>
  euid(): string
  patch(uid: UID, dto: PatchEntityDTO<E, U>, rfields?: string[]): OrPromise<E>
  resetCache(collection?: E[]): OrPromise<MangoCacheRepo<E>>
  save(dto: OneOrMany<EntityDTO<E, U>>): OrPromise<E[]>
}
