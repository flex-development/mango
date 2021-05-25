import { TVO_DEFAULTS } from '@/constants'
import type { IMangoValidator, MangoValidatorOptions } from '@/interfaces'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { ObjectPlain } from '@flex-development/tutils'
import type { ClassTransformOptions as TransformOpts } from 'class-transformer'
import type { ClassType } from 'class-transformer-validator'
import {
  transformAndValidate as tv,
  transformAndValidateSync as tvSync
} from 'class-transformer-validator'
import type { ValidationError, ValidatorOptions } from 'class-validator'
import merge from 'lodash.merge'

/**
 * @file Mixin - MangoValidator
 * @module mixins/MangoValidator
 */

/**
 * Handles validating repository entities.
 *
 * @template E - Entity
 *
 * @class
 * @implements {IMangoValidator<E>}
 */
export default class MangoValidator<E extends ObjectPlain>
  implements IMangoValidator<E> {
  /**
   * @readonly
   * @instance
   * @property {boolean} enabled - Toggle validation
   */
  readonly enabled: boolean

  /**
   * @readonly
   * @instance
   * @property {ClassType<E>} model - Entity model
   */
  readonly model: ClassType<E>

  /**
   * @readonly
   * @instance
   * @property {string} model_name - Name of entity model
   */
  readonly model_name: string

  /**
   * @readonly
   * @instance
   * @property {Omit<MangoValidatorOptions, 'enabled'>} tvo - Validation options
   */
  readonly tvo: Omit<MangoValidatorOptions, 'enabled'>

  /**
   * @readonly
   * @instance
   * @property {typeof tv} validator - Async validation function
   */
  readonly validator: typeof tv = tv

  /**
   * @readonly
   * @instance
   * @property {typeof tvSync} validatorSync - Synchronous validation function
   */
  readonly validatorSync: typeof tvSync = tvSync

  /**
   * Creates a new repository validator.
   *
   * See:
   *
   * - https://github.com/pleerock/class-validator
   * - https://github.com/typestack/class-transformer
   * - https://github.com/MichalLytek/class-transformer-validator
   *
   * @param {ClassType<E>} model - Entity model
   * @param {MangoValidatorOptions} [options] - Mango Validation API options
   * @param {boolean} [options.enabled] - Toggle schema validation
   * @param {TransformOpts} [options.transformer] - `class-transformer` options
   * @param {ValidatorOptions} [options.validator] - `class-validator` options
   */
  constructor(model: ClassType<E>, options: MangoValidatorOptions = {}) {
    const { enabled = true, transformer = {}, validator = {} } = options

    this.enabled = enabled
    this.model = model
    this.model_name = new this.model().constructor.name
    this.tvo = merge(TVO_DEFAULTS, { transformer, validator })
  }

  /**
   * Validates {@param value} against {@see MangoValidator#model} if the Mango
   * Validation API is enabled. Otherwise, the original value will be returned.
   *
   * References:
   *
   * - https://github.com/MichalLytek/class-transformer-validator
   *
   * @template Value - Type of value being validated
   *
   * @param {Value} value - Data to validate
   * @return {Promise<E | Value>} - Promise containing entity or original value
   * @throws {Exception}
   */
  async check<Value extends unknown = ObjectPlain>(
    value: Value = {} as Value
  ): Promise<E | Value> {
    if (!this.enabled) return value

    try {
      return (await this.validator<E>(this.model, value as any, this.tvo)) as E
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Synchronous version of {@see MangoValidator#check}.
   *
   * @template Value - Type of value being validated
   *
   * @param {Value} value - Data to validate
   * @return {E | Value} - Entity or original value
   * @throws {Exception}
   */
  checkSync<Value extends unknown = ObjectPlain>(
    value: Value = {} as Value
  ): E | Value {
    if (!this.enabled) return value

    try {
      return this.validatorSync<E>(this.model, value as any, this.tvo) as E
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Converts an error into an `Exception`.
   *
   * @param {Error | ValidationError[]} error - Error to convert
   * @return {Exception} New exception
   */
  handleError(error: Error | ValidationError[]): Exception {
    let code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
    let data = { model_name: this.model_name }
    let message = ''
    let stack: string | undefined = undefined

    if (Array.isArray(error)) {
      const errors = error as ValidationError[]
      const properties = errors.map(e => e.property)

      code = ExceptionStatusCode.BAD_REQUEST
      data = merge(data, { errors })
      message = `${this.model_name} entity validation failure: [${properties}]`
    } else {
      message = error.message
      stack = error.stack
    }

    return new Exception(
      code,
      message,
      merge(data, { options: this.tvo }),
      stack
    )
  }
}
