import type { LearnerPerformanceY, ResponseColor, ScoringMode } from '../domain/types'

export const SIMPLE_FORMULA_VERSION = 'simple-v1' as const

export const DEFAULT_PERFORMANCE_BY_COLOR: Record<ResponseColor, LearnerPerformanceY> = {
  red: 0,
  yellow: 1,
  green: 2,
}

export interface SimpleScoreInput {
  responseColor: ResponseColor
  cciStandardX: number
  cvrValue: number
  reflectionTimeMs: number
}

export interface SimpleScoreSnapshot {
  responseColor: ResponseColor
  learnerPerformanceY: LearnerPerformanceY
  cciStandardX: number
  cvrValue: number
  cciResult: number
  cpdResult: number
  reflectionTimeMs: number
  reflectionSeconds: number
  scoringModeSnapshot: ScoringMode
  formulaVersionSnapshot: typeof SIMPLE_FORMULA_VERSION
}

export function getLearnerPerformanceY(responseColor: ResponseColor): LearnerPerformanceY {
  return DEFAULT_PERFORMANCE_BY_COLOR[responseColor]
}

export function toReflectionSeconds(reflectionTimeMs: number): number {
  return roundTo(Math.max(0, reflectionTimeMs) / 1000, 3)
}

export function calculateSimpleScore(input: SimpleScoreInput): SimpleScoreSnapshot {
  const learnerPerformanceY = getLearnerPerformanceY(input.responseColor)
  const rawCciResult = input.cciStandardX * learnerPerformanceY
  const cciResult = roundTo(rawCciResult, 4)
  const cpdResult = roundTo(rawCciResult * input.cvrValue, 4)

  return {
    responseColor: input.responseColor,
    learnerPerformanceY,
    cciStandardX: input.cciStandardX,
    cvrValue: input.cvrValue,
    cciResult,
    cpdResult,
    reflectionTimeMs: Math.max(0, input.reflectionTimeMs),
    reflectionSeconds: toReflectionSeconds(input.reflectionTimeMs),
    scoringModeSnapshot: 'simple',
    formulaVersionSnapshot: SIMPLE_FORMULA_VERSION,
  }
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}
