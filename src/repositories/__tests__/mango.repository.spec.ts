import type { MangoRepoOptionsDTO } from '@/dtos'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { UnknownObject } from '@flex-development/tutils'
import {
  Car,
  CarParams,
  CarQuery,
  CARS_MOCK_CACHE as mockCache,
  CARS_MOCK_CACHE_EMPTY as mockCacheEmpty,
  CARS_UID as EUID,
  CarUID,
  ICar
} from '@tests/fixtures/cars.fixture'
import { dequal } from 'dequal'
import faker from 'faker'
import merge from 'lodash.merge'
import omit from 'lodash.omit'
import TestSubject from '../mango.repository'

/**
 * @file Unit Tests - MangoRepository
 * @module repositories/tests/MangoRepository
 */

const mockMerge = merge as jest.MockedFunction<typeof merge>
const mockOmit = omit as jest.MockedFunction<typeof omit>

describe('unit:repositories/MangoRepository', () => {
  const CACHE = false
  const ENTITY = Object.assign({}, mockCache.collection[0])

  /**
   * Returns a test repository.
   *
   * If {@param emptyCache} is `true`, the repository will be initialized with
   * an empty cache. Otherwise the mockCache will be used.
   *
   * @param {boolean} [emptyCache] - Initialize with empty mock cache
   * @return {TestSubject<ICar, CarParams, CarQuery>} Test repo
   */
  const getSubject = (
    emptyCache: boolean = true
  ): TestSubject<ICar, CarUID, CarParams, CarQuery> => {
    return new TestSubject<ICar, CarUID, CarParams, CarQuery>(Car, {
      cache: Object.assign(
        {},
        emptyCache ? mockCacheEmpty : mockCache
      ) as MangoRepoOptionsDTO<ICar>['cache'],
      mingo: { idKey: EUID }
    })
  }

  describe('constructor', () => {
    it('should initialize instance properties', () => {
      // Arrange
      const eoptions = { mingo: { idKey: EUID }, validation: {} }

      // Act
      const Subject = getSubject()

      // Expect
      expect(Subject.cache).toMatchObject(mockCacheEmpty)
      expect(dequal(Subject.model, Car)).toBeTruthy()
      expect(Subject.options).toMatchObject(eoptions)
      expect(Subject.validator).toBeDefined()
    })
  })

  describe('#clear', () => {
    const Subject = getSubject()

    it('should call #resetCache', () => {
      // Arrange
      const spy_resetCache = jest.spyOn(Subject, 'resetCache')

      // Act
      Subject.clear()

      // Expect
      expect(spy_resetCache).toBeCalledTimes(1)
      expect(spy_resetCache).toBeCalledWith()
    })
  })

  describe('#create', () => {
    const Subject = getSubject()

    beforeEach(() => {
      // @ts-expect-error mocking
      Subject.cache = mockCacheEmpty
    })

    it('should assign uid if dto uid is nullable or empty string', async () => {
      // Act
      await Subject.create({ ...ENTITY, [EUID]: undefined })

      // Expect
      expect(mockMerge.mock.results[0].value[EUID]).toBeString()
    })

    it('should throw if entity with dto uid already exists', async () => {
      // Arrange
      const spy_findOne = jest.spyOn(Subject, 'findOne')
      const this_dto = { ...ENTITY, [EUID]: ENTITY[EUID] }
      const emessage_match = new RegExp(`"${this_dto[EUID]}" already exists`)
      let exception = {} as Exception

      // Act
      spy_findOne.mockReturnValueOnce(ENTITY)

      try {
        await Subject.create(this_dto)
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.CONFLICT)
      expect(exception.data.dto).toMatchObject(this_dto)
      expect((exception.errors as UnknownObject)[EUID]).toBe(this_dto[EUID])
      expect(exception.message).toMatch(emessage_match)
    })

    it('should call #validator.check', async () => {
      // Arrange
      const spy_validator_check = jest.spyOn(Subject.validator, 'check')

      // Act
      await Subject.create(ENTITY)

      // Expect
      expect(spy_validator_check).toBeCalledTimes(1)
    })

    it('should create new entity and call #resetCache', async () => {
      // Arrange
      const spy_resetCache = jest.spyOn(Subject, 'resetCache')

      // Act
      const result = await Subject.create(ENTITY)

      // Expect
      expect(result).toMatchObject(ENTITY)
      expect(spy_resetCache).toBeCalledTimes(1)
    })
  })

  describe('#delete', () => {
    const Subject = getSubject(CACHE)

    it('should throw if any entity does not exist but should', () => {
      // Arrange
      const should_exist = true
      const uids = [faker.datatype.string()]
      let exception = {} as Exception

      // Act
      try {
        Subject.delete(uids, should_exist)
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.NOT_FOUND)
      expect(exception.data).toMatchObject({ should_exist, uids })
    })

    it('should filter out uids of entities that do not exist', () => {
      // Arrange
      const ids = [faker.datatype.string()]

      // Act
      const result = Subject.delete(ids)

      // Expect
      expect(mockOmit).toBeCalledWith(Subject.cache.root, [])
      expect(result).toBeArrayOfSize(0)
    })

    it('should remove entities from root and call #resetCache', () => {
      // Arrange
      const spy_resetCache = jest.spyOn(Subject, 'resetCache')
      const uids = [ENTITY[EUID], faker.datatype.string()]

      // Act
      Subject.delete(uids)

      // Expect
      expect(spy_resetCache).toBeCalledTimes(1)
      expect(Subject.cache.root[ENTITY[EUID]]).not.toBeDefined()
    })
  })

  describe('#euid', () => {
    it('should return name of entity uid field', () => {
      expect(getSubject().euid()).toBe(EUID)
    })
  })

  describe('#patch', () => {
    const Subject = getSubject(CACHE)

    it('should call #findOneOrFail', async () => {
      // Arrange
      const spy_findOneOrFail = jest.spyOn(Subject, 'findOneOrFail')

      // Act
      await Subject.patch(ENTITY[EUID], {})

      // Expect
      expect(spy_findOneOrFail).toBeCalledTimes(1)
      expect(spy_findOneOrFail).toBeCalledWith(ENTITY[EUID])
    })

    it('should remove readonly fields from dto', async () => {
      // Arrange
      const dto = { ...ENTITY, [EUID]: '' }

      // Act
      await Subject.patch(ENTITY[EUID], dto)

      // Expect
      expect(mockMerge.mock.results[0].value[EUID]).not.toBe(dto[EUID])
    })

    it('should call #validator.check', async () => {
      // Arrange
      const spy_validator_check = jest.spyOn(Subject.validator, 'check')

      // Act
      await Subject.patch(ENTITY[EUID], {})

      // Expect
      expect(spy_validator_check).toBeCalledTimes(1)
    })

    it('should patch existing entity and call #resetCache', async () => {
      // Arrange
      const spy_resetCache = jest.spyOn(Subject, 'resetCache')
      const dto = { make: 'MAKE' }

      // Act
      await Subject.patch(ENTITY[EUID], dto)

      // Expect
      expect(Subject.cache.root[ENTITY[EUID]]).toMatchObject(dto)
      expect(spy_resetCache).toBeCalledTimes(1)
    })
  })

  describe('#resetCache', () => {
    it('should clear cache', () => {
      // Arrange
      const Subject = getSubject(CACHE)

      // Act
      Subject.resetCache()

      // Expect
      expect(Subject.cache).toMatchObject(mockCacheEmpty)
    })

    it('should insert new entities into cache', () => {
      // Arrange
      const Subject = getSubject(CACHE)
      const collection = [ENTITY]

      // Act
      Subject.resetCache(collection)

      // Expect
      expect(Subject.cache.collection).toIncludeAllMembers(collection)
      expect(Subject.cache.root[ENTITY[EUID]]).toMatchObject(ENTITY)
    })
  })

  describe('#save', () => {
    const Subject = getSubject()

    const DTO_BASE = { make: 'MAKE', model: 'MODEL', model_year: -1 }

    const spy_findOne = jest.spyOn(Subject, 'findOne')

    it('should create new entity', async () => {
      // Arrange
      const spy_create = jest.spyOn(Subject, 'create')

      // Act
      spy_findOne.mockReturnValueOnce(null)

      await Subject.save(DTO_BASE)

      // Expect
      expect(spy_create).toBeCalledTimes(1)
      expect(spy_create).toBeCalledWith(DTO_BASE)
    })

    it('should patch existing entity', async () => {
      // Arrange
      const spy_patch = jest.spyOn(Subject, 'patch')
      const dto = { ...ENTITY, ...DTO_BASE }

      // Act
      spy_findOne.mockReturnValue(ENTITY)

      await Subject.save(dto)

      // Expect
      expect(spy_patch).toBeCalledTimes(1)
      expect(spy_patch).toBeCalledWith(dto[EUID], dto)
    })
  })
})
