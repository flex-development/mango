import { Mango } from '@mango'
import type { MangoOptionsDTO } from '@mango/dto'
import type { MangoParsedUrlQuery, MangoSearchParams } from '@mango/types'

/**
 * @file Example - Subscribers Collection
 * @module docs/examples/subscribers
 */

export interface ISubscriber {
  email: string
  first_name: string
  last_name: string
}

export type SubscriberUID = 'email'
export type SubscriberParams = MangoSearchParams<ISubscriber>
export type SubscriberQuery = MangoParsedUrlQuery<ISubscriber>

const options: MangoOptionsDTO<ISubscriber, SubscriberUID> = {
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

export const SubscribersMango = new Mango<ISubscriber, SubscriberUID>(options)
