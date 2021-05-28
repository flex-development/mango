import type { DUID } from '@/types'
import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { Debugger } from 'debug'
import mingo from 'mingo'
import type { MangoCacheFinder } from './mango-cache-finder.interface'
import type { MangoFinderOptions } from './mango-finder-options.interface'
import type { IMangoParser } from './mango-parser.interface'

/**
 * @file Interface - IAbstractMangoFinderBase
 * @module interfaces/AbstractMangoFinderBase
 */

/**
 * Base `AbstractMangoFinder` plugin interface.
 *
 * Used to define properties of `MangoFinder`, `MangoFinderAsync`, and
 * possible derivatives.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface IAbstractMangoFinderBase<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID
> {
  readonly cache: Readonly<MangoCacheFinder<D>>
  readonly logger: Debugger
  readonly mingo: typeof mingo
  readonly mparser: IMangoParser<D>
  readonly options: MangoFinderOptions<D, U>
}
