type MessageType = "user" | "agent" | "agent-loading";

interface MessageBubbleProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

export function MessageBubble({ type, content }: MessageBubbleProps) {
  if (type === "agent-loading") {
    return (
      <div className="message-wrapper agent">
        <div className="message-bubble flex h-12 items-center gap-1.5">
          {[0, 160, 320].map((delay) => (
            <span
              key={delay}
              className="inline-block h-2 w-2 rounded-full bg-[var(--color-text-tertiary)]"
              style={{ animation: "loading-dots 1.4s infinite", animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`message-wrapper ${type === "user" ? "user" : "agent"}`}>
      <div className="message-bubble">{content}</div>
    </div>
  );
}
