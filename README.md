# :mango: Mango

MongoDB-like API for in-memory object collections

[![TypeScript](https://badgen.net/badge/-/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## Overview

[Getting Started](#getting-started)  
[Installation](#installation)  
[Usage](#usage)  
[Built With](#built-with)  
[Contributing](docs/CONTRIBUTING.md)

## Getting Started

Mango is a MongoDB-like API for in-memory object collections. It combines the
power of [mingo][1] and [qs-to-mongo][2] to allow:

- running aggregation pipelines
- performing searches (with query criteria **and** URL queries)
- parsing and converting URL query objects and strings

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
[Creating a New Mango Plugin](#creating-a-new-mango-plugin)  
[Mango Plugin API](#mango-plugin-api)

### Configuration

#### Environment Variables

- `DEBUG`: Toggle [debug][3] logs from the `mango` namespace
- `DEBUG_COLORS`: Toggle [debug][3] log namespace colors

#### Mingo

The `Mango` class integrates with [mingo][1], a MongoDB query language for
in-memory objects, to support aggregation pipelines and executing searches.

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

### Creating a New Mango Plugin

#### Documents

A document is an object from an in-memory collection. Each document should have
a unique identifier (uid).

By default, this value is assumed to map to the `id` field of each document.
This can be changed via the [plugin settings](#plugin-settings).

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

#### Plugin

The Mango plugin accepts an options object thats gets passed down to the
[mingo][1] and [qs-to-mongo][2] modules.

Via the options dto, you can:

- set initial collection cache
- set uid field for each document
- set date fields and fields searchable by text

```typescript
import { MangoPlugin } from '@mango'
import type { MangoPluginOptionsDTO } from '@mango/dto'

const options: MangoPluginOptionsDTO<IPerson, PersonUID> = {
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

export const PeopleMango = new MangoPlugin<IPerson, PersonUID>(options)
```

**Note**: All properties are optional.

To learn more about [qs-to-mongo][3] options, see [Options][4] from the package
documentation. Note that the `objectIdFields` and `parameters` options are not
accepted by the Mango parser.

### Mango Plugin API

The Mango plugin allows users to run aggregation pipelines and execute searches
against in-memory object collections. Query documents using a URL query, or
search for them using a query criteria and options object.

Documentation can be viewed [here](src/plugins/mango.plugin.ts).

```typescript
/**
 * `MangoPlugin` interface.
 *
 * - https://github.com/kofrasa/mingo
 * - https://github.com/fox1t/qs-to-mongo
 *
 * @template D - Document (collection object)
 * @template U - Name of document uid field
 * @template P - Search parameters (query criteria and options)
 * @template Q - Parsed URL query object
 */
export interface IMangoPlugin<
  D extends PlainObject = PlainObject,
  U extends string = DUID,
  P extends MangoSearchParams<D> = MangoSearchParams<D>,
  Q extends MangoParsedUrlQuery<D> = MangoParsedUrlQuery<D>
> {
  readonly cache: Readonly<MangoCachePlugin<D>>
  readonly logger: Debugger
  readonly mingo: typeof mingo
  readonly mparser: IMangoParser<D>
  readonly options: MangoPluginOptions<D, U>

  aggregate(
    pipeline?: OneOrMany<AggregationStages<D>>
  ): AggregationPipelineResult<D>
  find(params?: P): DocumentPartial<D, U>[]
  findByIds(uids?: UID[], params?: P): DocumentPartial<D, U>[]
  findOne(uid: UID, params?: P): DocumentPartial<D, U> | null
  findOneOrFail(uid: UID, params?: P): DocumentPartial<D, U>
  query(query?: Q | string): DocumentPartial<D, U>[]
  queryByIds(uids?: UID[], query?: Q | string): DocumentPartial<D, U>[]
  queryOne(uid: UID, query?: Q | string): DocumentPartial<D, U> | null
  queryOneOrFail(uid: UID, query?: Q | string): DocumentPartial<D, U>
  resetCache(collection?: D[]): MangoCachePlugin<D>
}
```

## Built With

- [debug][3] - Debugging utility
- [mingo][1] - MongoDB query language for in-memory objects
- [qs-to-mongo][2] - Parse and convert URL queries into MongoDB query criteria
  and options

[1]: https://github.com/kofrasa/mingo
[2]: https://github.com/fox1t/qs-to-mongo
[3]: https://github.com/visionmedia/debug
[4]: https://github.com/fox1t/qs-to-mongo#options
