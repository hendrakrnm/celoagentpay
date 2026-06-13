"use client";

import { useState } from "react";
import { Send, Mic } from "lucide-react";

interface CommandInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function CommandInput({
  onSubmit,
  isLoading = false,
  placeholder = "Send a payment command...",
}: CommandInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-shrink-0 px-3 py-3 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="flex items-center gap-2 h-12 px-4 rounded-[24px] bg-[var(--color-surface-raised)] border border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)] transition-all duration-200">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-transparent text-14 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none disabled:opacity-50"
        />

        {value.trim().length > 0 ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ background: "var(--color-primary)" }}
        className="w-9 h-9 rounded-full text-white flex items-center justify-center active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex-shrink-0"
            aria-label="Send"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        ) : (
          <button
            className="w-9 h-9 rounded-full text-[var(--color-text-tertiary)] flex items-center justify-center flex-shrink-0"
            aria-label="Voice"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
