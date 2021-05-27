import type { MangoRepoOptions } from '@/interfaces'
import type { DUID } from '@/types'
import type { ObjectPlain } from '@flex-development/tutils'
import type { MangoFinderOptionsDTO } from './mango-finder-options.dto'

/**
 * @file Data Transfer Objects - MangoRepoOptionsDTO
 * @module dtos/MangoRepoOptionsDTO
 */

/**
 * Options accepted by the `MangoRepository` class constructor.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 *
 * @extends MangoFinderOptionsDTO
 */
export interface MangoRepoOptionsDTO<
  E extends ObjectPlain = ObjectPlain,
  U extends string = DUID
> extends MangoFinderOptionsDTO<E, U> {
  /**
   * Repository Validation API options.
   *
   * @default { enabled: true }
   */
  validation?: MangoRepoOptions<E>['validation']
}
