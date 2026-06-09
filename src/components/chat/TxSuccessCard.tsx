import { CheckCircle, ExternalLink } from "lucide-react";

interface TxSuccessCardProps {
  title: string;
  details: string;
  txHash?: string;
  explorerUrl?: string;
}

export function TxSuccessCard({
  title,
  details,
  txHash,
  explorerUrl,
}: TxSuccessCardProps) {
  return (
    <div
      className="
        mx-4 my-3 p-4
        rounded-[14px] border border-[var(--color-border-strong)]
        bg-[var(--color-success-light)]
        border-l-4 border-l-[var(--color-success)]
        animate-success-pop
      "
    >
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-14 font-medium text-[var(--color-text-primary)]">
            {title}
          </p>
          <p className="text-12 text-[var(--color-text-secondary)] mt-1">
            {details}
          </p>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1 mt-2
                text-12 font-medium text-[var(--color-primary)]
                hover:opacity-80 transition-opacity
              "
            >
              View on explorer <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
