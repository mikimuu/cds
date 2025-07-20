import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: React.ElementType
}

const Display = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, as: Component = 'h1', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-display', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Display.displayName = 'Display'

const Heading1 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, as: Component = 'h1', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-h1', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading1.displayName = 'Heading1'

const Heading2 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, as: Component = 'h2', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-h2', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading2.displayName = 'Heading2'

const Heading3 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-h3', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading3.displayName = 'Heading3'

const Heading4 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, as: Component = 'h4', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-h4', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading4.displayName = 'Heading4'

const Heading5 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, as: Component = 'h5', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-h5', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading5.displayName = 'Heading5'

const Heading6 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, children, as: Component = 'h6', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-h6', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading6.displayName = 'Heading6'

const BodyXL = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, as: Component = 'p', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-body-xl', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

BodyXL.displayName = 'BodyXL'

const BodySmall = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, as: Component = 'p', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-body-sm', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

BodySmall.displayName = 'BodySmall'

const CaptionSmall = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, children, as: Component = 'span', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-caption-sm', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

CaptionSmall.displayName = 'CaptionSmall'

const Micro = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, children, as: Component = 'span', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-micro', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Micro.displayName = 'Micro'

const BodyLarge = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, as: Component = 'p', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-body-lg', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

BodyLarge.displayName = 'BodyLarge'

const Body = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, as: Component = 'p', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-body', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Body.displayName = 'Body'

const Caption = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, children, as: Component = 'span', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('typography-caption', className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Caption.displayName = 'Caption'

export { 
  Display, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5, 
  Heading6, 
  BodyXL,
  BodyLarge, 
  Body, 
  BodySmall,
  Caption,
  CaptionSmall,
  Micro
}