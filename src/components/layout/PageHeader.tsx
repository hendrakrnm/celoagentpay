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

  const buttonText = isConnecting
    ? "Connecting"
    : isSwitching
      ? "Switching"
      : actionLabel ?? shortAddress ?? "Connect";

  return (
    <header className="header">
      <div className="header-title">{title}</div>

      {!isConnected && (
        <button className="header-action" onClick={connect} disabled={isConnecting}>
          <Wallet size={14} strokeWidth={3} /> {buttonText}
        </button>
      )}

      {isConnected && !isCorrectChain && (
        <button className="header-action" onClick={switchToCorrectChain} disabled={isSwitching}>
          <AlertTriangle size={14} strokeWidth={3} /> {buttonText}
        </button>
      )}

      {isConnected && isCorrectChain && (
        <div className="flex items-center gap-2">
          <div className="header-action">
            <div className="dot" /> {buttonText}
          </div>
          {!actionLabel && (
            <button className="header-action bg-[var(--color-surface)] px-2" onClick={() => disconnect()} title="Disconnect">
              <LogOut size={14} strokeWidth={3} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
