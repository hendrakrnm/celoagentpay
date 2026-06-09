import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-1 rounded-[6px] text-11 font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]",
        success:
          "bg-[var(--color-success-light)] text-[var(--color-success)]",
        warning:
          "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
        danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
        neutral:
          "bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={badgeVariants({ variant, className })}
      {...props}
    >
      {children}
    </div>
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
