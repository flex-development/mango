import validator from '@/constraints/is-unix-timestamp.constraint'
import type { ValidateByOptions, ValidationOptions } from 'class-validator'
import { ValidateBy } from 'class-validator'

/**
 * @file Decorator - IsUnixTimestamp
 * @module decorators/IsUnixTimestamp
 */

/**
 * Custom decorator that ensures a value is a [Unix timestamp][1].
 *
 * [1]: https://en.wikipedia.org/wiki/Unix_time
 *
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @return {PropertyDecorator} Property decorator
 */
const IsUnixTimestamp = (
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  const validateByOptions: ValidateByOptions = {
    async: validator.options?.async,
    constraints: [],
    name: validator.options?.name as string,
    validator
  }

  return ValidateBy(validateByOptions, validationOptions)
}

export default IsUnixTimestamp
