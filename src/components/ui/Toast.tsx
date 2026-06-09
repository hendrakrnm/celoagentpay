"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    borderColor: "border-[var(--color-success)]",
    bgColor: "bg-[var(--color-success-light)]",
    textColor: "text-[var(--color-text-primary)]",
  },
  error: {
    icon: AlertCircle,
    borderColor: "border-[var(--color-danger)]",
    bgColor: "bg-[var(--color-danger-light)]",
    textColor: "text-[var(--color-text-primary)]",
  },
  info: {
    icon: Info,
    borderColor: "border-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-light)]",
    textColor: "text-[var(--color-text-primary)]",
  },
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { variant, title, description, duration = 3000, onClose, ...props },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);
    const config = toastConfig[variant];
    const Icon = config.icon;

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={`
          flex items-start gap-3 px-4 py-3 rounded-[10px]
          border-l-3 ${config.borderColor}
          ${config.bgColor} ${config.textColor}
          shadow-[var(--shadow-md)]
          animate-slide-up
          max-w-[340px] w-[90vw] md:w-auto
        `}
        {...props}
      >
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-14 font-medium">{title}</p>
          {description && (
            <p className="text-12 text-[var(--color-text-secondary)] mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          aria-label="Close toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
