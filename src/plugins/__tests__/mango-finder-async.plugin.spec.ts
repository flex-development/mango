import Super from '@/abstracts/mango-finder.abstract'
import type {
  CarParams,
  CarQuery,
  CarUID,
  ICar
} from '@tests/fixtures/cars.fixture'
import {
  CARS_FINDER_OPTIONS as OPTIONS,
  CARS_UID
} from '@tests/fixtures/cars.fixture'
import TestSubject from '../mango-finder-async.plugin'

/**
 * @file Unit Tests - MangoFinderAsync
 * @module plugins/tests/MangoFinderAsync
 */

// @ts-expect-error testing mock
const MockSuper = Super as jest.MockedClass<typeof Super>

describe('unit:plugins/MangoFinderAsync', () => {
  const Subject = new TestSubject<ICar, CarUID, CarParams, CarQuery>(OPTIONS)

  const DOCUMENT = Object.assign({}, Subject.cache.collection[0])
  const UID = DOCUMENT[CARS_UID]

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
      expect(result).toIncludeSameMembers([DOCUMENT])
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
      expect(result).toMatchObject(DOCUMENT)
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
      expect(result).toMatchObject(DOCUMENT)
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
      expect(result).toIncludeSameMembers([DOCUMENT])
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
      expect(result).toMatchObject(DOCUMENT)
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
      expect(result).toMatchObject(DOCUMENT)
    })
  })

  describe('#resetCache', () => {
    it('should clear #cache.collection', async () => {
      // Arrange
      const spy_super_resetCache = jest.spyOn(MockSuper.prototype, 'resetCache')

      // Act
      const result = await Subject.resetCache()

      // Expect
      expect(spy_super_resetCache).toBeCalledTimes(1)
      expect(result).toMatchObject({ collection: [] })
    })
  })
})
