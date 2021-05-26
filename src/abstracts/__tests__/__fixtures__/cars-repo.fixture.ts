import type { CreateEntityDTO, EntityDTO, PatchEntityDTO } from '@/dtos'
import type { UID } from '@/types'
import type { OneOrMany, OrPromise, Path } from '@flex-development/tutils'
import type {
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
  create<F extends Path<ICar>>(dto: CreateEntityDTO<ICar, F>): OrPromise<ICar> {
    throw new Error('Method not implemented')
  }

  patch<F extends Path<ICar>>(
    uid: UID,
    dto: PatchEntityDTO<ICar, F>,
    rfields?: string[]
  ): OrPromise<ICar> {
    throw new Error('Method not implemented')
  }

  save<F extends Path<ICar>>(
    dto: OneOrMany<EntityDTO<ICar, F>>
  ): OrPromise<ICar[]> {
    throw new Error('Method not implemented')
  }
}
