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

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4">
      <h1 className="text-lg font-bold uppercase tracking-[0.04em] text-[var(--color-text-primary)]">{title}</h1>

      <div className="flex items-center gap-2">
        {isConnected && !isCorrectChain && (
          <button
            onClick={switchToCorrectChain}
            disabled={isSwitching}
            className="memphis-soft-press flex items-center gap-1.5 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {isSwitching ? "Switching" : "Celo"}
          </button>
        )}

        {!isConnected && (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="memphis-soft-press flex items-center gap-2 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting" : "Connect"}
          </button>
        )}

        {isConnected && isCorrectChain && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-color)]" />
              <span className="mono">{actionLabel ?? shortAddress}</span>
            </div>
            <button
              onClick={() => disconnect()}
              className="memphis-soft-press rounded-[var(--border-radius)] border-2 border-[var(--border-color)] bg-[var(--color-surface)] p-1.5 shadow-[2px_2px_0_var(--border-color)]"
              title="Disconnect"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
