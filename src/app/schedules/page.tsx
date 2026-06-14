import { CalendarDays, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const schedules = [
  { title: "Weekly Rent", amount: "200.00 cUSD", target: "Landlord", cadence: "every Friday.", next: "NEXT: JUN 19", icon: CalendarDays, iconBg: "var(--color-accent)", nextBg: "var(--color-accent)" },
  { title: "DCA Ethereum", amount: "50.00 cUSD", target: "ETH", cadence: "every 1st.", next: "NEXT: JUL 01", icon: TrendingUp, iconBg: "var(--color-secondary)", nextBg: "var(--color-secondary)" },
];

export default function SchedulesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="Schedules" actionLabel="New +" />
      <main className="min-h-0 flex-1 overflow-y-auto" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 28 }}>
        {schedules.map((schedule) => {
          const Icon = schedule.icon;
          const teal = schedule.iconBg === "var(--color-secondary)";
          return (
            <article key={schedule.title} className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] shadow-[var(--shadow-offset)]" style={{ padding: 18 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 22 }}>
                <div className="flex items-center gap-3 text-[18px] font-bold text-[var(--border-color)]">
                  <div className="rounded-lg border-2 border-[var(--border-color)] p-1.5" style={{ background: schedule.iconBg }}><Icon size={20} strokeWidth={2.5} color={teal ? "var(--color-surface)" : "var(--border-color)"} /></div>
                  {schedule.title}
                </div>
                <div className="inline-flex h-6 items-center rounded-[12px] border-2 border-[var(--border-color)] bg-[var(--color-primary)] px-2.5 text-[11px] font-bold uppercase text-[var(--color-surface)] shadow-[2px_2px_0_var(--border-color)]">Active</div>
              </div>
              <div className="text-sm font-medium leading-relaxed text-[var(--color-text-secondary)]" style={{ marginBottom: 24 }}>Send <span className="mono font-bold text-[var(--border-color)]">{schedule.amount}</span> to <span className="mono">{schedule.target}</span> {schedule.cadence}</div>
              <div className="flex items-center justify-between border-t-2 border-dashed border-[var(--border-color)]" style={{ paddingTop: 18 }}>
                <div className="rounded-md border-2 border-[var(--border-color)] px-2 py-1 text-xs font-bold" style={{ background: schedule.nextBg, color: teal ? "#fff" : "var(--border-color)" }}>{schedule.next}</div>
                <button className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 py-2 text-sm font-bold uppercase shadow-[var(--shadow-offset)]">Execute</button>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
