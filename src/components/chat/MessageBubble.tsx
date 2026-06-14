import React from "react";

type MessageType = "user" | "agent" | "agent-loading";

interface MessageBubbleProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

export function MessageBubble({ type, content, timestamp }: MessageBubbleProps) {
  const isUser = type === "user";

  if (type === "agent-loading") {
    return (
      <div className="mb-3 flex w-full justify-start px-4">
        <div className="rounded-[18px_18px_18px_4px] border-[3px] border-[var(--border-color)] bg-[var(--bubble-agent-bg)] px-4 py-3 shadow-[var(--shadow-offset)]">
          <div className="flex h-5 items-center gap-1.5">
            {[0, 160, 320].map((delay) => (
              <span
                key={delay}
                className="inline-block h-2 w-2 rounded-full bg-[var(--color-text-tertiary)]"
                style={{ animation: "loading-dots 1.4s infinite", animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-3 flex w-full px-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`whitespace-pre-wrap break-words border-[3px] border-[var(--border-color)] px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-offset)] ${
            isUser
              ? "rounded-[18px_18px_4px_18px] bg-[var(--bubble-user-bg)] text-[var(--bubble-user-text)]"
              : "rounded-[18px_18px_18px_4px] bg-[var(--bubble-agent-bg)] text-[var(--bubble-agent-text)]"
          }`}
        >
          {content}
        </div>
        {timestamp && (
          <span className="px-1 text-[11px] font-semibold uppercase text-[var(--color-text-tertiary)]">
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
