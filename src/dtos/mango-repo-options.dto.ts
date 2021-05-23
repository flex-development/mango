import type { MangoRepoOptions } from '@/interfaces'
import type { DUID } from '@/types'
import type { PlainObject } from '@flex-development/tutils'
import type { MangoFinderPluginOptionsDTO } from './mango-finder-plugin-options.dto'

/**
 * @file Data Transfer Objects - MangoRepoOptionsDTO
 * @module dto/MangoRepoOptionsDTO
 */

/**
 * Options accepted by the `MangoRepository` class constructor.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 */
export interface MangoRepoOptionsDTO<
  E extends PlainObject = PlainObject,
  U extends string = DUID
> extends MangoFinderPluginOptionsDTO<E, U> {
  /**
   * Repository Validation API options.
   *
   * @default { enabled: true }
   */
  validation?: MangoRepoOptions<E>['validation']
}
