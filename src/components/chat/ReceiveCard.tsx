"use client";

import { useState } from "react";
import { Copy, Check, QrCode } from "lucide-react";
import { shortAddress } from "@/lib/celo";

interface ReceiveCardProps {
  address?: string;
  isConnected: boolean;
  onConnect: () => void;
}

export function ReceiveCard({ address, isConnected, onConnect }: ReceiveCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="memphis-card mx-4 my-3 bg-[var(--color-surface)] p-5 text-center">
        <div className="flex justify-center mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[var(--border-color)] bg-[var(--color-accent)]">
            <QrCode className="h-6 w-6 text-[var(--border-color)]" />
          </div>
        </div>
        <p className="text-base font-black uppercase text-[var(--color-text-primary)]">Wallet Not Connected</p>
        <p className="mt-1 text-sm font-semibold text-[var(--color-text-secondary)]">
          Please connect your wallet first to view your receive address and QR code.
        </p>
        <button
          onClick={onConnect}
          className="btn-ghost mt-4 w-full text-center"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(address)}`;

  return (
    <div className="memphis-card mx-4 my-3 bg-[var(--color-surface)] p-5">
      <p className="text-base font-black uppercase text-[var(--color-text-primary)] mb-4 text-center">
        Receive Payment
      </p>

      {/* QR Code Container with Memphis borders */}
      <div className="flex justify-center mb-5">
        <div className="bg-white p-3 rounded-[12px] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0_var(--border-color)] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="Receive Address QR Code"
            width={160}
            height={160}
            className="block"
          />
        </div>
      </div>

      <div className="border-t-2 border-dashed border-[var(--border-color)] pt-4">
        <p className="text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-2">
          Your cUSD / Celo Address
        </p>
        
        {/* Address and Copy Button */}
        <div className="flex items-center gap-2 bg-[var(--color-bg)] border-[3px] border-[var(--border-color)] rounded-[12px] p-3 shadow-[2px_2px_0_var(--border-color)]">
          <div className="flex-1 min-w-0">
            <p className="mono text-xs text-[var(--color-text-primary)] truncate font-semibold">
              {address}
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
              ({shortAddress(address)})
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-[var(--border-color)] transition-all duration-100 ${
              copied
                ? "bg-[var(--color-secondary)] text-white shadow-none translate-x-[2px] translate-y-[2px]"
                : "bg-[var(--color-accent)] text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            }`}
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={3} />}
          </button>
        </div>
        <p className="text-[11px] font-semibold text-[var(--color-text-tertiary)] mt-3 text-center">
          Share this address to receive Celo network tokens (cUSD, CELO, cEUR, cREAL).
        </p>
      </div>
    </div>
  );
}
