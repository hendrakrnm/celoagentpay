"use client";

import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { shortAddress } from "@/lib/celo";
import { Wallet, LogOut } from "lucide-react";

export function PageHeader({ title }: { title: string }) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header className="flex-shrink-0 h-14 px-4 flex items-center justify-between bg-white border-b border-[var(--color-border)]">
      <h1 className="text-16 font-bold text-[var(--color-text-primary)]">{title}</h1>

      {isConnected && address ? (
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-12 text-[var(--color-text-secondary)] hover:border-red-300 hover:text-red-500 transition-all"
        >
          <span className="font-mono">{shortAddress(address)}</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          onClick={() => connect({ connector: injected() })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-12 font-medium transition-all active:scale-95"
          style={{ background: "var(--color-primary)" }}
        >
          <Wallet className="w-3.5 h-3.5" />
          Connect Wallet
        </button>
      )}
    </header>
  );
}
