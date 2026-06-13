"use client";

import { Wallet, LogOut, AlertTriangle } from "lucide-react";
import { useWallet } from "@/lib/wallet";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
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
    <header className="flex-shrink-0 h-14 px-4 flex items-center justify-between bg-[var(--color-surface)] border-b border-[var(--color-border)] z-30">
      <h1 className="text-16 font-semibold text-[var(--color-text-primary)]">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        {isConnected && !isCorrectChain && (
          <button
            onClick={switchToCorrectChain}
            disabled={isSwitching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-12 font-medium bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {isSwitching ? "Switching..." : "Switch to Celo"}
          </button>
        )}

        {!isConnected && (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-13 font-medium text-white transition-all active:scale-95"
            style={{ background: "var(--color-primary)" }}
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
        )}

        {isConnected && isCorrectChain && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <code className="font-mono text-11 text-[var(--color-text-secondary)]">
                {shortAddress}
              </code>
            </div>
            <button
              onClick={() => disconnect()}
              className="p-1.5 rounded-[8px] text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
