import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { ObjectPlain, ObjectUnknown } from '@flex-development/tutils'
import type { ClassType } from 'class-transformer-validator'
import {
  transformAndValidate,
  transformAndValidateSync
} from 'class-transformer-validator'
import type { ValidationError } from 'class-validator'
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
export interface IMangoValidator<E extends ObjectPlain = ObjectUnknown> {
  readonly enabled: boolean
  readonly model: ClassType<E>
  readonly model_name: string
  readonly tvo: Omit<MangoValidatorOptions, 'enabled'>
  readonly validator: typeof transformAndValidate
  readonly validatorSync: typeof transformAndValidateSync

  check<V extends unknown = ObjectPlain>(value?: V): Promise<E | V>
  checkSync<V extends unknown = ObjectPlain>(value?: V): E | V
  handleError(error: Error | ValidationError[]): Exception
}
