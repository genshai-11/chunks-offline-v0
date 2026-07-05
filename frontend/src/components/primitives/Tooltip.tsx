import { cloneElement, isValidElement, useId, useState } from 'react'
import type { FocusEventHandler, MouseEventHandler, ReactElement, ReactNode } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps, PrimitiveSize } from './types'

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipTriggerProps {
  'aria-describedby'?: string
  onBlur?: FocusEventHandler
  onFocus?: FocusEventHandler
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
}

interface TooltipProps extends CommonPrimitiveProps {
  children: ReactElement<TooltipTriggerProps>
  content: ReactNode
  placement?: Placement
  size?: PrimitiveSize
}

const placementClassNames: Record<Placement, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
}

const sizeClassNames: Record<PrimitiveSize, string> = {
  sm: 'max-w-48 px-2 py-1 text-xs',
  md: 'max-w-xs px-3 py-2 text-sm',
  lg: 'max-w-sm px-4 py-3 text-base',
}

export function Tooltip({ children, className, content, placement = 'top', size = 'md' }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()

  const trigger = isValidElement<TooltipTriggerProps>(children)
    ? cloneElement(children, {
        'aria-describedby': open ? tooltipId : children.props['aria-describedby'],
        onBlur: (event) => {
          setOpen(false)
          children.props.onBlur?.(event)
        },
        onFocus: (event) => {
          setOpen(true)
          children.props.onFocus?.(event)
        },
        onMouseEnter: (event) => {
          setOpen(true)
          children.props.onMouseEnter?.(event)
        },
        onMouseLeave: (event) => {
          setOpen(false)
          children.props.onMouseLeave?.(event)
        },
      })
    : children

  return (
    <span className={cn('relative inline-flex', className)}>
      {trigger}
      {open ? (
        <span
          className={cn('pointer-events-none absolute z-50 rounded-xl border border-chunks-hairline bg-chunks-dark text-white shadow-hard', placementClassNames[placement], sizeClassNames[size])}
          id={tooltipId}
          role="tooltip"
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}
