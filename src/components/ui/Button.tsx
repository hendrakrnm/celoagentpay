import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] font-semibold uppercase tracking-[0.02em] shadow-[var(--shadow-offset)] transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-[var(--shadow-active)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-secondary)] text-[var(--color-surface)]",
        ghost: "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
        outline: "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
        danger: "bg-[var(--color-primary)] text-[var(--color-surface)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-sm",
        xl: "h-14 px-8 text-base",
      },
      fullWidth: { true: "w-full" },
      iconOnly: { true: "p-0" },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", class: "h-8 w-8" },
      { iconOnly: true, size: "md", class: "h-10 w-10" },
      { iconOnly: true, size: "lg", class: "h-12 w-12" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, iconOnly, loading, children, disabled, ...props }, ref) => (
    <button
      className={buttonVariants({ variant, size, fullWidth, iconOnly, className })}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading ? <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : children}
    </button>
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
