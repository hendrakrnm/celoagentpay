import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex h-6 items-center justify-center rounded-[var(--border-radius)] border-2 border-[var(--border-color)] px-2.5 text-[11px] font-bold uppercase tracking-[0.04em] shadow-[2px_2px_0_var(--border-color)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary)] text-[var(--color-surface)]",
        success: "bg-[var(--color-secondary)] text-[var(--color-surface)]",
        warning: "bg-[var(--color-accent)] text-[var(--border-color)]",
        danger: "bg-[var(--color-primary)] text-[var(--color-surface)]",
        neutral: "bg-[var(--color-surface)] text-[var(--border-color)]",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, children, ...props }, ref) => (
  <div ref={ref} className={badgeVariants({ variant, className })} {...props}>
    {children}
  </div>
));
Badge.displayName = "Badge";

export { Badge, badgeVariants };
