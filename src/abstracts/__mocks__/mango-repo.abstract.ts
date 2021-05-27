/**
 * @file Mock - AbstractMangoRepository
 * @module abstracts/mocks/MangoRepository
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-user-modules
 */

const moduleName = '@/abstracts/mango-repo.abstract'
const ActualAbstractMangoRepository = jest.requireActual(moduleName).default

export default class MockAbstractMangoRepository extends ActualAbstractMangoRepository {
  //
}
