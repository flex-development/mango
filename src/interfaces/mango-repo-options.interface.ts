import type { DUID } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { MangoFinderPluginOptions } from './mango-finder-plugin-options.interface'
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
 */
export interface MangoRepoOptions<
  E extends PlainObject = PlainObject,
  U extends string = DUID
> extends MangoFinderPluginOptions<E, U> {
  /**
   * Repository Validation API options.
   *
   * @default {}
   */
  validation: MangoValidatorOptions
}
