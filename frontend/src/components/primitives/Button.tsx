import { Button as AstryxButton } from '@astryxdesign/core/Button'
import { isValidElement, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps, PrimitiveSize, PrimitiveVariant } from './types'

type AstryxButtonCompatProps = Parameters<typeof AstryxButton>[0] & { title?: string }
const CompatAstryxButton = AstryxButton as (props: AstryxButtonCompatProps) => ReactNode

interface BaseButtonProps extends CommonPrimitiveProps {
  variant?: PrimitiveVariant
  size?: PrimitiveSize
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export interface ButtonProps extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  disabledReason?: ReactNode
}

export interface ButtonLinkProps extends BaseButtonProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  disabled?: boolean
  disabledReason?: ReactNode
}

export function Button({
  children,
  className,
  disabled,
  disabledReason,
  fullWidth,
  iconLeft,
  iconRight,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  const label = getAccessibleLabel(children, props['aria-label'])

  return (
    <CompatAstryxButton
      {...props}
      className={cn('theme-button', fullWidth && 'w-full', className)}
      endContent={!loading ? iconRight : undefined}
      icon={loading ? <Spinner /> : iconLeft}
      isDisabled={isDisabled}
      isLoading={loading}
      label={label}
      title={disabledReason ? String(disabledReason) : props.title}
      type={type}
      variant={variant}
      size={size}
    >
      {children}
    </CompatAstryxButton>
  )
}

export function ButtonLink({
  children,
  className,
  disabled,
  disabledReason,
  fullWidth,
  iconLeft,
  iconRight,
  loading = false,
  size = 'md',
  variant = 'primary',
  ...props
}: ButtonLinkProps) {
  const isDisabled = disabled || loading
  const label = getAccessibleLabel(children, props['aria-label'])

  return (
    <CompatAstryxButton
      className={cn('theme-button', fullWidth && 'w-full', isDisabled && 'pointer-events-none', className)}
      endContent={!loading ? iconRight : undefined}
      href={isDisabled ? undefined : props.href}
      icon={loading ? <Spinner /> : iconLeft}
      isDisabled={isDisabled}
      isLoading={loading}
      label={label}
      rel={props.rel}
      size={size}
      target={props.target}
      title={disabledReason ? String(disabledReason) : props.title}
      variant={variant}
    >
      {children}
    </CompatAstryxButton>
  )
}

function getAccessibleLabel(children: ReactNode, ariaLabel?: string): string {
  if (ariaLabel) return ariaLabel
  const text = getTextContent(children).trim()
  return text || 'Action'
}

function getTextContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextContent).join(' ')
  if (isValidElement<{ children?: ReactNode }>(node)) return getTextContent(node.props.children)
  return ''
}

function Spinner() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  )
}
