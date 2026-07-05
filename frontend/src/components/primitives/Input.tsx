import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps, FieldMessageProps, PrimitiveSize } from './types'

const sizeClassNames: Record<PrimitiveSize, string> = {
  sm: 'min-h-10 px-3 py-2 text-sm',
  md: 'min-h-11 px-4 py-3 text-sm',
  lg: 'min-h-12 px-4 py-3 text-base',
}

interface InputProps extends CommonPrimitiveProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FieldMessageProps {
  label?: ReactNode
  size?: PrimitiveSize
}

export function Input({
  className,
  disabled,
  disabledExplanation,
  errorText,
  helperText,
  id,
  label,
  size = 'md',
  type = 'text',
  ...props
}: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const helperId = helperText ? `${inputId}-help` : undefined
  const errorId = errorText ? `${inputId}-error` : undefined
  const disabledId = disabledExplanation ? `${inputId}-disabled` : undefined
  const describedBy = [helperId, errorId, disabledId].filter(Boolean).join(' ') || undefined

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label ? <span className="block text-sm font-semibold text-chunks-ink">{label}</span> : null}
      <input
        aria-describedby={describedBy}
        aria-invalid={errorText ? true : undefined}
        className={cn('w-full rounded-chunks-xl border border-chunks-hairline bg-white text-chunks-ink shadow-none transition placeholder:text-chunks-muted focus:border-chunks-red focus:outline-none focus:ring-2 focus:ring-chunks-red/10 disabled:cursor-not-allowed disabled:bg-chunks-soft disabled:text-chunks-muted', sizeClassNames[size], Boolean(errorText) && 'border-red-400 focus:border-red-500 focus:ring-red-500/10', className)}
        disabled={disabled}
        id={inputId}
        title={disabled && disabledExplanation ? String(disabledExplanation) : props.title}
        type={type}
        {...props}
      />
      {helperText ? <p className="text-sm leading-6 text-chunks-body" id={helperId}>{helperText}</p> : null}
      {errorText ? <p className="text-sm font-medium text-red-700" id={errorId}>{errorText}</p> : null}
      {disabled && disabledExplanation ? <p className="text-sm leading-6 text-chunks-body" id={disabledId}>{disabledExplanation}</p> : null}
    </label>
  )
}
