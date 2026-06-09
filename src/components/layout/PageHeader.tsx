"use client";

import React from "react";
import { Settings, History } from "lucide-react";

interface PageHeaderProps {
  title: string;
  showActions?: boolean;
  onSettingsClick?: () => void;
  onHistoryClick?: () => void;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  showActions = false,
  onSettingsClick,
  onHistoryClick,
  action,
}: PageHeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-30
        bg-[var(--color-surface)]
        border-b border-[var(--color-border)]
        h-14 px-4 flex items-center justify-between
      "
    >
      <h1 className="text-16 font-medium text-[var(--color-text-primary)]">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {action && action}

        {showActions && (
          <>
            {onHistoryClick && (
              <button
                onClick={onHistoryClick}
                className="
                  p-2 hover:bg-[var(--color-surface-raised)] rounded-lg
                  transition-colors duration-150
                  text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                "
                aria-label="History"
              >
                <History className="w-5 h-5" />
              </button>
            )}
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="
                  p-2 hover:bg-[var(--color-surface-raised)] rounded-lg
                  transition-colors duration-150
                  text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                "
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
