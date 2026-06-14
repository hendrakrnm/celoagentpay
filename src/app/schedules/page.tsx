import { CalendarDays, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const schedules = [
  { title: "Weekly Rent", amount: "200.00 cUSD", target: "Landlord", cadence: "every Friday.", next: "NEXT: JUN 19", icon: CalendarDays, iconBg: "var(--color-accent)", nextBg: "var(--color-accent)" },
  { title: "DCA Ethereum", amount: "50.00 cUSD", target: "ETH", cadence: "every 1st.", next: "NEXT: JUL 01", icon: TrendingUp, iconBg: "var(--color-secondary)", nextBg: "var(--color-secondary)" },
];

export default function SchedulesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col pb-20">
      <PageHeader title="Schedules" actionLabel="New +" />
      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {schedules.map((schedule) => {
          const Icon = schedule.icon;
          const teal = schedule.iconBg === "var(--color-secondary)";
          return (
            <article key={schedule.title} className="mb-4 rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] p-[18px] shadow-[var(--shadow-offset)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base font-bold text-[var(--border-color)]">
                  <div className="rounded-lg border-2 border-[var(--border-color)] p-1.5" style={{ background: schedule.iconBg }}><Icon size={20} strokeWidth={2.5} color={teal ? "var(--color-surface)" : "var(--border-color)"} /></div>
                  {schedule.title}
                </div>
                <div className="inline-flex h-6 items-center rounded-[12px] border-2 border-[var(--border-color)] bg-[var(--color-primary)] px-2.5 text-[11px] font-bold uppercase text-[var(--color-surface)] shadow-[2px_2px_0_var(--border-color)]">Active</div>
              </div>
              <div className="mb-5 text-sm font-medium leading-relaxed text-[var(--color-text-secondary)]">Send <span className="mono font-bold text-[var(--border-color)]">{schedule.amount}</span> to <span className="mono">{schedule.target}</span> {schedule.cadence}</div>
              <div className="flex items-center justify-between border-t-2 border-dashed border-[var(--border-color)] pt-4">
                <div className="rounded-md border-2 border-[var(--border-color)] px-2 py-1 text-xs font-bold" style={{ background: schedule.nextBg, color: teal ? "#fff" : "var(--border-color)" }}>{schedule.next}</div>
                <button className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-3.5 py-1.5 text-sm font-semibold shadow-[var(--shadow-offset)]">Execute</button>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
