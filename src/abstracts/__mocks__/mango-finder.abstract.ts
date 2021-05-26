/**
 * @file Mock - AbstractMangoFinder
 * @module abstracts/mocks/MangoFinder
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-user-modules
 */

const moduleName = '@/abstracts/mango-finder.abstract'
const ActualAbstractMangoFinder = jest.requireActual(moduleName).default

export default class MockAbstractMangoFinder extends ActualAbstractMangoFinder {
  //
}
