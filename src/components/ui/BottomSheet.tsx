"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ isOpen, onClose, title, children, footer }, ref) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Sheet */}
        <div
          ref={ref}
          className="
            fixed bottom-0 left-0 right-0 z-50
            bg-[var(--color-surface)]
            rounded-t-[20px]
            animate-slide-up
            max-h-[90vh] overflow-y-auto
            flex flex-col
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-4">
            <div className="w-9 h-1 bg-[var(--color-border-strong)] rounded-full" />
          </div>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 pb-4 border-b border-[var(--color-border)]">
              <h2 className="text-16 font-medium text-[var(--color-text-primary)]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[var(--color-surface-raised)] rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-[var(--color-border)]">
              {footer}
            </div>
          )}

          {/* Safe area spacer for mobile */}
          <div className="h-safe" />
        </div>
      </>
    );
  }
);
BottomSheet.displayName = "BottomSheet";

export { BottomSheet };
