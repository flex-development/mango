import type { ObjectPlain } from '@flex-development/tutils'
import type { BucketStage } from './bucket-stage.interface'

/**
 * @file Interface - BucketStageAuto
 * @module interfaces/BucketStageAuto
 */

/**
 * [Aggregation Pipeline Stage - `$bucketAuto`][1].
 *
 * @template D - Document (collection object)
 *
 * [1]: https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto
 */
export interface BucketStageAuto<D extends ObjectPlain = ObjectPlain>
  extends Pick<BucketStage<D>, 'groupBy' | 'output'> {
  /**
   * A positive 32-bit integer that specifies the number of buckets into which
   * input documents are grouped.
   */
  buckets: number

  /**
   * A string that specifies the [preferred number series][1] to use to ensure
   * that the calculated boundary edges end on preferred round numbers or their
   * powers of 10.
   *
   * [1]: https://en.wikipedia.org/wiki/Preferred_number
   */
  granularity?:
    | '1-2-5'
    | 'E6'
    | 'E12'
    | 'E24'
    | 'E48'
    | 'E96'
    | 'E192'
    | 'POWERSOF2'
    | 'R5'
    | 'R10'
    | 'R20'
    | 'R40'
    | 'R80'
}
