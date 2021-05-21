import merge from 'lodash.merge'
import mingo from 'mingo'
import type { OperatorMap } from 'mingo/core'
import { OperatorType, useOperators } from 'mingo/core'
import * as AccumulatorOperators from 'mingo/operators/accumulator'
import * as ArithmeticOperators from 'mingo/operators/expression/arithmetic'
import * as ArrayOperators from 'mingo/operators/expression/array'
import * as BooleanOperators from 'mingo/operators/expression/boolean'
import * as ComparisonOperators from 'mingo/operators/expression/comparison'
import * as ConditionalOperators from 'mingo/operators/expression/conditional'
import { $dateFromString } from 'mingo/operators/expression/date/dateFromString'
import { $dateToString } from 'mingo/operators/expression/date/dateToString'
import * as LiteralOperators from 'mingo/operators/expression/literal'
import * as ObjectOperators from 'mingo/operators/expression/object'
import * as SetOperators from 'mingo/operators/expression/set'
import { $concat } from 'mingo/operators/expression/string/concat'
import { $split } from 'mingo/operators/expression/string/split'
import { $strcasecmp } from 'mingo/operators/expression/string/strcasecmp'
import { $strLenCP } from 'mingo/operators/expression/string/strLenCP'
import { $toLower } from 'mingo/operators/expression/string/toLower'
import { $toUpper } from 'mingo/operators/expression/string/toUpper'
import { $trim } from 'mingo/operators/expression/string/trim'
import { $convert } from 'mingo/operators/expression/type'
import * as VariableOperators from 'mingo/operators/expression/variable'
import { $addFields } from 'mingo/operators/pipeline/addFields'
import { $bucket } from 'mingo/operators/pipeline/bucket'
import { $bucketAuto } from 'mingo/operators/pipeline/bucketAuto'
import { $count } from 'mingo/operators/pipeline/count'
import { $facet } from 'mingo/operators/pipeline/facet'
import { $group } from 'mingo/operators/pipeline/group'
import { $limit } from 'mingo/operators/pipeline/limit'
import { $match } from 'mingo/operators/pipeline/match'
import { $project } from 'mingo/operators/pipeline/project'
import { $redact } from 'mingo/operators/pipeline/redact'
import { $replaceRoot } from 'mingo/operators/pipeline/replaceRoot'
import { $replaceWith } from 'mingo/operators/pipeline/replaceWith'
import { $sample } from 'mingo/operators/pipeline/sample'
import { $skip } from 'mingo/operators/pipeline/skip'
import { $sort } from 'mingo/operators/pipeline/sort'
import { $sortByCount } from 'mingo/operators/pipeline/sortByCount'
import { $unset } from 'mingo/operators/pipeline/unset'
import { $unwind } from 'mingo/operators/pipeline/unwind'
import * as ProjectionOperators from 'mingo/operators/projection'
import * as QueryOperators from 'mingo/operators/query'

/**
 * @file Config - Mingo
 * @module config/mingo
 * @see https://github.com/kofrasa/mingo#configuration
 */

const DateOperators = { $dateFromString, $dateToString }
const StringOperators = {
  $concat,
  $split,
  $strLenCP,
  $strcasecmp,
  $toLower,
  $toUpper,
  $trim
}
const TypeOperators = { $convert }

const ExpressionOperators = merge(
  {},
  ArithmeticOperators,
  ArrayOperators,
  BooleanOperators,
  ComparisonOperators,
  ConditionalOperators,
  DateOperators,
  LiteralOperators,
  ObjectOperators,
  SetOperators,
  StringOperators,
  TypeOperators,
  VariableOperators
)

const PipelineOperators = {
  $addFields,
  $bucket,
  $bucketAuto,
  $count,
  $facet,
  $group,
  $limit,
  $match,
  $project,
  $redact,
  $replaceRoot,
  $replaceWith,
  $sample,
  $skip,
  $sort,
  $sortByCount,
  $unset,
  $unwind
}

/**
 * Enables operators the {@module mango} uses.
 * If other operators are needed, they must be enabled by the user.
 *
 * @return {void}
 */
const enableOperators = (): void => {
  useOperators(OperatorType.ACCUMULATOR, AccumulatorOperators as OperatorMap)
  useOperators(OperatorType.EXPRESSION, ExpressionOperators as OperatorMap)
  useOperators(OperatorType.PIPELINE, PipelineOperators as OperatorMap)
  useOperators(OperatorType.PROJECTION, ProjectionOperators as OperatorMap)
  useOperators(OperatorType.QUERY, QueryOperators as OperatorMap)
}

// Enable mango operators
enableOperators()

export default mingo
