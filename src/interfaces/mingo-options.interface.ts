import type { DUID } from '@/types'
import type { Options } from 'mingo/core'

/**
 * @file Interface - MingoOptions
 * @module interfaces/MingoOptions
 */

/**
 * Options used by the [`mingo`][1] module.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 *
 * [1]: https://github.com/kofrasa/mingo
 */
export interface MingoOptions<U extends string = DUID>
  extends Omit<Options, 'idKey'> {
  /**
   * Name of the field containing a unique identifier for a document.
   *
   * @default 'id'
   */
  idKey: U
}
