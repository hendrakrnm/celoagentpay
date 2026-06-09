import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-150 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-[0.98]",
        ghost:
          "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] active:scale-[0.98]",
        outline:
          "bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-raised)] active:scale-[0.98]",
        danger:
          "bg-[var(--color-danger)] text-white hover:opacity-90 active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-12",
        md: "h-10 px-4 text-14",
        lg: "h-12 px-6 text-16",
        xl: "h-14 px-8 text-16",
      },
      fullWidth: {
        true: "w-full",
      },
      iconOnly: {
        true: "p-0",
      },
    },
    compoundVariants: [
      {
        iconOnly: true,
        size: "sm",
        class: "w-8 h-8",
      },
      {
        iconOnly: true,
        size: "md",
        class: "w-10 h-10",
      },
      {
        iconOnly: true,
        size: "lg",
        class: "w-12 h-12",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      iconOnly,
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({
          variant,
          size,
          fullWidth,
          iconOnly,
          className,
        })}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <svg
            className="w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
