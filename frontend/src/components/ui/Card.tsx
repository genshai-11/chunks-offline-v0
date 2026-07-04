import type { ElementType, HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
  className?: string
  variant?: 'light' | 'dark'
}

export function Card({ as: Component = 'div', children, className = '', variant = 'light', ...props }: CardProps) {
  const variantClassName =
    variant === 'dark'
      ? 'theme-card theme-card-dark bg-chunks-dark p-6 text-white shadow-soft rounded-[2rem]'
      : 'theme-card rounded-3xl border border-chunks-hairline bg-white p-6 shadow-soft'

  return <Component className={`${variantClassName} ${className}`} {...props}>{children}</Component>
}
