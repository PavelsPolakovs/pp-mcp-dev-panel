import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { button, type ButtonVariants } from './Button.tv'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { intent, size, fullWidth, className, type = 'button', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={button({ intent, size, fullWidth, className })}
      {...rest}
    />
  )
})

export default Button
