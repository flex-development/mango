import type { MangoFinderOptionsDTO } from '@/dtos'
import { MangoFinder } from '@mango'
import type { MangoParsedUrlQuery, MangoSearchParams } from '@mango/types'

/**
 * @file Example - People Finder
 * @module docs/examples/people
 */

export interface IPerson {
  email: string
  first_name: string
  last_name: string
}

export type PersonUID = 'email'
export type PersonParams = MangoSearchParams<IPerson>
export type PersonQuery = MangoParsedUrlQuery<IPerson>

const options: MangoFinderOptionsDTO<IPerson, PersonUID> = {
  cache: {
    collection: [
      {
        email: 'nmaxstead0@arizona.edu',
        first_name: 'Nate',
        last_name: 'Maxstead'
      },
      {
        email: 'rbrisseau1@sohu.com',
        first_name: 'Roland',
        last_name: 'Brisseau'
      },
      {
        email: 'ksmidmoor2@sphinn.com',
        first_name: 'Kippar',
        last_name: 'Smidmoor'
      },
      {
        email: 'gdurnford3@360.cn',
        first_name: 'Godfree',
        last_name: 'Durnford'
      },
      {
        email: 'mfauguel4@webnode.com',
        first_name: 'Madelle',
        last_name: 'Fauguel'
      }
    ]
  },
  mingo: { idKey: 'email' },
  parser: {
    fullTextFields: ['first_name', 'last_name']
  }
}

export const PeopleFinder = new MangoFinder<IPerson, PersonUID>(options)
