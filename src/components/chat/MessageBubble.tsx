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
      <div className="w-full flex justify-start px-4 mb-3">
        <div
          style={{
            background: "var(--bubble-agent-bg)",
            borderRadius: "18px 18px 18px 4px",
            padding: "12px 16px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", gap: "6px", alignItems: "center", height: "20px" }}>
            {[0, 160, 320].map((delay) => (
              <span
                key={delay}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-text-tertiary)",
                  display: "inline-block",
                  animation: "loading-dots 1.4s infinite",
                  animationDelay: `${delay}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        paddingLeft: "12px",
        paddingRight: "12px",
        marginBottom: "6px",
      }}
    >
      <div
        style={{
          maxWidth: "72%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          gap: "2px",
        }}
      >
        {/* Bubble */}
        <div
          style={{
            background: isUser ? "var(--bubble-user-bg)" : "var(--bubble-agent-bg)",
            color: isUser ? "var(--bubble-user-text)" : "var(--bubble-agent-text)",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            padding: "10px 14px",
            fontSize: "14px",
            lineHeight: "1.5",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            boxShadow: "var(--shadow-sm)",
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span
            style={{
              fontSize: "11px",
              color: "var(--color-text-tertiary)",
              paddingLeft: "4px",
              paddingRight: "4px",
            }}
          >
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
