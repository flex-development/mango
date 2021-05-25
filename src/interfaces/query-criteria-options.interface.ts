import type { DocumentSortingRules, ProjectStage } from '@/types'
import type { ObjectPlain } from '@flex-development/tutils'
import type { ParsedOptions } from 'qs-to-mongo/lib/query/options-to-mongo'

/**
 * @file Interface - QueryCriteriaOptions
 * @module interfaces/QueryCriteriaOptions
 */

/**
 * MongoDB query criteria options.
 *
 * @template D - Document (collection object)
 */
export interface QueryCriteriaOptions<D extends ObjectPlain = ObjectPlain>
  extends Partial<Omit<ParsedOptions, 'projection' | 'sort'>> {
  $project?: ProjectStage<D>
  sort?: DocumentSortingRules<D>
}
