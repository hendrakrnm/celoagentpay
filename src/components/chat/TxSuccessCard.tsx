import { CheckCircle, ExternalLink } from "lucide-react";

interface TxSuccessCardProps {
  title: string;
  details: string;
  txHash?: string;
  explorerUrl?: string;
}

export function TxSuccessCard({ title, details, txHash, explorerUrl }: TxSuccessCardProps) {
  return (
    <div className="memphis-card animate-success-pop mx-4 my-3 bg-[var(--color-success-light)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-[var(--border-color)] bg-[var(--color-secondary)]">
          <CheckCircle className="h-6 w-6 text-[var(--color-surface)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-black uppercase text-[var(--color-text-primary)]">{title}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-secondary)]">{details}</p>
          {txHash && txHash !== "pending" && <p className="mono mt-2 truncate text-xs text-[var(--border-color)]">{txHash}</p>}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 rounded-[8px] border-2 border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]"
            >
              Explorer <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
