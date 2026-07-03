import { describe, expect, it } from 'vitest'

import {
  calculateSimpleScore,
  getLearnerPerformanceY,
  toReflectionSeconds,
} from '../../src/lib/scoring/simpleScoring'

describe('simple scoring', () => {
  it.each([
    ['red', 0],
    ['yellow', 1],
    ['green', 2],
  ] as const)('maps %s response to learner performance %i', (color, expected) => {
    expect(getLearnerPerformanceY(color)).toBe(expected)
  })

  it('calculates CCI and CPD from CCI standard, learner performance, and CVR', () => {
    expect(
      calculateSimpleScore({
        responseColor: 'green',
        cciStandardX: 1.25,
        cvrValue: 12,
        reflectionTimeMs: 4800,
      }),
    ).toEqual({
      responseColor: 'green',
      learnerPerformanceY: 2,
      cciStandardX: 1.25,
      cvrValue: 12,
      cciResult: 2.5,
      cpdResult: 30,
      reflectionTimeMs: 4800,
      reflectionSeconds: 4.8,
      scoringModeSnapshot: 'simple',
      formulaVersionSnapshot: 'simple-v1',
    })
  })

  it('rounds reflection seconds and scoring results to stable decimals', () => {
    const score = calculateSimpleScore({
      responseColor: 'yellow',
      cciStandardX: 0.333333,
      cvrValue: 3,
      reflectionTimeMs: 1234,
    })

    expect(score.cciResult).toBe(0.3333)
    expect(score.cpdResult).toBe(1)
    expect(score.reflectionSeconds).toBe(1.234)
  })

  it('protects reflection seconds from negative values', () => {
    expect(toReflectionSeconds(-100)).toBe(0)
  })
})
