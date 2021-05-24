import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import type { ICar } from '@tests/fixtures/cars.fixture'
import { Car, CARS_MOCK_CACHE } from '@tests/fixtures/cars.fixture'
import ERROR from '@tests/fixtures/error.fixture'
import TestSubject from '../mango-validator.mixin'
import VALIDATION_ERRORS from './__fixtures__/validation-errors.fixture'

/**
 * @file Unit Tests - MangoValidator
 * @module mixins/tests/MangoValidator
 */

describe('unit:mixins/MangoValidator', () => {
  const ENTITY = CARS_MOCK_CACHE.collection[0]

  const Subject = new TestSubject<ICar>(Car)

  describe('#check', () => {
    it('should validate value if validation is enabled', async () => {
      // Arrange
      const spy_validator = jest.spyOn(Subject, 'validator')

      // Act
      await Subject.check(ENTITY)

      expect(spy_validator).toBeCalledTimes(1)
    })

    it('should not validate value if validation is disabled', async () => {
      // Arrange
      const Subject = new TestSubject<ICar>(Car, { enabled: false })
      const spy_validator = jest.spyOn(Subject, 'validator')

      // Act
      await Subject.check(ENTITY)

      // Expect
      expect(spy_validator).toBeCalledTimes(0)
    })

    it('should return value if validation passes', async () => {
      // Arrange + Act
      const value = await Subject.check(ENTITY)

      // Expect
      expect(value).toMatchObject(ENTITY)
    })

    it('should call #handleError if validation fails', async () => {
      // Arrange
      const spy_handleError = jest.spyOn(Subject, 'handleError')

      // Act
      try {
        await Subject.check({})
      } catch (error) {
        // let error fall through
      }

      // Expect
      expect(spy_handleError).toBeCalledTimes(1)
    })
  })

  describe('#checkSync', () => {
    it('should validate value if validation is enabled', () => {
      // Arrange
      const spy_validatorSync = jest.spyOn(Subject, 'validatorSync')

      // Act
      Subject.checkSync(ENTITY)

      // Expect
      expect(spy_validatorSync).toBeCalledTimes(1)
    })

    it('should not validate value if validation is disabled', () => {
      // Arrange
      const Subject = new TestSubject<ICar>(Car, { enabled: false })
      const spy_validatorSync = jest.spyOn(Subject, 'validatorSync')

      // Act
      Subject.checkSync(ENTITY)

      // Expect
      expect(spy_validatorSync).toBeCalledTimes(0)
    })

    it('should return value if validation passes', () => {
      // Arrange + Act
      const value = Subject.checkSync(ENTITY)

      // Expect
      expect(value).toMatchObject(ENTITY)
    })

    it('should call #handleError if validation fails', () => {
      // Arrange
      const spy_handleError = jest.spyOn(Subject, 'handleError')

      // Act
      try {
        Subject.checkSync({})
      } catch (error) {
        // let error fall through
      }

      // Expect
      expect(spy_handleError).toBeCalledTimes(1)
    })
  })

  describe('#handleError', () => {
    it('should convert Error into Exception', () => {
      // Act
      const exception = Subject.handleError(ERROR)

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect(exception.message).toBe(ERROR.message)
      expect(exception.data).toMatchObject({
        model_name: Subject.model_name,
        options: Subject.tvo
      })
      expect(exception.errors).toBeNull()
    })

    it('should convert ValidationError[] into Exception', () => {
      // Arrange
      const mpattern = `${Subject.model_name} entity validation failure:`

      // Act
      const exception = Subject.handleError(VALIDATION_ERRORS)

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.message).toMatch(new RegExp(mpattern))
      expect(exception.data).toMatchObject({
        model_name: Subject.model_name,
        options: Subject.tvo
      })
      expect(exception.errors).toBeArray()
      expect(exception.errors).toIncludeSameMembers(VALIDATION_ERRORS)
    })
  })
})
