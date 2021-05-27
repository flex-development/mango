import { MangoRepository, MangoRepositoryAsync } from '@mango'
import { IsStrongPassword, IsUnixTimestamp } from '@mango/decorators'
import type { MangoRepoOptionsDTO } from '@mango/dtos'
import type { MangoParsedUrlQuery, MangoSearchParams } from '@mango/types'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString
} from 'class-validator'
import type { IPerson, PersonUID } from './people'

/**
 * @file Examples - Users Repository
 * @module docs/examples/users
 */

export interface IUser extends IPerson {
  created_at: number
  password: string
  phone?: string
  updated_at?: number
}

export type UserParams = MangoSearchParams<IUser>
export type UserQuery = MangoParsedUrlQuery<IUser>

export class User implements IUser {
  @IsUnixTimestamp()
  created_at: IUser['created_at']

  @IsEmail()
  email: IUser['email']

  @IsString()
  @IsNotEmpty()
  first_name: IUser['first_name']

  @IsString()
  @IsNotEmpty()
  last_name: IUser['last_name']

  @IsStrongPassword()
  password: IUser['password']

  @IsOptional()
  @IsPhoneNumber()
  phone?: IUser['phone']

  @IsOptional()
  @IsUnixTimestamp()
  updated_at: IUser['updated_at']
}

const options: MangoRepoOptionsDTO<IUser, PersonUID> = {
  cache: { collection: [] },
  mingo: { idKey: 'email' },
  parser: {
    fullTextFields: ['first_name', 'last_name']
  },
  validation: {
    enabled: true,
    transformer: {},
    validator: {}
  }
}

export const UsersRepo = new MangoRepository<IUser, PersonUID>(User, options)
export const UsersRepoA = new MangoRepositoryAsync<IUser, PersonUID>(
  User,
  options
)
