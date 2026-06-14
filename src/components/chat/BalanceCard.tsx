"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useBalance, useReadContracts } from "wagmi";
import { useWallet } from "@/lib/wallet";
import { TOKENS } from "@/lib/tokens";

const ERC20_BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

function fmt(wei: bigint | undefined): string {
  if (wei === undefined) return "0.00";
  const n = Number(wei) / 1e18;
  return n < 0.001 ? "0.00" : n.toFixed(2);
}

export function BalanceCard() {
  const [copied, setCopied] = useState(false);
  const { address, isConnected, shortAddress } = useWallet();

  const { data: nativeBal } = useBalance({ address, query: { enabled: !!address } });
  useReadContracts({
    contracts: [TOKENS.cUSD, TOKENS.cEUR, TOKENS.cREAL].map((token) => ({
      address: token.address!,
      abi: ERC20_BALANCE_ABI,
      functionName: "balanceOf" as const,
      args: [address!] as [`0x${string}`],
    })),
    query: { enabled: !!address },
  });

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="balance-card">
      <div className="balance-label">Total Balance</div>
      <div className="balance-amount mono">
        {isConnected ? `${fmt(nativeBal?.value)} CELO` : "$0.00"}
      </div>
      {isConnected && shortAddress && (
        <button onClick={copyAddress} className="header-action mx-auto mt-3 bg-[var(--color-surface)]">
          <span className="mono">{shortAddress}</span>
          {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={3} />}
        </button>
      )}
    </div>
  );
}
