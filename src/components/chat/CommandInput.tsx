"use client";

import { useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const hasText = inputRef.current?.value.trim().length ?? 0 > 0;

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
        px-3 pb-3 z-30
        max-w-[430px] mx-auto w-full
      "
    >
      <div
        className="
          h-12 px-4 rounded-[24px]
          bg-[var(--color-surface)]
          border border-[var(--color-border)]
          flex items-center gap-3
          shadow-[var(--shadow-md)]
          focus-within:border-[var(--color-primary)]
          focus-within:ring-2 focus-within:ring-[var(--color-primary-light)]
          transition-all duration-200
        "
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onChange={() => {
            // Force re-render to update hasText
            const input = inputRef.current;
            input?.parentElement?.parentElement?.classList.toggle(
              "has-text",
              (input?.value.trim().length ?? 0) > 0
            );
          }}
          disabled={isLoading}
          className="
            flex-1 bg-transparent
            text-14 text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-tertiary)]
            outline-none
            disabled:opacity-50
          "
        />

        {hasText || isLoading ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="
              w-10 h-10 rounded-full
              bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]
              text-white
              flex items-center justify-center
              hover:shadow-[var(--shadow-lg)] active:scale-[0.9]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150
              flex-shrink-0
              shadow-[var(--shadow-md)]
            "
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        ) : (
          <button
            className="
              w-9 h-9 rounded-full
              text-[var(--color-text-tertiary)]
              hover:text-[var(--color-primary)]
              hover:bg-[var(--color-surface-raised)]
              flex items-center justify-center
              transition-all duration-150
              flex-shrink-0
            "
            aria-label="Voice message"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
