type MessageType = "user" | "agent" | "agent-loading";

interface MessageBubbleProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

export function MessageBubble({ type, content }: MessageBubbleProps) {
  if (type === "agent-loading") {
    return (
      <div className="flex max-w-[85%] flex-col self-start">
        <div className="rounded-[12px_12px_12px_0] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-[18px] py-3.5 shadow-[var(--shadow-offset)]">
          <div className="flex h-5 items-center gap-1.5">
            {[0, 160, 320].map((delay) => (
              <span key={delay} className="h-2 w-2 rounded-full bg-[var(--color-text-tertiary)]" style={{ animation: "loading-dots 1.4s infinite", animationDelay: `${delay}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const user = type === "user";

  return (
    <div className={`flex max-w-[85%] flex-col ${user ? "self-end" : "self-start"}`}>
      <div
        className={`whitespace-pre-wrap break-words border-[3px] border-[var(--border-color)] px-[18px] py-3.5 text-sm font-medium leading-normal shadow-[var(--shadow-offset)] ${
          user
            ? "rounded-[12px_12px_0_12px] bg-[var(--color-primary)] text-[var(--color-surface)]"
            : "rounded-[12px_12px_12px_0] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
