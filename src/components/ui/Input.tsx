import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-12 font-medium text-[var(--color-text-secondary)] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full h-12 px-4 rounded-[10px]
            bg-[var(--color-surface-raised)]
            border border-[var(--color-border)]
            text-14 text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-tertiary)]
            transition-colors duration-150
            focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]" : ""}
            ${className || ""}
          `}
          {...props}
        />
        {error && (
          <p className="text-12 text-[var(--color-danger)] mt-1">{error}</p>
        )}
        {helpText && !error && (
          <p className="text-12 text-[var(--color-text-tertiary)] mt-1">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
