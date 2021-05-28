import type { DUID } from '@/types'
import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { IAbstractMangoFinderBase } from './abstract-mango-finder-base.interface'
import type { MangoCacheRepo } from './mango-cache-repo.interface'
import type { MangoRepoOptions } from './mango-repo-options.interface'
import type { IMangoValidator } from './mango-validator.interface'

/**
 * @file Interface - IAbstractMangoRepositoryBase
 * @module interfaces/AbstractMangoRepositoryBase
 */

/**
 * Base `AbstractMangoRepository` class interface.
 *
 * Used to define properties of `MangoRepository`, `MangoRepositoryAsync`,
 * and possible derivatives.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 *
 * @extends IAbstractMangoFinderBase
 */
export interface IAbstractMangoRepositoryBase<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID
> extends IAbstractMangoFinderBase<E, U> {
  readonly cache: MangoCacheRepo<E>
  readonly options: MangoRepoOptions<E, U>
  readonly validator: IMangoValidator<E>
}
