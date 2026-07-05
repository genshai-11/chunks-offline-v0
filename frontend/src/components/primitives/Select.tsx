import { useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps, FieldMessageProps, PrimitiveSize } from './types'

const sizeClassNames: Record<PrimitiveSize, string> = {
  sm: 'min-h-10 px-3 py-2 text-sm',
  md: 'min-h-11 px-4 py-3 text-sm',
  lg: 'min-h-12 px-4 py-3 text-base',
}

interface SelectProps extends CommonPrimitiveProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, FieldMessageProps {
  label?: ReactNode
  size?: PrimitiveSize
}

export function Select({
  children,
  className,
  disabled,
  disabledExplanation,
  errorText,
  helperText,
  id,
  label,
  multiple,
  size = 'md',
  ...props
}: SelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  const helperId = helperText ? `${selectId}-help` : undefined
  const errorId = errorText ? `${selectId}-error` : undefined
  const disabledId = disabledExplanation ? `${selectId}-disabled` : undefined
  const describedBy = [helperId, errorId, disabledId].filter(Boolean).join(' ') || undefined

  return (
    <label className="block space-y-2" htmlFor={selectId}>
      {label ? <span className="block text-sm font-semibold text-chunks-ink">{label}</span> : null}
      <select
        aria-describedby={describedBy}
        aria-invalid={errorText ? true : undefined}
        className={cn('w-full rounded-chunks-xl border border-chunks-hairline bg-white text-chunks-ink shadow-none transition focus:border-chunks-red focus:outline-none focus:ring-2 focus:ring-chunks-red/10 disabled:cursor-not-allowed disabled:bg-chunks-soft disabled:text-chunks-muted', sizeClassNames[size], multiple && 'min-h-24', Boolean(errorText) && 'border-red-400 focus:border-red-500 focus:ring-red-500/10', className)}
        disabled={disabled}
        id={selectId}
        multiple={multiple}
        size={multiple ? 4 : undefined}
        title={disabled && disabledExplanation ? String(disabledExplanation) : props.title}
        {...props}
      >
        {children}
      </select>
      {helperText ? <p className="text-sm leading-6 text-chunks-body" id={helperId}>{helperText}</p> : null}
      {errorText ? <p className="text-sm font-medium text-red-700" id={errorId}>{errorText}</p> : null}
      {disabled && disabledExplanation ? <p className="text-sm leading-6 text-chunks-body" id={disabledId}>{disabledExplanation}</p> : null}
    </label>
  )
}
