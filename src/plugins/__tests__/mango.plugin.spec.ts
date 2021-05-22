import type { MangoOptionsDTO } from '@/dto'
import { SortOrder } from '@/enums/sort-order.enum'
import type { AggregationStages } from '@/interfaces'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { UnknownObject } from '@flex-development/tutils'
import type {
  CarParams,
  CarQuery,
  CarUID,
  ICar
} from '@tests/fixtures/cars.fixture'
import {
  CARS_IDKEY,
  CARS_MOCK_CACHE,
  CARS_MOCK_CACHE_EMPTY
} from '@tests/fixtures/cars.fixture'
import faker from 'faker'
import TestSubject from '../mango.plugin'

/**
 * @file Unit Tests - Mango
 * @module plugins/tests/Mango
 */

describe('unit:plugins/Mango', () => {
  const dto: MangoOptionsDTO<ICar, CarUID> = {
    cache: CARS_MOCK_CACHE as MangoOptionsDTO<ICar>['cache'],
    mingo: { idKey: CARS_IDKEY }
  }

  const dto_e: MangoOptionsDTO<ICar, CarUID> = {
    cache: CARS_MOCK_CACHE_EMPTY as MangoOptionsDTO<ICar>['cache'],
    mingo: dto.mingo
  }

  const Subject = new TestSubject<ICar, CarUID, CarParams, CarQuery>(dto)
  const SubjectE = new TestSubject<ICar, CarUID, CarParams, CarQuery>(dto_e)

  const FUID = `vin-0${faker.datatype.number(5)}`

  describe('constructor', () => {
    it('should initialize instance properties', () => {
      expect(Subject.cache).toMatchObject(CARS_MOCK_CACHE)
      expect(Subject.logger).toBeDefined()
      expect(Subject.mingo).toBeDefined()
      expect(Subject.mparser).toBeDefined()
      expect(Subject.options).toMatchObject({ mingo: dto.mingo, parser: {} })
    })
  })

  describe('#aggregate', () => {
    const spy_aggregate = jest.spyOn(Subject.mingo, 'aggregate')

    it('should not call #mingo.aggregate if cache is empty', () => {
      // Arrange
      const this_spy_aggregate = jest.spyOn(SubjectE.mingo, 'aggregate')

      // Act
      SubjectE.aggregate()

      // Expect
      expect(this_spy_aggregate).toBeCalledTimes(0)
    })

    it('should throw Exception if error occurs', () => {
      // Arrange
      const error_message = 'Test aggregate error'
      let exception = {} as Exception

      // Act
      try {
        spy_aggregate.mockImplementationOnce(() => {
          throw new Error(error_message)
        })

        Subject.aggregate()
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.data).toMatchObject({ pipeline: [] })
      expect(exception.message).toBe(error_message)
    })

    describe('runs pipeline', () => {
      const collection = Subject.cache.collection
      const options = Subject.options.mingo

      const stage: AggregationStages<ICar> = { $count: 'total_cars' }
      const pipeline: AggregationStages<ICar>[] = [stage]

      it('should run pipeline after converting stage into stages array', () => {
        // Act
        Subject.aggregate(stage)

        // Expect
        expect(spy_aggregate).toBeCalledTimes(1)
        expect(spy_aggregate).toBeCalledWith(collection, pipeline, options)
      })

      it('should run pipeline with stages array', () => {
        // Act
        Subject.aggregate(pipeline)

        // Expect
        expect(spy_aggregate).toBeCalledTimes(1)
        expect(spy_aggregate).toBeCalledWith(collection, pipeline, options)
      })
    })
  })

  describe('#find', () => {
    const mockCursor = {
      all: jest.fn().mockReturnValue(CARS_MOCK_CACHE.collection),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis()
    }

    const mockFind = jest.fn().mockReturnValue(mockCursor)

    const spy_mingo_find = jest.spyOn(Subject.mingo, 'find')

    beforeAll(() => {
      spy_mingo_find.mockImplementation(mockFind)
    })

    it('should not call #mingo.find if cache is empty', () => {
      // Arrange
      const this_spy_mingo_find = jest.spyOn(SubjectE.mingo, 'find')
      this_spy_mingo_find.mockImplementationOnce(mockFind)

      // Act
      SubjectE.find()

      // Expect
      expect(SubjectE.mingo.find).toBeCalledTimes(0)
    })

    it('should run aggregation pipeline with $project stage', () => {
      // Arrange
      const spy_aggregate = jest.spyOn(Subject, 'aggregate')
      const options = { $project: { model: true } }

      // Act
      Subject.find({ options })

      // Expect
      expect(spy_aggregate).toBeCalledTimes(1)
      expect(spy_aggregate).toBeCalledWith({ $project: options.$project })
    })

    it('should handle query criteria', () => {
      // Arrange
      const { collection } = Subject.cache
      const params = { [CARS_IDKEY]: collection[0][CARS_IDKEY] }
      const eargs = [collection, params, {}, Subject.options.mingo]

      // Act
      Subject.find(params)

      // Expect
      expect(Subject.mingo.find).toBeCalledTimes(1)
      expect(Subject.mingo.find).toBeCalledWith(...eargs)
    })

    it('should sort results', () => {
      // Arrange
      const options = { sort: { [CARS_IDKEY]: SortOrder.ASCENDING } }

      // Act
      Subject.find({ options })

      // Expect
      expect(Subject.mingo.find).toBeCalledTimes(1)
      expect(mockCursor.sort).toBeCalledWith(options.sort)
    })

    it('should offset results', () => {
      // Arrange
      const options = { skip: 2 }

      // Act
      Subject.find({ options })

      // Expect
      expect(Subject.mingo.find).toBeCalledTimes(1)
      expect(mockCursor.skip).toBeCalledWith(options.skip)
    })

    it('should limit results', () => {
      // Arrange
      const options = { limit: 1 }

      // Act
      Subject.find({ options })

      // Expect
      expect(Subject.mingo.find).toBeCalledTimes(1)
      expect(mockCursor.limit).toBeCalledWith(options.limit)
    })

    it('should throw Exception if error occurs', () => {
      // Arrange
      const error_message = 'Test find error'
      let exception = {} as Exception

      // Act
      try {
        spy_mingo_find.mockImplementationOnce(() => {
          throw new Error(error_message)
        })

        Subject.find()
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.data).toMatchObject({ params: {} })
      expect(exception.message).toBe(error_message)
    })
  })

  describe('#findByIds', () => {
    const spy_find = jest.spyOn(Subject, 'find')

    it('should return specified documents', () => {
      // Arrange
      const { collection } = Subject.cache
      const ids = [collection[0].vin, collection[2].vin]

      // Act
      const documents = Subject.findByIds(ids)

      // Expect
      expect(spy_find).toBeCalledTimes(1)
      expect(spy_find).toBeCalledWith({})
      expect(documents.length).toBe(ids.length)
    })

    describe('throws Exception', () => {
      it('should throw Exception if error is Error class type', () => {
        // Arrange
        let exception = {} as Exception

        // Act
        try {
          // @ts-expect-error mocking
          jest.spyOn(Array.prototype, 'includes').mockImplementationOnce(() => {
            throw new Error()
          })

          Subject.findByIds()
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

          Subject.findByIds()
        } catch (error) {
          exception = error
        }

        // Expect
        expect(exception.constructor.name).toBe('Exception')
        expect(exception.data).toMatchObject({ params: {}, uids: [] })
      })
    })
  })

  describe('#findOne', () => {
    const spy_find = jest.spyOn(Subject, 'find')

    it('should return document', () => {
      // Arrange
      const DOCUMENT = Subject.cache.collection[3]
      spy_find.mockReturnValue([DOCUMENT])

      // Act
      const result = Subject.findOne(DOCUMENT[CARS_IDKEY])

      // Expect
      expect(spy_find).toBeCalledTimes(1)
      expect(spy_find).toBeCalledWith({ [CARS_IDKEY]: DOCUMENT[CARS_IDKEY] })
      expect(result).toMatchObject(DOCUMENT)
    })

    it('should return null if document is not found', () => {
      // Arrange
      spy_find.mockReturnValue(CARS_MOCK_CACHE_EMPTY.collection as ICar[])

      // Act
      const result = Subject.findOne(FUID)

      // Expect
      expect(spy_find).toBeCalledTimes(1)
      expect(spy_find).toBeCalledWith({ [CARS_IDKEY]: FUID })
      expect(result).toBe(null)
    })
  })

  describe('#findOneOrFail', () => {
    const spy_findOne = jest.spyOn(Subject, 'findOne')

    it('should return document', () => {
      // Arrange
      const DOCUMENT = Subject.cache.collection[2]
      spy_findOne.mockReturnValueOnce(DOCUMENT)

      // Act
      const result = Subject.findOneOrFail(DOCUMENT[CARS_IDKEY])

      // Expect
      expect(spy_findOne).toBeCalledTimes(1)
      expect(spy_findOne).toBeCalledWith(DOCUMENT[CARS_IDKEY], {})
      expect(result).toMatchObject(DOCUMENT)
    })

    it('should throw Exception if document is not found', () => {
      // Arrange
      let exception = {} as Exception

      // Act
      try {
        Subject.findOneOrFail(FUID)
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.NOT_FOUND)
      expect(exception.data).toMatchObject({ params: {} })
      expect((exception.errors as UnknownObject)[CARS_IDKEY]).toBe(FUID)
      expect(exception.message).toMatch(new RegExp(`"${FUID}" does not exist`))
    })
  })

  describe('#query', () => {
    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_find = jest.spyOn(Subject, 'find')

    beforeEach(() => {
      Subject.query()
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call #find', () => {
      expect(spy_find).toBeCalledTimes(1)
    })
  })

  describe('#queryByIds', () => {
    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_findByIds = jest.spyOn(Subject, 'findByIds')

    beforeEach(() => {
      Subject.queryByIds()
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call #findByIds', () => {
      expect(spy_findByIds).toBeCalledTimes(1)
    })
  })

  describe('#queryOne', () => {
    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_findOne = jest.spyOn(Subject, 'findOne')

    beforeEach(() => {
      Subject.queryOne(Subject.cache.collection[0][CARS_IDKEY])
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call #findOne', () => {
      expect(spy_findOne).toBeCalledTimes(1)
    })
  })

  describe('#queryOneOrFail', () => {
    const DOCUMENT = Subject.cache.collection[4]

    const spy_mparser_params = jest.spyOn(Subject.mparser, 'params')
    const spy_findOneOrFail = jest.spyOn(Subject, 'findOneOrFail')

    beforeEach(() => {
      spy_findOneOrFail.mockReturnValueOnce(DOCUMENT)
      Subject.queryOneOrFail(DOCUMENT[CARS_IDKEY])
    })

    it('should call #mparser.params', () => {
      expect(spy_mparser_params).toBeCalledTimes(1)
      expect(spy_mparser_params).toBeCalledWith(undefined)
    })

    it('should call #findOneOrFail', () => {
      expect(spy_findOneOrFail).toBeCalledTimes(1)
    })
  })

  describe('#resetCache', () => {
    it('should update documents in cache', () => {
      // Arrange
      const SubjectE = new TestSubject<ICar, CarUID>()
      const collection = Subject.cache.collection as ICar[]

      // Act
      SubjectE.resetCache(collection)

      // Expect
      expect(SubjectE.cache).toMatchObject(Subject.cache)
      expect(collection).toIncludeAllMembers(Subject.cache.collection as ICar[])
    })
  })
})
