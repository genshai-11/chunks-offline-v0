import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

const variantClassName: Record<Variant, string> = {
  primary: 'bg-chunks-red text-white hover:bg-chunks-red-active',
  secondary: 'bg-chunks-control text-chunks-ink hover:bg-chunks-hairline',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: Variant
}

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`theme-button inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:bg-chunks-red-disabled ${variantClassName[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({ children, className = '', variant = 'primary', ...props }: ButtonLinkProps) {
  return (
    <a
      className={`theme-button inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 font-semibold transition ${variantClassName[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
