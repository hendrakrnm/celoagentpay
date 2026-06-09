import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle" | "avatar";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", ...props }, ref) => {
    const variantClasses = {
      text: "h-4 rounded-md w-full",
      card: "h-32 rounded-[14px] w-full",
      circle: "h-10 w-10 rounded-full",
      avatar: "h-12 w-12 rounded-full",
    };

    return (
      <div
        ref={ref}
        className={`
          ${variantClasses[variant]}
          bg-[var(--color-surface-raised)]
          relative overflow-hidden
          ${className || ""}
        `}
        style={{
          background: `linear-gradient(
            90deg,
            var(--color-surface-raised) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            var(--color-surface-raised) 40%
          )`,
          backgroundSize: "1000px 100%",
          animation: "shimmer 2s infinite",
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
