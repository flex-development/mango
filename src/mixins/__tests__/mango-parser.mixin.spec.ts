import { ProjectRule } from '@/enums'
import type { MangoParserOptions } from '@/interfaces'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import TestSubject from '../mango-parser.mixin'

/**
 * @file Unit Tests - MangoParser
 * @module mixins/tests/MangoParser
 */

describe('unit:mixins/MangoParser', () => {
  describe('constructor', () => {
    it('should remove options.objectIdFields', () => {
      // Arrange
      const options = ({ objectIdFields: [] } as unknown) as MangoParserOptions

      // Act
      const mparser = new TestSubject(options)

      // Expect
      // @ts-expect-error testing
      expect(mparser.options.objectIdFields).not.toBeDefined()
    })

    it('should remove options.parameters', () => {
      // Arrange
      const options = ({ parameters: '' } as unknown) as MangoParserOptions

      // Act
      const mparser = new TestSubject(options)

      // Expect
      // @ts-expect-error testing
      expect(mparser.options.parameters).not.toBeDefined()
    })
  })

  describe('#params', () => {
    const options = { fullTextFields: ['created_at', 'id'] }

    const Subject = new TestSubject(options as MangoParserOptions)

    const spy_parser = jest.spyOn(Subject, 'parser')

    it('should parse url query string', () => {
      // Arrange
      const querystring = 'fields=created_at&sort=created_at,-id&limit=10'

      // Act
      Subject.params(querystring)

      // Expect
      expect(spy_parser).toBeCalledTimes(1)
      expect(spy_parser.mock.calls[0][0]).toBe(querystring)
    })

    it('should parse url query object', () => {
      // Arrange
      const query = {
        fields: 'created_at,-updated_at',
        limit: '10',
        q: 'foo',
        sort: 'created_at,-id'
      }

      // Act
      Subject.params(query)

      // Expect
      expect(spy_parser).toBeCalledTimes(1)
      expect(spy_parser.mock.calls[0][0]).toBe(query)
    })

    it('should throw Exception if #parser throws', () => {
      // Arrange
      const query = { q: 'will cause error' }
      let exception = {} as Exception

      // Act
      try {
        new TestSubject().params(query)
      } catch (error) {
        exception = error
      }

      // Expect
      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.data).toMatchObject({ parser_options: {}, query })
    })
  })

  describe('#queryCriteriaOptions', () => {
    const Subject = new TestSubject()

    it('should convert base options into QueryCriteriaOptions object', () => {
      // Arrange
      const projection = { created_at: ProjectRule.PICK }

      // Act
      const options = Subject.queryCriteriaOptions({ projection })

      // Expect
      expect(options.$project).toMatchObject(projection)
    })
  })
})
