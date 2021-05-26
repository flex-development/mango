import MINGO from '@/config/mingo'
import type { MangoFinderOptionsDTO } from '@/dtos'
import { SortOrder } from '@/enums/sort-order.enum'
import type {
  AggregationStages,
  MangoCacheFinder as MangoCache,
  MingoOptions
} from '@/interfaces'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import { PlainObject } from '@flex-development/exceptions/types'
import type { ObjectPlain } from '@flex-development/tutils'
import type { CarUID, ICar } from '@tests/fixtures/cars.fixture'
import {
  CARS_FINDER_OPTIONS as OPTIONS,
  CARS_MOCK_CACHE_EMPTY,
  CARS_UID
} from '@tests/fixtures/cars.fixture'
import faker from 'faker'
import TestSubjectAbstract from '../mango-finder.abstract'
import TestSubject from './__fixtures__/cars-finder.fixture'

/**
 * @file Unit Tests - AbstractMangoFinder
 * @module abstracts/tests/MangoFinder
 */

describe('unit:abstracts/AbstractMangoFinder', () => {
  const Subject = new TestSubject(OPTIONS)

  const SubjectE = new TestSubject({
    cache: CARS_MOCK_CACHE_EMPTY as MangoFinderOptionsDTO<ICar>['cache'],
    mingo: OPTIONS.mingo
  })

  const CACHE = OPTIONS.cache as MangoCache<ICar>
  const COLLECTION = CACHE.collection
  const MOPTIONS = OPTIONS.mingo as MingoOptions<CarUID>

  const DOCUMENT = COLLECTION[3]
  const UID = DOCUMENT[CARS_UID]
  const UIDS = [UID, COLLECTION[0][CARS_UID], COLLECTION[2][CARS_UID]]
  const FUID = `vin-0${faker.datatype.number(5)}`

  describe('constructor', () => {
    it('should initialize instance properties', () => {
      // Arrange
      const Subject = new TestSubject(OPTIONS)
      const eoptions = { mingo: MOPTIONS, parser: {} }

      // Expect
      expect(Subject.cache).toMatchObject(CACHE)
      expect(Subject.logger).toBeDefined()
      expect(Subject.mingo).toBeDefined()
      expect(Subject.mparser).toBeDefined()
      expect(Subject.options).toMatchObject(eoptions)
    })
  })

  describe('.aggregate', () => {
    const mingo_aggregate = jest.spyOn(MINGO, 'aggregate')

    it('should throw Exception if error occurs', () => {
      // Arrange
      const error_message = 'Test aggregate error'
      let exception = {} as Exception

      // Act
      try {
        mingo_aggregate.mockImplementationOnce(() => {
          throw new Error(error_message)
        })

        TestSubject.aggregate()
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.data).toMatchObject({ pipeline: [] })
      expect(exception.message).toBe(error_message)
    })

    describe('runs pipeline', () => {
      const stage: AggregationStages<ICar> = { $count: 'total_cars' }
      const pipeline: AggregationStages<ICar>[] = [stage]

      it('should run pipeline after converting stage into stages array', () => {
        // Act
        TestSubject.aggregate(stage, COLLECTION, MOPTIONS)

        // Expect
        expect(mingo_aggregate).toBeCalledTimes(1)
        expect(mingo_aggregate).toBeCalledWith(COLLECTION, pipeline, MOPTIONS)
      })

      it('should run pipeline with stages array', () => {
        // Act
        TestSubject.aggregate(pipeline, COLLECTION, MOPTIONS)

        // Expect
        expect(mingo_aggregate).toBeCalledTimes(1)
        expect(mingo_aggregate).toBeCalledWith(COLLECTION, pipeline, MOPTIONS)
      })
    })
  })

  describe('.find', () => {
    const mockCursor = {
      all: jest.fn().mockReturnValue(COLLECTION),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis()
    }

    const mockMingo = ({
      aggregate: jest.fn(MINGO.aggregate),
      find: jest.fn().mockReturnValue(mockCursor)
    } as unknown) as typeof MINGO

    it('should run aggregation pipeline with $project stage', () => {
      // Arrange
      const spy_aggregate = jest.spyOn(TestSubjectAbstract, 'aggregate')
      const options = { $project: { model: true } }
      const estage = { $project: options.$project }

      // Act
      TestSubject.find({ options }, COLLECTION, MOPTIONS, mockMingo)

      // Expect
      expect(spy_aggregate).toBeCalledTimes(1)
      expect(spy_aggregate).toBeCalledWith(
        estage,
        COLLECTION,
        MOPTIONS,
        mockMingo
      )
    })

    it('should handle query criteria', () => {
      // Arrange
      const params = { [CARS_UID]: UID }

      // Act
      TestSubject.find(params, COLLECTION, MOPTIONS, mockMingo)

      // Expect
      expect(mockMingo.find).toBeCalledTimes(1)
      expect(mockMingo.find).toBeCalledWith(COLLECTION, params, {}, MOPTIONS)
    })

    it('should sort results', () => {
      // Arrange
      const options = { sort: { [CARS_UID]: SortOrder.ASCENDING } }

      // Act
      TestSubject.find({ options }, COLLECTION, MOPTIONS, mockMingo)

      // Expect
      expect(mockMingo.find).toBeCalledTimes(1)
      expect(mockCursor.sort).toBeCalledWith(options.sort)
    })

    it('should offset results', () => {
      // Arrange
      const options = { skip: 2 }

      // Act
      TestSubject.find({ options }, COLLECTION, MOPTIONS, mockMingo)

      // Expect
      expect(mockMingo.find).toBeCalledTimes(1)
      expect(mockCursor.skip).toBeCalledWith(options.skip)
    })

    it('should limit results', () => {
      // Arrange
      const options = { limit: 1 }

      // Act
      TestSubject.find({ options }, COLLECTION, MOPTIONS, mockMingo)

      // Expect
      expect(mockMingo.find).toBeCalledTimes(1)
      expect(mockCursor.limit).toBeCalledWith(options.limit)
    })

    it('should throw Exception if error occurs', () => {
      // Arrange
      const error_message = 'Test find error'
      let exception = {} as Exception

      // Act
      try {
        // @ts-expect-error actually a mock
        mockMingo.find.mockImplementationOnce(() => {
          throw new Error(error_message)
        })

        TestSubject.find({}, COLLECTION, MOPTIONS, mockMingo)
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.data).toMatchObject({ params: {} })
      expect(exception.message).toBe(error_message)
    })
  })

  describe('.findByIds', () => {
    // @ts-expect-error testing
    const spy_find = jest.spyOn(TestSubjectAbstract, 'find')

    it('should return specified documents', () => {
      // Act
      const documents = TestSubject.findByIds(UIDS, {}, COLLECTION, MOPTIONS)

      // Expect
      expect(spy_find).toBeCalledTimes(1)
      expect(spy_find).toBeCalledWith({}, COLLECTION, MOPTIONS, MINGO)
      expect((documents as PlainObject[]).length).toBe(UIDS.length)
    })

    describe('throws Exception', () => {
      it('should throw Exception if error is Error class type', () => {
        // Arrange
        let exception = {} as Exception

        // Act
        try {
          // @ts-expect-error mocking
          jest.spyOn(Array.prototype, 'filter').mockImplementationOnce(() => {
            throw new Error()
          })

          TestSubject.findByIds()
        } catch (error) {
          exception = error
        }

        // Expect
        expect(exception.constructor.name).toBe('Exception')
        expect(exception.data).toMatchObject({ params: {}, uids: [] })
      })

      it('should throw Exception if error is Exception class type', () => {
        // Arrange
        let exception = {} as Exception

        // Act
        try {
          spy_find.mockImplementationOnce(() => {
            throw new Exception()
          })

          TestSubject.findByIds()
        } catch (error) {
          exception = error
        }

        // Expect
        expect(exception.constructor.name).toBe('Exception')
        expect(exception.data).toMatchObject({ params: {}, uids: [] })
      })
    })
  })

  describe('.findOne', () => {
    const spy_find = jest.spyOn(TestSubjectAbstract, 'find')

    it('should return document', () => {
      // Arrange
      const eparams = { [CARS_UID]: UID }
      spy_find.mockReturnValueOnce([DOCUMENT] as ObjectPlain[])

      // Act
      const result = TestSubject.findOne(UID, {}, COLLECTION, MOPTIONS)

      // Expect
      expect(spy_find).toBeCalledTimes(1)
      expect(spy_find).toBeCalledWith(eparams, COLLECTION, MOPTIONS, MINGO)
      expect(result).toMatchObject(DOCUMENT)
    })

    it('should return null if document is not found', () => {
      // Arrange
      const eparams = { [CARS_UID]: FUID }
      spy_find.mockReturnValueOnce([])

      // Act
      const result = TestSubject.findOne(FUID, {}, COLLECTION, MOPTIONS)

      // Expect
      expect(spy_find).toBeCalledTimes(1)
      expect(spy_find).toBeCalledWith(eparams, COLLECTION, MOPTIONS, MINGO)
      expect(result).toBe(null)
    })
  })

  describe('.findOneOrFail', () => {
    const spy_findOne = jest.spyOn(TestSubjectAbstract, 'findOne')

    it('should return document', () => {
      // Arrange
      spy_findOne.mockReturnValueOnce(DOCUMENT as ObjectPlain)

      // Act
      const result = TestSubject.findOneOrFail(UID, {}, COLLECTION, MOPTIONS)

      // Expect
      expect(spy_findOne).toBeCalledTimes(1)
      expect(spy_findOne).toBeCalledWith(UID, {}, COLLECTION, MOPTIONS, MINGO)
      expect(result).toMatchObject(DOCUMENT)
    })

    it('should throw Exception if document is not found', () => {
      // Arrange
      let exception = {} as Exception

      // Act
      try {
        TestSubject.findOneOrFail(FUID, {}, COLLECTION, MOPTIONS)
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.NOT_FOUND)
      expect(exception.data).toMatchObject({ params: {} })
      expect((exception.errors as ObjectPlain)[CARS_UID]).toBe(FUID)
      expect(exception.message).toMatch(new RegExp(`"${FUID}" does not exist`))
    })
  })

  describe('#aggregate', () => {
    const spy_aggregate = jest.spyOn(TestSubjectAbstract, 'aggregate')

    it('should call .aggregate if #cache.collection is not empty', () => {
      // Act
      Subject.aggregate()

      // Expect
      expect(spy_aggregate).toBeCalledTimes(1)
    })

    it('should not call .aggregate if #cache.collection is empty', () => {
      // Act
      SubjectE.aggregate()

      // Expect
      expect(spy_aggregate).toBeCalledTimes(0)
    })
  })

  describe('#find', () => {
    const spy_find = jest.spyOn(TestSubjectAbstract, 'find')

    it('should call .find if #cache.collection is not empty', () => {
      // Act
      Subject.find()

      // Expect
      expect(spy_find).toBeCalledTimes(1)
    })

    it('should not call .find if #cache.collection is empty', () => {
      // Act
      SubjectE.find()

      // Expect
      expect(spy_find).toBeCalledTimes(0)
    })
  })

  describe('#findByIds', () => {
    it('should call .findByIds', () => {
      // Arrange
      const spy_findByIds = jest.spyOn(TestSubjectAbstract, 'findByIds')

      // Act
      Subject.findByIds(UIDS)

      // Expect
      expect(spy_findByIds).toBeCalledTimes(1)
    })
  })

  describe('#findOne', () => {
    it('should call .findOne', () => {
      // Arrange
      const spy_findOne = jest.spyOn(TestSubjectAbstract, 'findOne')

      // Act
      Subject.findOne(UID)

      // Expect
      expect(spy_findOne).toBeCalledTimes(1)
    })
  })

  describe('#findOneOrFail', () => {
    it('should call .findOneOrFail', () => {
      // Arrange
      const spy_findOneOrFail = jest.spyOn(TestSubjectAbstract, 'findOneOrFail')

      // Act
      Subject.findOneOrFail(UID)

      // Expect
      expect(spy_findOneOrFail).toBeCalledTimes(1)
    })
  })

  describe('#query', () => {
    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_find = jest.spyOn(TestSubjectAbstract, 'find')

    beforeEach(() => {
      Subject.query()
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call .find', () => {
      expect(spy_find).toBeCalledTimes(1)
    })
  })

  describe('#queryByIds', () => {
    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_findByIds = jest.spyOn(TestSubjectAbstract, 'findByIds')

    beforeEach(() => {
      Subject.queryByIds()
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call .findByIds', () => {
      expect(spy_findByIds).toBeCalledTimes(1)
    })
  })

  describe('#queryOne', () => {
    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_findOne = jest.spyOn(TestSubjectAbstract, 'findOne')

    beforeEach(() => {
      Subject.queryOne(Subject.cache.collection[0][CARS_UID])
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call .findOne', () => {
      expect(spy_findOne).toBeCalledTimes(1)
    })
  })

  describe('#queryOneOrFail', () => {
    const DOCUMENT = Subject.cache.collection[4]

    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_findOneOrFail = jest.spyOn(TestSubjectAbstract, 'findOneOrFail')

    beforeEach(() => {
      spy_findOneOrFail.mockReturnValueOnce(DOCUMENT as ObjectPlain)
      Subject.queryOneOrFail(DOCUMENT[CARS_UID])
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call .findOneOrFail', () => {
      expect(spy_findOneOrFail).toBeCalledTimes(1)
    })
  })

  describe('#setCache', () => {
    it('should clear #cache.collection', () => {
      // Arrange
      const Subject = new TestSubject(OPTIONS)

      // Act
      Subject.setCache()

      // Expect
      expect(Subject.cache.collection).toBeArrayOfSize(0)
    })

    it('should insert documents into #cache.collection', () => {
      // Arrange
      const SubjectE = new TestSubject()
      const collection = [...CACHE.collection]

      // Act
      SubjectE.setCache(collection)

      // Expect
      expect(SubjectE.cache).toMatchObject(CACHE)
      expect(SubjectE.cache.collection).toIncludeAllMembers(collection)
    })
  })

  describe('#uid', () => {
    it('should return name of document uid field', () => {
      expect(Subject.uid()).toBe(CARS_UID)
    })
  })
})
