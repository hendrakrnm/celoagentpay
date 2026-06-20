"use client";

import { AlertTriangle, LogOut, Wallet } from "lucide-react";
import { useWallet } from "@/lib/wallet";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
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
      : shortAddress ?? "Connect";

  return (
    <header className="header">
      <div className="header-title">{title}</div>

      <div className="flex items-center gap-2">
        {actionLabel && (
          onAction ? (
            <button onClick={onAction} className="header-action">
              {actionLabel}
            </button>
          ) : (
            <div className="header-action">
              {actionLabel}
            </div>
          )
        )}

        {!isConnected && (
          <button onClick={connect} disabled={isConnecting} className="header-action">
            <Wallet size={14} strokeWidth={3} />
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
            <div className="header-action"><span className="dot" /> {text}</div>
            <button onClick={() => disconnect()} title="Disconnect" className="header-action bg-[var(--color-surface)] px-2">
              <LogOut size={14} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
