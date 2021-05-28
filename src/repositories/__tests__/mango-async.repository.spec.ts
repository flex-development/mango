import Super from '@/abstracts/mango-repo.abstract'
import { MangoRepoOptions } from '@/interfaces'
import {
  Car,
  CARS_MANGO_OPTIONS as OPTIONS,
  CARS_MOCK_CACHE_EMPTY,
  CarUID,
  ICar
} from '@tests/fixtures/cars.fixture'
import TestSubject from '../mango-async.repository'

/**
 * @file Unit Tests - MangoRepositoryAsync
 * @module repositories/tests/MangoRepositoryAsync
 */

// @ts-expect-error testing mock
const MockSuper = Super as jest.MockedClass<typeof Super>

describe('unit:repositories/MangoRepositoryAsync', () => {
  const Subject = new TestSubject<ICar, CarUID>(Car, OPTIONS)

  const SubjectE = new TestSubject<ICar, CarUID>(Car, {
    ...CARS_MOCK_CACHE_EMPTY,
    mingo: OPTIONS.mingo
  })

  const MOPTIONS = OPTIONS.mingo as MangoRepoOptions<ICar, CarUID>['mingo']

  const ENTITY = Object.assign({}, Subject.cache.collection[3])
  const UID = ENTITY[OPTIONS.mingo?.idKey as string]

  describe('#aggregate', () => {
    it('should run aggregation pipeline', async () => {
      // Arrange

      const spy_super_aggregate = jest.spyOn(MockSuper.prototype, 'aggregate')

      // Act
      const result = await Subject.aggregate()

      // Expect
      expect(spy_super_aggregate).toBeCalledTimes(1)
      expect(result).toIncludeSameMembers(Subject.cache.collection as ICar[])
    })
  })

  describe('#create', () => {
    afterEach(() => {
      // @ts-expect-error manually resetting cache
      SubjectE.cache = CARS_MOCK_CACHE_EMPTY
    })

    it('should call .formatCreateEntityDTO', async () => {
      // Arrange
      const spy_method = 'formatCreateEntityDTO'
      // @ts-expect-error testing invocation
      const spy_formatCreateEntityDTO = jest.spyOn(TestSubject, spy_method)

      // Act
      await SubjectE.create(ENTITY)

      // Expect
      expect(spy_formatCreateEntityDTO).toBeCalledTimes(1)
    })

    it('should call #validator.check', async () => {
      // Arrange
      const spy_validator_check = jest.spyOn(SubjectE.validator, 'check')

      // Act
      await SubjectE.create(ENTITY)

      // Expect
      expect(spy_validator_check).toBeCalledTimes(1)
    })

    it('should call #setCache', async () => {
      // Arrange
      const spy_setCache = jest.spyOn(SubjectE, 'setCache')

      // Act
      const result = await SubjectE.create(ENTITY)

      // Expect
      expect(result).toMatchObject(ENTITY)
      expect(spy_setCache).toBeCalledTimes(1)
    })
  })

  describe('#find', () => {
    it('should execute search', async () => {
      // Arrange
      const spy_super_find = jest.spyOn(MockSuper.prototype, 'find')

      // Act
      const result = await Subject.find()

      // Expect
      expect(spy_super_find).toBeCalledTimes(1)
      expect(result).toIncludeSameMembers(Subject.cache.collection as ICar[])
    })
  })

  describe('#findByIds', () => {
    it('should return specified documents', async () => {
      // Arrange
      const spy_super_findByIds = jest.spyOn(MockSuper.prototype, 'findByIds')

      // Act
      const result = await Subject.findByIds([UID])

      // Expect
      expect(spy_super_findByIds).toBeCalledTimes(1)
      expect(result).toIncludeSameMembers([ENTITY])
    })
  })

  describe('#findOne', () => {
    it('should return document', async () => {
      // Arrange
      const spy_super_findOne = jest.spyOn(MockSuper.prototype, 'findOne')

      // Act
      const result = await Subject.findOne(UID)

      // Expect
      expect(spy_super_findOne).toBeCalledTimes(1)
      expect(result).toMatchObject(ENTITY)
    })
  })

  describe('#findOneOrFail', () => {
    it('should return document', async () => {
      // Arrange
      const spy = 'findOneOrFail'
      const spy_super_findOneOrFail = jest.spyOn(MockSuper.prototype, spy)

      // Act
      const result = await Subject.findOneOrFail(UID)

      // Expect
      expect(spy_super_findOneOrFail).toBeCalledTimes(1)
      expect(result).toMatchObject(ENTITY)
    })
  })

  describe('#patch', () => {
    it('should call .formatPatchEntityDTO', async () => {
      // Arrange
      const spy_method = 'formatPatchEntityDTO'
      const spy_formatPatchEntityDTO = jest.spyOn(TestSubject, spy_method)

      // Act
      await Subject.patch(ENTITY[MOPTIONS.idKey], {})

      // Expect
      expect(spy_formatPatchEntityDTO).toBeCalledTimes(1)
    })

    it('should call #validator.check', async () => {
      // Arrange
      const spy_validator_check = jest.spyOn(Subject.validator, 'check')

      // Act
      await Subject.patch(ENTITY[MOPTIONS.idKey], {})

      // Expect
      expect(spy_validator_check).toBeCalledTimes(1)
    })

    it('should call #setCache', async () => {
      // Arrange
      const spy_setCache = jest.spyOn(Subject, 'setCache')
      const dto = { make: 'MAKE' }

      // Act
      await Subject.patch(ENTITY[MOPTIONS.idKey], dto)

      // Expect
      expect(spy_setCache).toBeCalledTimes(1)
      expect(Subject.cache.root[ENTITY[MOPTIONS.idKey]]).toMatchObject(dto)
    })
  })

  describe('#query', () => {
    it('should query documents', async () => {
      // Arrange
      const spy_super_query = jest.spyOn(MockSuper.prototype, 'query')

      // Act
      const result = await Subject.query()

      // Expect
      expect(spy_super_query).toBeCalledTimes(1)
      expect(result).toIncludeSameMembers(Subject.cache.collection as ICar[])
    })
  })

  describe('#queryByIds', () => {
    it('should return requested documents', async () => {
      // Arrange
      const spy_super_queryByIds = jest.spyOn(MockSuper.prototype, 'queryByIds')

      // Act
      const result = await Subject.queryByIds([UID])

      // Expect
      expect(spy_super_queryByIds).toBeCalledTimes(1)
      expect(result).toBeArrayOfSize(1)
      expect(result[0][MOPTIONS.idKey]).toBe(ENTITY[MOPTIONS.idKey])
    })
  })

  describe('#queryOne', () => {
    it('should return document', async () => {
      // Arrange
      const spy_super_queryOne = jest.spyOn(MockSuper.prototype, 'queryOne')

      // Act
      const result = await Subject.queryOne(UID)

      // Expect
      expect(spy_super_queryOne).toBeCalledTimes(1)
      expect(result?.[MOPTIONS.idKey]).toBe(ENTITY[MOPTIONS.idKey])
    })
  })

  describe('#queryOneOrFail', () => {
    it('should return document', async () => {
      // Arrange
      const spy = 'queryOneOrFail'
      const spy_super_queryOneOrFail = jest.spyOn(MockSuper.prototype, spy)

      // Act
      const result = await Subject.queryOneOrFail(UID)

      // Expect
      expect(spy_super_queryOneOrFail).toBeCalledTimes(1)
      expect(result?.[MOPTIONS.idKey]).toBe(ENTITY[MOPTIONS.idKey])
    })
  })

  describe('#save', () => {
    const DTO_BASE = { make: 'MAKE', model: 'MODEL', model_year: -1 }

    const spy_findOne = jest.spyOn(Subject, 'findOne')

    it('should create new entity', async () => {
      // Arrange
      const spy_create = jest.spyOn(Subject, 'create')

      // Act
      spy_findOne.mockReturnValueOnce(Promise.resolve(null))

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
      spy_findOne.mockReturnValue(Promise.resolve(ENTITY))

      await Subject.save(dto)

      // Expect
      expect(spy_patch).toBeCalledTimes(1)
      expect(spy_patch).toBeCalledWith(dto[MOPTIONS.idKey], dto)
    })
  })

  describe('#setCache', () => {
    it('should clear #cache.collection', async () => {
      // Arrange
      const spy_super_setCache = jest.spyOn(MockSuper.prototype, 'setCache')

      // Act
      const result = await Subject.setCache()

      // Expect
      expect(spy_super_setCache).toBeCalledTimes(1)
      expect(result).toMatchObject({ collection: [] })
    })
  })
})
