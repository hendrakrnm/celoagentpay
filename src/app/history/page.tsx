import { ArrowDown, ArrowUp, PenLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const stats = [
  { label: "Sent", value: "$842", color: "bg-[var(--color-primary)] text-[var(--color-surface)]" },
  { label: "Received", value: "$1.2k", color: "bg-[var(--color-secondary)] text-[var(--color-surface)]" },
  { label: "Saved", value: "$96", color: "bg-[var(--color-accent)] text-[var(--border-color)]" },
];

const groups = [
  {
    title: "Today",
    items: [
      { icon: ArrowUp, label: "Coffee with Mia", amount: "-12.50 cUSD", color: "bg-[var(--color-primary)]" },
      { icon: ArrowDown, label: "Freelance payout", amount: "+180.00 cUSD", color: "bg-[var(--color-secondary)]" },
      { icon: PenLine, label: "Rent memo edited", amount: "Note", color: "bg-[var(--color-accent)]" },
    ],
  },
  {
    title: "Yesterday",
    items: [
      { icon: ArrowUp, label: "Office lunch split", amount: "-28.40 cUSD", color: "bg-[var(--color-primary)]" },
      { icon: ArrowDown, label: "Bali group refund", amount: "+44.00 cUSD", color: "bg-[var(--color-secondary)]" },
    ],
  },
];

export default function HistoryPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="History" actionLabel="June 2026" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className={`memphis-card px-3 py-4 text-center ${stat.color}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em]">{stat.label}</p>
              <p className="mono mt-1 text-lg">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">{group.title}</h2>
              <div className="space-y-3">
                {group.items.map(({ icon: Icon, label, amount, color }) => (
                  <div key={label} className="memphis-card flex items-center gap-3 p-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[var(--border-color)] ${color}`}>
                      <Icon className="h-5 w-5 text-[var(--border-color)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">{label}</p>
                      <p className="text-xs font-semibold uppercase text-[var(--color-text-tertiary)]">MiniPay</p>
                    </div>
                    <p className="mono text-sm text-[var(--border-color)]">{amount}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
