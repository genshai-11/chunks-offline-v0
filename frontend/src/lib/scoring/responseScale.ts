import type { LearnerPerformanceY, ResponseColor } from '../domain/types'

export interface ResponseScaleOption {
  color: ResponseColor
  performance: LearnerPerformanceY
  icon: string
  accessibleLabel: string
  toneClass: string
}

export const RESPONSE_SCALE_OPTIONS: ResponseScaleOption[] = [
  {
    color: 'red',
    performance: 0,
    icon: '●',
    accessibleLabel: 'Red response',
    toneClass: 'bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-300',
  },
  {
    color: 'yellow',
    performance: 1,
    icon: '◆',
    accessibleLabel: 'Yellow response',
    toneClass: 'bg-yellow-400 text-chunks-ink hover:bg-yellow-500 focus-visible:ring-yellow-300',
  },
  {
    color: 'green',
    performance: 2,
    icon: '▲',
    accessibleLabel: 'Green response',
    toneClass: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-300',
  },
  {
    color: 'purple',
    performance: 3,
    icon: '✦',
    accessibleLabel: 'Purple response',
    toneClass: 'bg-purple-700 text-white hover:bg-purple-800 focus-visible:ring-purple-300',
  },
]

export const PERFORMANCE_BY_RESPONSE_COLOR: Record<ResponseColor, LearnerPerformanceY> = RESPONSE_SCALE_OPTIONS.reduce(
  (mapping, option) => {
    mapping[option.color] = option.performance
    return mapping
  },
  {} as Record<ResponseColor, LearnerPerformanceY>,
)
