import type {
  CarParams,
  CarQuery,
  CarUID,
  ICar
} from '@tests/fixtures/cars.fixture'
import AbstractMangoFinder from '../../mango-finder.abstract'

/**
 * @file Test Fixture - CarsFinder
 * @module abstracts/tests/fixtures/cars-finder.fixture
 */

jest.unmock('../../mango-finder.abstract')

export default class CarsFinder extends AbstractMangoFinder<
  ICar,
  CarUID,
  CarParams,
  CarQuery
> {}
