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
      const options = ({ objectIdFields: [] } as unknown) as MangoParserOptions

      const mparser = new TestSubject(options)

      // @ts-expect-error testing
      expect(mparser.options.objectIdFields).not.toBeDefined()
    })

    it('should remove options.parameters', () => {
      const options = ({ parameters: '' } as unknown) as MangoParserOptions

      const mparser = new TestSubject(options)

      // @ts-expect-error testing
      expect(mparser.options.parameters).not.toBeDefined()
    })
  })

  describe('#params', () => {
    const Subject = new TestSubject({ fullTextFields: ['created_at', 'id'] })

    const spy_parser = jest.spyOn(Subject, 'parser')

    it('should parse url query string', () => {
      const querystring = 'fields=created_at&sort=created_at,-id&limit=10'

      Subject.params(querystring)

      expect(spy_parser).toBeCalledTimes(1)
      expect(spy_parser.mock.calls[0][0]).toBe(querystring)
    })

    it('should parse url query object', () => {
      const query = {
        fields: 'created_at,-updated_at',
        limit: '10',
        q: 'foo',
        sort: 'created_at,-id'
      }

      Subject.params(query)

      expect(spy_parser).toBeCalledTimes(1)
      expect(spy_parser.mock.calls[0][0]).toBe(query)
    })

    it('should throw Exception if #parser throws', () => {
      const query = { q: 'will cause error' }

      let exception = {} as Exception

      try {
        new TestSubject().params(query)
      } catch (error) {
        exception = error
      }

      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.data).toMatchObject({ parser_options: {}, query })
    })
  })

  describe('#queryCriteriaOptions', () => {
    const Subject = new TestSubject()

    it('should convert base options into QueryCriteriaOptions object', () => {
      const projection = { created_at: ProjectRule.PICK }

      const options = Subject.queryCriteriaOptions({ projection })

      expect(options.$project).toMatchObject(projection)
    })
  })
})
