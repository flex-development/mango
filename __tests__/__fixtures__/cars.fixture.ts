import type { MangoCachePlugin } from '@/interfaces'
import type { MangoParsedUrlQuery, MangoSearchParams } from '@/types'

/**
 * @file Global Test Fixture - Cars Collection
 * @module tests/fixtures/cars
 */

export interface ICar {
  make: string
  model: string
  model_year: number
  vin: string
}

export type CarUID = 'vin'
export type CarParams = MangoSearchParams<ICar>
export type CarQuery = MangoParsedUrlQuery<ICar>

export const CARS_IDKEY: CarUID = 'vin'

export const CARS_MOCK_CACHE_EMPTY: MangoCachePlugin<ICar> = {
  collection: Object.freeze([])
}

export const CARS_MOCK_CACHE: MangoCachePlugin<ICar> = {
  collection: Object.freeze([
    {
      make: 'Scion',
      model: 'tC',
      model_year: 2010,
      vin: '3221085d-6f55-4d23-842a-aeb0e413fca8'
    },
    {
      make: 'Mitsubishi',
      model: '3000GT',
      model_year: 1999,
      vin: '5b38c222-bf0c-4972-9810-d8cd7e399a56'
    },
    {
      make: 'Nissan',
      model: 'Quest',
      model_year: 1994,
      vin: '6e177f82-055d-464d-b118-cf36b10fb77d'
    },
    {
      make: 'Chevrolet',
      model: 'Aveo',
      model_year: 2006,
      vin: 'e3df6457-3901-4c25-90cd-6aaabf3cdcb8'
    },
    {
      make: 'Subaru',
      model: 'Impreza',
      model_year: 1994,
      vin: 'eda31c5a-7b59-4250-b365-e66661930bc8'
    }
  ])
}
