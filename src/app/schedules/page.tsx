import { CalendarDays, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const schedules = [
  { title: "Weekly Rent", detail: "Send", amount: "200.00 cUSD", target: "Landlord", cadence: "every Friday.", next: "NEXT: JUN 19", icon: CalendarDays, iconBg: "var(--color-accent)", nextBg: "var(--color-accent)" },
  { title: "DCA Ethereum", detail: "Swap", amount: "50.00 cUSD", target: "ETH", cadence: "every 1st.", next: "NEXT: JUL 01", icon: TrendingUp, iconBg: "var(--color-secondary)", nextBg: "var(--color-secondary)" },
];

export default function SchedulesPage() {
  return (
    <div className="page-shell">
      <PageHeader title="Schedules" actionLabel="New +" />
      <main className="page-scroll content-area">
        {schedules.map((schedule) => {
          const Icon = schedule.icon;
          return (
            <article className="schedule-card" key={schedule.title}>
              <div className="schedule-header">
                <div className="schedule-title">
                  <div className="schedule-icon" style={{ background: schedule.iconBg }}>
                    <Icon size={20} strokeWidth={2.5} color={schedule.iconBg === "var(--color-secondary)" ? "var(--color-surface)" : "var(--border-color)"} />
                  </div>
                  {schedule.title}
                </div>
                <div className="badge active">Active</div>
              </div>
              <div className="schedule-details">
                {schedule.detail} <span className="mono font-bold text-[var(--border-color)]">{schedule.amount}</span> to <span className="mono">{schedule.target}</span> {schedule.cadence}
              </div>
              <div className="schedule-footer">
                <div className="next-run" style={{ background: schedule.nextBg, color: schedule.nextBg === "var(--color-secondary)" ? "#fff" : "var(--border-color)" }}>{schedule.next}</div>
                <button className="btn-ghost">Execute</button>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
