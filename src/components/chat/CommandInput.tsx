"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface CommandInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function CommandInput({ onSubmit, isLoading = false, placeholder = "Type a command..." }: CommandInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
      setValue("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-x-[3px] border-t-[3px] border-[var(--border-color)] bg-[var(--color-surface)] p-4">
      <div className="flex h-[54px] items-center rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] py-0 pl-4 pr-1.5 shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
        <input
          type="text"
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)] placeholder:font-normal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border-2 border-[var(--border-color)] bg-[var(--color-accent)] text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60"
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          aria-label="Send"
        >
          {isLoading ? <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Send size={20} strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
}
