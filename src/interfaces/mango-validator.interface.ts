import type { PlainObject } from '@flex-development/tutils'
import type { ClassType } from 'class-transformer-validator'
import { transformAndValidate } from 'class-transformer-validator'
import type { MangoValidatorOptions } from './mango-validator-options.interface'

/**
 * @file Interface - IMangoValidator
 * @module interfaces/MangoValidator
 */

/**
 * `MangoValidator` mixin interface.
 *
 * @template E - Entity
 */
export interface IMangoValidator<E extends PlainObject = PlainObject> {
  readonly enabled: boolean
  readonly model: ClassType<E>
  readonly tvo: Omit<MangoValidatorOptions, 'enabled'>
  readonly validator: typeof transformAndValidate

  check<V extends unknown = PlainObject>(value?: V): Promise<E | V>
}
