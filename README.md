# :mango: Mango

MongoDB query plugin and repository API for in-memory object collections

[![TypeScript](https://badgen.net/badge/-/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## Overview

[Getting Started](#getting-started)  
[Installation](#installation)  
[Usage](#usage)  
[Built With](#built-with)  
[Contributing](docs/CONTRIBUTING.md)

## Getting Started

MongoDB query plugin and repository API for in-memory object collections.

- run aggregation pipelines
- execute searches (with query criteria **and** URL queries)
- parse and convert URL query objects and strings
- perform CRUD operations on repositories
- validate collection objects

## Installation

1. Create or edit an `.npmrc` file with the following information:

   ```utf-8
   @flex-development:registry=https://npm.pkg.github.com/
   ```

2. Add project to `dependencies`

   ```zsh
   yarn add @flex-development/mango # or npm i @flex-development/mango
   ```

## Usage

[Configuration](#configuration)  
[Mango Finder](#mango-finder)  
[Mango Repository](#mango-repository)  
[Mango Validator](#mango-validator)

### Configuration

#### Environment Variables

- `DEBUG`: Toggle [debug][4] logs from the `mango` namespace
- `DEBUG_COLORS`: Toggle [debug][4] log namespace colors

#### Mingo

The `MangoFinder` and `MangoFinderAsync` plugins integrate with [mingo][5], a
MongoDB query language for in-memory objects, to support aggregation pipelines
and executing searches.

Operators loaded by Mango can be viewed in the [config](src/config/mingo.ts)
file. If additional operators are needed, load them _before_
[creating a new plugin](#creating-a-new-mango-plugin).

#### TypeScript

For shorter import paths, TypeScript users can add the following aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@mango": ["node_modules/@flex-development/mango/index"],
      "@mango/*": ["node_modules/@flex-development/mango/*"]
    }
  }
}
```

These aliases will be used in following code examples.

### Mango Finder

The Mango Finder plugins allow users to run aggregation pipelines and execute
searches against in-memory object collections. Query documents using a URL
query, or search for them using a query criteria and options object.

#### Plugin Documentation

- [`AbstractMangoFinder`](src/abstracts/mango-finder.abstract.ts)
- [`MangoFinderAsync`](src/plugins/mango-finder-async.plugin.ts)
- [`MangoFinder`](src/plugins/mango-finder.plugin.ts)

```typescript
/**
 * `AbstractMangoFinder` plugin interface.
 *
 * Used to define class contract of `MangoFinder`, `MangoFinderAsync`, and
 * possible derivatives.
 *
 * See:
 *
 * - https://github.com/kofrasa/mingo
 * - https://github.com/fox1t/qs-to-mongo
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @extends IAbstractMangoFinderBase
 */
export interface IAbstractMangoFinder<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> extends IAbstractMangoFinderBase<D, U> {
  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): OrPromise<AggregationPipelineResult<D>>
  find(params?: P): OrPromise<DocumentPartial<D, U>[]>
  findByIds(uids?: UID[], params?: P): OrPromise<DocumentPartial<D, U>[]>
  findOne(uid: UID, params?: P): OrPromise<DocumentPartial<D, U> | null>
  findOneOrFail(uid: UID, params?: P): OrPromise<DocumentPartial<D, U>>
  query(query?: Q | string): OrPromise<DocumentPartial<D, U>[]>
  queryByIds(
    uids?: UID[],
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U>[]>
  queryOne(
    uid: UID,
    query?: Q | string
  ): OrPromise<DocumentPartial<D, U> | null>
  queryOneOrFail(uid: UID, query?: Q | string): OrPromise<DocumentPartial<D, U>>
  setCache(collection?: D[]): OrPromise<MangoCacheFinder<D>>
  uid(): string
}

/**
 * Base `AbstractMangoFinder` plugin interface.
 *
 * Used to define properties of `MangoFinder`, `MangoFinderAsync`, and
 * possible derivatives.
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 */
export interface IAbstractMangoFinderBase<
  D extends ObjectPlain = ObjectUnknown,
  U extends string = DUID
> {
  readonly cache: Readonly<MangoCacheFinder<D>>
  readonly logger: Debugger
  readonly mingo: typeof mingo
  readonly mparser: IMangoParser<D>
  readonly options: MangoFinderOptions<D, U>
}
```

#### Documents

A document is an object from an in-memory collection. Each document should have
a unique identifier (uid).

By default, this value is assumed to map to the `id` field of each document, but
can be changed via the [plugin settings](#plugin-settings).

```typescript
import type { MangoParsedUrlQuery, MangoSearchParams } from '@mango/types'

export interface IPerson {
  email: string
  first_name: string
  last_name: string
}

export type PersonUID = 'email'
export type PersonParams = MangoSearchParams<IPerson>
export type PersonQuery = MangoParsedUrlQuery<IPerson>
```

#### Creating a New Finder

Both the `MangoFinder` and `MangoFinderAsync` plugins accept an `options` object
thats gets passed down to the [mingo][5] and [qs-to-mongo][6] modules.

Via the options dto, you can:

- set initial collection cache
- set uid field for each document
- set date fields and fields searchable by text

```typescript
import { MangoFinder, MangoFinderAsync } from '@mango'
import type { MangoFinderOptionsDTO } from '@mango/dto'

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
export const PeopleFinderA = new MangoFinderAsync<IPerson, PersonUID>(options)
```

**Note**: All properties are optional.

To learn more about [qs-to-mongo][6] options, see [Options][8] from the package
documentation. Note that the `objectIdFields` and `parameters` options are not
accepted by the [`MangoParser`](src/mixins/mango-parser.mixin.ts).

### Mango Repository

The Mango Repositories extend the [Mango Finder](#mango-finder) plugins and
allow users to perform write operations on an object collection.

#### Repository Documentation

- [`AbstractMangoRepository`](src/abstracts/mango-repo.abstract.ts)
- [`MangoRepositoryAsync`](src/repositories/mango-async.repository.ts)
- [`MangoRepository`](src/repositories/mango.repository.ts)

```typescript
/**
 * `AbstractMangoRepository` class interface.
 *
 * Used to define class contract of `MangoRepository`, `MangoRepositoryAsync`,
 * and possible derivatives.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 * @template P - Repository search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 *
 * @extends IAbstractMangoFinder
 * @extends IAbstractMangoRepositoryBase
 */
export interface IAbstractMangoRepository<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID,
  P extends MangoSearchParams<E> = MangoSearchParams<E>,
  Q extends MangoParsedUrlQuery<E> = MangoParsedUrlQuery<E>
> extends Omit<IAbstractMangoFinder<E, U, P, Q>, 'cache' | 'options'>,
    IAbstractMangoRepositoryBase<E, U> {
  clear(): OrPromise<boolean>
  create(dto: CreateEntityDTO<E>): OrPromise<E>
  delete(uid?: OneOrMany<UID>, should_exist?: boolean): OrPromise<UID[]>
  patch(uid: UID, dto?: PatchEntityDTO<E>, rfields?: string[]): OrPromise<E>
  setCache(collection?: E[]): OrPromise<MangoCacheRepo<E>>
  save(dto?: OneOrMany<EntityDTO<E>>): OrPromise<E[]>
}

/**
 * Base `AbstractMangoRepository` class interface.
 *
 * Used to define properties of `MangoRepository`, `MangoRepositoryAsync`,
 * and possible derivatives.
 *
 * @template E - Entity
 * @template U - Name of entity uid field
 *
 * @extends IAbstractMangoFinderBase
 */
export interface IAbstractMangoRepositoryBase<
  E extends ObjectPlain = ObjectUnknown,
  U extends string = DUID
> extends IAbstractMangoFinderBase<E, U> {
  readonly cache: MangoCacheRepo<E>
  readonly options: MangoRepoOptions<E, U>
  readonly validator: IMangoValidator<E>
}
```

#### Modeling Entities

Before creating a new repository, a model needs to be created.

For the next set of examples, the model `User` will be used.

```typescript
import { IsStrongPassword, IsUnixTimestamp } from '@mango/decorators'
import type { MangoParsedUrlQuery, MangoSearchParams } from '@mango/types'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString
} from 'class-validator'
import type { IPerson, PersonUID } from './people'

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
```

For more information about validation decorators, see the [class-validator][3]
package.

Mango also exposes a set of [custom decorators](src/decorators/index.ts).

#### Creating a New Repository

The `MangoRepository` class accepts an `options` object that gets passed down to
the [`MangoFinder`](#mango-finder) and [`MangoValidator`](#mango-validator).

```typescript
import { MangoRepository, MangoRepositoryAsync } from '@mango'
import type { MangoRepoOptionsDTO } from '@mango/dtos'

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
```

See [Mango Validator](#mango-validator) for more information about `validation`
options.

### Mango Validator

The `MangoValidator` mixin allows for **decorator-based** model validation.

Under the hood, it uses [class-transformer-validator][1].

#### Validator Documentation

- [`MangoValidator`](src/mixins/mango-validator.mixin.ts)

```typescript
/**
 * `MangoValidator` mixin interface.
 *
 * @template E - Entity
 */
export interface IMangoValidator<E extends ObjectPlain = ObjectUnknown> {
  readonly enabled: boolean
  readonly model: ClassType<E>
  readonly model_name: string
  readonly tvo: Omit<MangoValidatorOptions, 'enabled'>
  readonly validator: typeof transformAndValidate
  readonly validatorSync: typeof transformAndValidateSync

  check<V extends unknown = ObjectPlain>(value?: V): Promise<E | V>
  checkSync<V extends unknown = ObjectPlain>(value?: V): E | V
  handleError(error: Error | ValidationError[]): Exception
}
```

Each [repository](#mango-repository) has it owns validator, but the validator
can be used standalone as well.

```typescript
import { MangoValidator } from '@mango'
import type { MangoValidatorOptions } from '@mango/types'

const options: MangoValidatorOptions = {
  transformer: {},
  validator: {}
}

export const UsersValidator = new MangoValidator<IUser>(User, options)
```

Validation options will be merged with the following object:

```typescript
import type { TVODefaults } from '@mango/types'

/**
 * @property {TVODefaults} TVO_DEFAULTS - `class-transformer-validator` options
 * @see https://github.com/MichalLytek/class-transformer-validator
 */
export const TVO_DEFAULTS: TVODefaults = Object.freeze({
  transformer: {},
  validator: {
    enableDebugMessages: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: false,
    validationError: { target: false, value: true },
    whitelist: true
  }
})
```

## Built With

- [class-transformer-validator][1] - Plugin for [class-transformer][2] and
  [class-validator][3]
- [debug][4] - Debugging utility
- [mingo][5] - MongoDB query language for in-memory objects
- [qs-to-mongo][6] - Parse and convert URL queries into MongoDB query criteria
  and options
- [uuid][7] - Generate RFC-compliant UUIDs

[1]: https://github.com/MichalLytek/class-transformer-validator
[2]: https://github.com/typestack/class-transformer
[3]: https://github.com/typestack/class-validator
[4]: https://github.com/visionmedia/debug
[5]: https://github.com/kofrasa/mingo
[6]: https://github.com/fox1t/qs-to-mongo
[7]: https://github.com/uuidjs/uuid
[8]: https://github.com/fox1t/qs-to-mongo#options
