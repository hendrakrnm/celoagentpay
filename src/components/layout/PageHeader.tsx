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
    <header className="header">
      <div className="header-title">{title}</div>

      {!isConnected && (
        <button onClick={actionLabel ? undefined : connect} disabled={isConnecting || !!actionLabel} className="header-action">
          {!actionLabel && <Wallet size={14} strokeWidth={3} />}
          {text}
        </button>
      )}

      {isConnected && !isCorrectChain && (
        <button onClick={switchToCorrectChain} disabled={isSwitching} className="header-action">
          <AlertTriangle size={14} strokeWidth={3} /> {text}
        </button>
      )}

      {isConnected && isCorrectChain && (
        <div className="flex items-center gap-2">
          <div className="header-action">{!actionLabel && <span className="dot" />} {text}</div>
          {!actionLabel && (
            <button onClick={() => disconnect()} title="Disconnect" className="header-action bg-[var(--color-surface)] px-2">
              <LogOut size={14} strokeWidth={3} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
