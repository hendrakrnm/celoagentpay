"use client";

import { useState } from "react";
import { Send, Mic } from "lucide-react";

interface CommandInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function CommandInput({ onSubmit, isLoading = false, placeholder = "Send a payment command..." }: CommandInputProps) {
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
    <div className="flex-shrink-0 border-t-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-3 py-3">
      <div className="flex h-[54px] items-center gap-2 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-white px-3 shadow-[var(--shadow-offset)] transition-all duration-100 focus-within:translate-x-1 focus-within:translate-y-1 focus-within:shadow-[var(--shadow-active)]">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)] disabled:opacity-50"
        />

        {value.trim().length > 0 ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="memphis-soft-press flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send"
          >
            {isLoading ? <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        ) : (
          <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] text-[var(--color-text-tertiary)]" aria-label="Voice">
            <Mic className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
