import React from "react";
import { Check } from "lucide-react";

type MessageType = "user" | "agent" | "agent-loading";
type MessageStatus = "sending" | "sent" | "delivered" | "read";

interface MessageBubbleProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
  status?: MessageStatus;
}

export function MessageBubble({
  type,
  content,
  timestamp,
  status = "read",
}: MessageBubbleProps) {
  const isUser = type === "user";

  if (type === "agent-loading") {
    return (
      <div className="flex justify-start mb-4 px-4">
        <div
          className="
            max-w-xs px-4 py-3 rounded-[18px]
            bg-[var(--color-surface-raised)]
            text-[var(--color-text-primary)]
            text-14
            shadow-[var(--shadow-sm)]
          "
        >
          <div className="flex gap-1.5 items-center h-5">
            <span
              className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"
              style={{
                animation: "loading-dots 1.4s infinite",
                animationDelay: "0ms",
              }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"
              style={{
                animation: "loading-dots 1.4s infinite",
                animationDelay: "160ms",
              }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"
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

  const statusColor = {
    sending: "text-[var(--color-text-tertiary)]",
    sent: "text-[var(--color-text-tertiary)]",
    delivered: "text-[var(--color-primary)]",
    read: "text-[var(--color-primary)]",
  };

  const renderCheckmarks = () => {
    if (!isUser) return null;
    if (status === "sending") return <Check className="w-3.5 h-3.5" />;
    if (status === "sent") return <Check className="w-3.5 h-3.5" />;
    return (
      <div className="flex -space-x-1">
        <Check className="w-3.5 h-3.5" />
        <Check className="w-3.5 h-3.5" />
      </div>
    );
  };

  return (
    <div
      className={`
        flex mb-1 px-4 gap-2
        ${isUser ? "justify-end" : "justify-start"}
        group
      `}
    >
      <div className="flex flex-col gap-0.5">
        <div
          className={`
            max-w-xs px-4 py-2.5 rounded-[18px]
            text-14 leading-relaxed
            transition-all duration-200
            shadow-[var(--shadow-sm)]
            ${
              isUser
                ? "bg-[var(--color-primary)] text-white rounded-br-[4px] hover:shadow-[var(--shadow-md)]"
                : "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] rounded-bl-[4px] hover:bg-[var(--color-border-strong)]"
            }
          `}
        >
          <p className="break-words">{content}</p>
        </div>

        {/* Timestamp and Status */}
        {timestamp && (
          <div
            className={`
              flex items-center gap-1 px-2
              text-10 text-[var(--color-text-tertiary)]
              opacity-0 group-hover:opacity-100 transition-opacity
              ${isUser ? "justify-end" : "justify-start"}
            `}
          >
            <span>
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isUser && (
              <div className={statusColor[status]}>{renderCheckmarks()}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
