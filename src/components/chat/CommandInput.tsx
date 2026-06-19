"use client";

import { Send } from "lucide-react";

interface CommandInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function CommandInput({
  onSubmit,
  isLoading = false,
  placeholder = "Type a command...",
  value,
  onChange,
  inputRef,
}: CommandInputProps) {
  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-bar">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="command-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button className="send-btn" onClick={handleSubmit} disabled={isLoading || !value.trim()} aria-label="Send">
          {isLoading ? <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Send size={20} strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
}
