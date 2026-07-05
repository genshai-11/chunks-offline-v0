import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { Button as PrimitiveButton, ButtonLink as PrimitiveButtonLink } from '../primitives'
import type { PrimitiveSize, PrimitiveVariant } from '../primitives'

type Variant = 'primary' | 'secondary'

const variantMap: Record<Variant, PrimitiveVariant> = {
  primary: 'primary',
  secondary: 'secondary',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
  size?: PrimitiveSize
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: Variant
  size?: PrimitiveSize
}

export function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return (
    <PrimitiveButton variant={variantMap[variant]} {...props}>
      {children}
    </PrimitiveButton>
  )
}

export function ButtonLink({ children, variant = 'primary', ...props }: ButtonLinkProps) {
  return (
    <PrimitiveButtonLink variant={variantMap[variant]} {...props}>
      {children}
    </PrimitiveButtonLink>
  )
}
