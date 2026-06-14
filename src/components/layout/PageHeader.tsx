"use client";

import { AlertTriangle, LogOut, Wallet } from "lucide-react";
import { useWallet } from "@/lib/wallet";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
}

export function PageHeader({ title, actionLabel }: PageHeaderProps) {
  const {
    isConnected,
    isCorrectChain,
    isConnecting,
    isSwitching,
    shortAddress,
    connect,
    disconnect,
    switchToCorrectChain,
  } = useWallet();

  const text = isConnecting
    ? "Connecting"
    : isSwitching
      ? "Switching"
      : actionLabel ?? shortAddress ?? "Connect";

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4">
      <div className="text-lg font-bold uppercase tracking-[0.5px] text-[var(--color-text-primary)]">{title}</div>

      {!isConnected && (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="flex items-center gap-2 rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Wallet size={14} strokeWidth={3} /> {text}
        </button>
      )}

      {isConnected && !isCorrectChain && (
        <button
          onClick={switchToCorrectChain}
          disabled={isSwitching}
          className="flex items-center gap-2 rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <AlertTriangle size={14} strokeWidth={3} /> {text}
        </button>
      )}

      {isConnected && isCorrectChain && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-color)]" /> {text}
          </div>
          {!actionLabel && (
            <button
              onClick={() => disconnect()}
              title="Disconnect"
              className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] p-1.5 shadow-[2px_2px_0_var(--border-color)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <LogOut size={14} strokeWidth={3} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
