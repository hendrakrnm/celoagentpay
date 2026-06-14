import { ArrowDown, ArrowUp, PenLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function HistoryPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col pb-20">
      <PageHeader title="History" actionLabel="June 2026" />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3 p-4">
          <div className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-secondary)] px-2.5 py-3.5 text-center text-[var(--color-surface)] shadow-[var(--shadow-offset)]"><div className="text-[11px] font-bold uppercase">In</div><div className="mono mt-1 text-lg font-bold">+$850</div></div>
          <div className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-primary)] px-2.5 py-3.5 text-center text-[var(--color-surface)] shadow-[var(--shadow-offset)]"><div className="text-[11px] font-bold uppercase">Out</div><div className="mono mt-1 text-lg font-bold">-$240</div></div>
          <div className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-2.5 py-3.5 text-center shadow-[var(--shadow-offset)]"><div className="text-[11px] font-bold uppercase text-[var(--color-text-secondary)]">Saved</div><div className="mono mt-1 text-lg font-bold">$610</div></div>
        </div>

        <div className="px-4 pb-4">
          <div className="my-3 inline-block -rotate-2 rounded-[12px] border-2 border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1 text-sm font-bold uppercase tracking-[1px]">Today</div>
          <div className="mb-3 flex items-center justify-between rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-offset)]">
            <div className="flex items-center gap-3.5"><div className="flex h-11 w-11 items-center justify-center rounded-[12px] border-2 border-[var(--border-color)] bg-[var(--color-primary)] text-white"><ArrowUp size={22} strokeWidth={3} /></div><div><div className="text-[15px] font-semibold">Sent to Alice</div><div className="mono mt-0.5 text-xs font-medium text-[var(--color-text-secondary)]">0x7F...3B9A</div></div></div>
            <div className="text-right"><div className="mono text-[15px] font-semibold text-[var(--color-primary)]">-50.00 cUSD</div><div className="text-xs font-medium text-[var(--color-text-secondary)]">9:41 AM</div></div>
          </div>

          <div className="my-3 inline-block -rotate-2 rounded-[12px] border-2 border-[var(--border-color)] bg-[var(--color-secondary)] px-3 py-1 text-sm font-bold uppercase tracking-[1px] text-white">Yesterday</div>
          <div className="mb-3 flex items-center justify-between rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-offset)]">
            <div className="flex items-center gap-3.5"><div className="flex h-11 w-11 items-center justify-center rounded-[12px] border-2 border-[var(--border-color)] bg-[var(--color-secondary)] text-white"><ArrowDown size={22} strokeWidth={3} /></div><div><div className="text-[15px] font-semibold">Salary Deposit</div><div className="mono mt-0.5 text-xs font-medium text-[var(--color-text-secondary)]">Company Inc.</div></div></div>
            <div className="text-right"><div className="mono text-[15px] font-semibold text-[var(--color-secondary)]">+850.00 cUSD</div><div className="text-xs font-medium text-[var(--color-text-secondary)]">10:00 AM</div></div>
          </div>

          <div className="mb-3 flex items-center justify-between rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-offset)]">
            <div className="flex items-center gap-3.5"><div className="flex h-11 w-11 items-center justify-center rounded-[12px] border-2 border-[var(--border-color)] bg-[var(--color-accent)]"><PenLine size={22} strokeWidth={3} /></div><div><div className="text-[15px] font-semibold">Agent Contract</div><div className="mono mt-0.5 text-xs font-medium text-[var(--color-text-secondary)]">Swap CELO to cUSD</div></div></div>
            <div className="text-right"><div className="mono text-[15px] font-semibold">-12.50 CELO</div><div className="text-xs font-medium text-[var(--color-text-secondary)]">2:15 PM</div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
