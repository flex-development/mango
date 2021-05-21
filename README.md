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
- executing searches with query criteria and options
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
[🚧 Creating a New Mango Query Client](#🚧-creating-a-new-mango-query-client)  
[🚧 Mango API](#🚧-mango-api)

### Configuration

#### Environment Variables

- `DEBUG`: Toggle [debug][3] logs from the `mango` namespace
- `DEBUG_COLORS`: Toggle [debug][3] log namespace colors

#### Mingo

The `Mango` class integrates with [mingo][1], a MongoDB query language for
in-memory objects, to support aggregation pipelines and querying.

Operators loaded by Mango can be viewed in the [config](src/config/mingo.ts)
file. If additional operators are needed, you'll need to load them _before_
[creating a new query client](#🚧-creating-a-new-mango-query-client).

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

### 🚧 Creating a New Mango Query Client

**TODO:** Update documentation.

### 🚧 Mango API

**TODO:** Update documentation.

## Built With

- [debug][3] - Debugging utility
- [mingo][1] - MongoDB query language for in-memory objects
- [qs-to-mongo][2] - Parse and convert query parameters into MongoDB query
  criteria and options

[1]: https://github.com/kofrasa/mingo
[2]: https://github.com/fox1t/qs-to-mongo
[3]: https://github.com/visionmedia/debug
