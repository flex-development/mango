import type { CreateEntityDTO, MangoRepoOptionsDTO } from '@/dtos'
import type { MingoOptions } from '@/interfaces'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { ObjectPlain } from '@flex-development/tutils'
import type { CarUID, ICar } from '@tests/fixtures/cars.fixture'
import {
  Car,
  CARS_MANGO_OPTIONS as OPTIONS,
  CARS_MOCK_CACHE_EMPTY,
  CARS_ROOT as ROOT
} from '@tests/fixtures/cars.fixture'
import faker from 'faker'
import merge from 'lodash.merge'
import omit from 'lodash.omit'
import TestSubjectAbstract from '../mango-repo.abstract'
import TestSubject from './__fixtures__/cars-repo.fixture'

/**
 * @file Unit Tests - AbstractMangoRepository
 * @module abstracts/tests/MangoRepository
 */

const mockMerge = merge as jest.MockedFunction<typeof merge>
const mockOmit = omit as jest.MockedFunction<typeof omit>

describe('unit:abstracts/AbstractMangoRepository', () => {
  const Subject = new TestSubject(Car, OPTIONS)

  const CACHE = { collection: OPTIONS.cache?.collection as ICar[], root: ROOT }
  const COLLECTION = CACHE.collection
  const MOPTIONS = OPTIONS.mingo as MingoOptions<CarUID>

  const ENTITY = Object.assign({}, COLLECTION[0])
  const ENTITY_UID = ENTITY[MOPTIONS.idKey]

  describe('constructor', () => {
    it('should initialize instance properties', () => {
      expect(Subject.cache).toMatchObject(CACHE)
      expect(Subject.options).toMatchObject({ mingo: MOPTIONS, validation: {} })
      expect(Subject.validator).toBeDefined()
    })
  })

  describe('.createCache', () => {
    it('should return empty cache', () => {
      // Act
      const result = TestSubject.createCache<ICar, CarUID>(MOPTIONS.idKey)

      // Expect
      expect(result).toMatchObject(CARS_MOCK_CACHE_EMPTY)
    })

    it('should return non-empty cache', () => {
      // Act
      const result = TestSubject.createCache<ICar, CarUID>(
        MOPTIONS.idKey,
        COLLECTION
      )

      // Expect
      expect(result).toMatchObject(CACHE)
    })
  })

  describe('.delete', () => {
    const UIDS = [ENTITY_UID, faker.datatype.string()]
    const UIDS_EXPECTED = [ENTITY_UID]

    it('should throw if any entity does not exist but should', () => {
      // Arrange
      const should_exist = true
      let exception = {} as Exception

      // Act
      try {
        TestSubject.delete(UIDS, should_exist, CACHE, MOPTIONS)
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.toJSON()).toMatchObject({
        code: ExceptionStatusCode.NOT_FOUND,
        data: { should_exist, uids: UIDS }
      })
    })

    it('should filter out uids of entities that do not exist', () => {
      // Arrange
      const should_exist = false

      // Act
      const result = TestSubject.delete(UIDS, should_exist, CACHE, MOPTIONS)

      // Expect
      expect(mockOmit).toBeCalledWith(CACHE.root, UIDS_EXPECTED)
      expect(result.uids).toIncludeSameMembers(UIDS_EXPECTED)
    })

    it('should return object with new cache and deleted uids', () => {
      // Arrange
      const should_exist = false

      // Act
      const result = TestSubject.delete(
        ENTITY_UID,
        should_exist,
        CACHE,
        MOPTIONS
      )

      // Expect
      expect(mockOmit).toBeCalledWith(CACHE.root, UIDS_EXPECTED)
      expect(result.cache[ENTITY_UID]).not.toBeDefined()
      expect(result.uids).toIncludeSameMembers(UIDS_EXPECTED)
    })
  })

  describe('.formatCreateEntityDTO', () => {
    it('should merge dto with formatted entity uid', () => {
      // Arrange
      const uid = `${faker.datatype.string()}  `
      const dto = { [MOPTIONS.idKey]: uid }
      const euid = uid.trim()

      // Act
      const result = TestSubject.formatCreateEntityDTO(
        dto as CreateEntityDTO<ICar>,
        COLLECTION,
        MOPTIONS
      )

      // Expect
      expect(mockMerge).toBeCalledTimes(1)
      expect(mockMerge.mock.calls[0][1]).toMatchObject(dto)
      expect(mockMerge.mock.calls[0][2]).toMatchObject({
        [MOPTIONS.idKey]: euid
      })
      expect(result[MOPTIONS.idKey]).toBe(euid)
    })

    it('should throw Exception if entity uid conflict occurs', () => {
      // Arrange
      const dto = { [MOPTIONS.idKey]: ENTITY_UID }
      let exception = {} as Exception

      // Act
      try {
        TestSubject.formatCreateEntityDTO(
          dto as CreateEntityDTO<ICar>,
          COLLECTION,
          MOPTIONS
        )
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.toJSON()).toMatchObject({
        code: ExceptionStatusCode.CONFLICT,
        data: { dto },
        errors: { [MOPTIONS.idKey]: ENTITY_UID },
        message: `Entity with ${MOPTIONS.idKey} "${ENTITY_UID}" already exists`
      })
    })
  })

  describe('.formatPatchEntityDTO', () => {
    it('should call .findOneOrFail', () => {
      // Arrange
      // @ts-expect-error testing
      const spy_findOneOrFail = jest.spyOn(TestSubjectAbstract, 'findOneOrFail')

      // Act
      TestSubject.formatPatchEntityDTO(ENTITY_UID, {}, [], COLLECTION, MOPTIONS)

      // Expect
      expect(spy_findOneOrFail).toBeCalledTimes(1)
      expect(spy_findOneOrFail.mock.calls[0][0]).toBe(ENTITY_UID)
    })

    it('should remove readonly fields from dto', () => {
      // Arrange
      const dto = { [MOPTIONS.idKey]: faker.datatype.string(), foo: true }
      const rfields = ['foo']

      // Act
      const result = TestSubject.formatPatchEntityDTO(
        ENTITY_UID,
        dto,
        rfields,
        COLLECTION,
        MOPTIONS
      )

      // Expect
      expect(result[MOPTIONS.idKey]).not.toBe(dto[MOPTIONS.idKey])
      expect((result as ObjectPlain).foo).not.toBeDefined()
    })

    it('should merge entity with formatted dto', () => {
      // Arrange
      const dto = { make: 'MAKE' }

      // Act
      const result = TestSubject.formatPatchEntityDTO(
        ENTITY_UID,
        dto,
        [],
        COLLECTION,
        MOPTIONS
      )

      // Expect
      expect(result).toMatchObject(merge({}, ENTITY, dto))
    })
  })

  describe('#clear', () => {
    it('should call .createCache and clear repository', () => {
      // Arrange
      const spy_createCache = jest.spyOn(TestSubjectAbstract, 'createCache')

      // Act
      Subject.clear()

      // Expect
      expect(spy_createCache).toBeCalledTimes(1)
      expect(spy_createCache).toBeCalledWith(MOPTIONS.idKey, [])
    })

    it('should return true when repository is cleared', () => {
      // Act
      const result = Subject.clear()

      // Expect
      expect(result).toBeTrue()
    })
  })

  describe('#delete', () => {
    it('should call .delete and remove entities from cache', () => {
      // Arrange
      const spy_delete = jest.spyOn(TestSubjectAbstract, 'delete')
      const uid = COLLECTION[1][MOPTIONS.idKey]

      // Act
      Subject.delete(uid)

      // Expect
      expect(spy_delete).toBeCalledTimes(1)
      expect(spy_delete).toBeCalledWith(
        uid,
        undefined,
        Subject.cache,
        Subject.options.mingo,
        Subject.mingo
      )
    })

    it('should return array of deleted uids', () => {
      // Act
      const result = Subject.delete()

      // Expect
      expect(result).toBeArray()
    })
  })

  describe('#setCache', () => {
    const options: MangoRepoOptionsDTO<ICar, CarUID> = {
      ...CARS_MOCK_CACHE_EMPTY,
      mingo: MOPTIONS
    }

    it('should call .createCache', () => {
      // Arrange
      const spy_createCache = jest.spyOn(TestSubjectAbstract, 'createCache')
      const Subject = new TestSubject(Car, options)

      // Act
      Subject.setCache(COLLECTION)

      // Expect
      expect(spy_createCache).toBeCalledTimes(1)
      expect(spy_createCache).toBeCalledWith(MOPTIONS.idKey, COLLECTION)
    })

    it('should return copy of new cache', () => {
      // Arrange
      const Subject = new TestSubject(Car, options)

      // Act
      const result = Subject.setCache(COLLECTION)

      // Expect
      expect(result).toMatchObject(CACHE)
    })
  })
})
