import React from "react";

type MessageType = "user" | "agent" | "agent-loading";

interface MessageBubbleProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

export function MessageBubble({
  type,
  content,
  timestamp,
}: MessageBubbleProps) {
  const isUser = type === "user";

  if (type === "agent-loading") {
    return (
      <div className="flex justify-start mb-3 px-4">
        <div
          className="
            max-w-xs px-4 py-3 rounded-[14px]
            bg-[var(--color-surface-raised)]
            text-[var(--color-text-primary)]
            text-14
          "
        >
          <div className="flex gap-1 items-center h-5">
            <span
              className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)]"
              style={{
                animation: "loading-dots 1.4s infinite",
                animationDelay: "0ms",
              }}
            />
            <span
              className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)]"
              style={{
                animation: "loading-dots 1.4s infinite",
                animationDelay: "160ms",
              }}
            />
            <span
              className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)]"
              style={{
                animation: "loading-dots 1.4s infinite",
                animationDelay: "320ms",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-3 px-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-xs px-4 py-3 rounded-[14px]
          text-14 leading-relaxed
          ${
            isUser
              ? "bg-[var(--color-primary)] text-white rounded-[14px_14px_4px_14px]"
              : "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] rounded-[14px_14px_14px_4px]"
          }
        `}
      >
        <p>{content}</p>
        {timestamp && !isUser && (
          <p className="text-11 text-[var(--color-text-tertiary)] mt-1">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
