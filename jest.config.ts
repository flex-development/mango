import type { Config } from '@jest/types'
import baseConfig from './jest.config.base'
import pkg from './package.json'

/**
 * @file Jest Root Configuration
 * @see https://jestjs.io/docs/next/configuration
 */

const prefix = '<rootDir>/'

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: pkg.name.split('/')[1],
  roots: [`${prefix}__mocks__`, `${prefix}src`]
}

export default config
