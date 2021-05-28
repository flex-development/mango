import type { MangoFinderOptionsDTO } from '@/dtos'
import type { MangoCacheFinder } from '@/interfaces'
import type {
  DTOFilter,
  MangoParsedUrlQuery,
  MangoSearchParams,
  UID
} from '@/types'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

/**
 * @file Global Test Fixture - Cars Collection
 * @module tests/fixtures/cars
 */

export interface ICar {
  make: string
  model: string
  model_year: number
  vin: UID
}

export type CarUID = 'vin'
export type CarParams = MangoSearchParams<ICar>
export type CarQuery = MangoParsedUrlQuery<ICar>

export type CarDTOFilter = DTOFilter<ICar, 'make' | 'model' | 'model_year'>

export class Car implements ICar {
  @IsString()
  @IsNotEmpty()
  make: ICar['make']

  @IsString()
  @IsNotEmpty()
  model: ICar['model']

  @IsNumber()
  model_year: ICar['model_year']

  @IsString()
  @IsNotEmpty()
  vin: ICar['vin']
}

export const CARS_UID: CarUID = 'vin'

export const CARS_ROOT = {
  '5b38c222-bf0c-4972-9810-d8cd7e399a56': {
    make: 'Mitsubishi',
    model: '3000GT',
    model_year: 1999,
    vin: '5b38c222-bf0c-4972-9810-d8cd7e399a56'
  },
  '6e177f82-055d-464d-b118-cf36b10fb77d': {
    make: 'Nissan',
    model: 'Quest',
    model_year: 1994,
    vin: '6e177f82-055d-464d-b118-cf36b10fb77d'
  },
  '3221085d-6f55-4d23-842a-aeb0e413fca8': {
    make: 'Scion',
    model: 'tC',
    model_year: 2010,
    vin: '3221085d-6f55-4d23-842a-aeb0e413fca8'
  },
  'e3df6457-3901-4c25-90cd-6aaabf3cdcb8': {
    make: 'Chevrolet',
    model: 'Aveo',
    model_year: 2006,
    vin: 'e3df6457-3901-4c25-90cd-6aaabf3cdcb8'
  },
  'eda31c5a-7b59-4250-b365-e66661930bc8': {
    make: 'Subaru',
    model: 'Impreza',
    model_year: 1994,
    vin: 'eda31c5a-7b59-4250-b365-e66661930bc8'
  }
}

export const CARS_MOCK_CACHE_EMPTY: MangoCacheFinder<ICar> = {
  collection: Object.freeze([])
}

export const CARS_MOCK_CACHE: MangoCacheFinder<ICar> = {
  collection: Object.freeze(Object.values(CARS_ROOT))
}

export const CARS_MANGO_OPTIONS: MangoFinderOptionsDTO<ICar, CarUID> = {
  cache: CARS_MOCK_CACHE as MangoFinderOptionsDTO<ICar>['cache'],
  mingo: { idKey: CARS_UID }
}
