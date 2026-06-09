"use client";

import { useRef } from "react";
import { Zap, Send } from "lucide-react";

interface CommandInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function CommandInput({
  onSubmit,
  isLoading = false,
  placeholder = "Type a payment command...",
}: CommandInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const value = inputRef.current?.value.trim();
    if (value && !isLoading) {
      onSubmit(value);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="
        fixed bottom-20 left-0 right-0
        px-4 pb-4 z-30
        max-w-[430px] mx-auto w-full
      "
    >
      <div
        className="
          h-13 px-4 rounded-[999px]
          bg-[var(--color-surface-raised)]
          border border-[var(--color-border)]
          flex items-center gap-3
          focus-within:border-[var(--color-primary)]
          focus-within:ring-2 focus-within:ring-[var(--color-primary-light)]
          transition-all duration-150
        "
      >
        <Zap className="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" />

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="
            flex-1 bg-transparent
            text-14 text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-tertiary)]
            outline-none
            disabled:opacity-50
          "
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !inputRef.current?.value.trim()}
          className="
            w-9 h-9 rounded-full
            bg-[var(--color-primary)] text-white
            flex items-center justify-center
            hover:opacity-90 active:scale-[0.95]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-150
            flex-shrink-0
          "
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
