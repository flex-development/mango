import type { DUID } from '@/types'
import type { ObjectPlain } from '@flex-development/tutils'
import type { MangoFinderOptions } from './mango-finder-options.interface'
import type { MangoValidatorOptions } from './mango-validator-options.interface'

/**
 * @file Interface - MangoRepoOptions
 * @module interfaces/MangoRepoOptions
 */

/**
 * Options used by the `MangoRepository` class.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 *
 * @extends MangoFinderOptions
 */
export interface MangoRepoOptions<
  E extends ObjectPlain = ObjectPlain,
  U extends string = DUID
> extends MangoFinderOptions<E, U> {
  /**
   * Repository Validation API options.
   *
   * @default {}
   */
  validation: MangoValidatorOptions
}
