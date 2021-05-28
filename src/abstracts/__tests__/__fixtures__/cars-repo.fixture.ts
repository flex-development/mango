import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { UID } from '@/types'
import type { OneOrMany, OrPromise } from '@flex-development/tutils'
import type {
  CarDTOFilter,
  CarParams,
  CarQuery,
  CarUID,
  ICar
} from '@tests/fixtures/cars.fixture'
import AbstractMangoRepository from '../../mango-repo.abstract'

/**
 * @file Test Fixture - CarsRepo
 * @module abstracts/tests/fixtures/cars-repo.fixture
 */

export default class CarsRepo extends AbstractMangoRepository<
  ICar,
  CarUID,
  CarParams,
  CarQuery
> {
  create(dto: CreateEntityDTO<ICar, CarDTOFilter>): OrPromise<ICar> {
    throw new Error('Method not implemented')
  }

  patch(
    uid: UID,
    dto: PatchEntityDTO<ICar, CarDTOFilter>,
    rfields?: string[]
  ): OrPromise<ICar> {
    throw new Error('Method not implemented')
  }

  save(dto: OneOrMany<EntityDTO<ICar, CarDTOFilter>>): OrPromise<ICar[]> {
    throw new Error('Method not implemented')
  }
}
