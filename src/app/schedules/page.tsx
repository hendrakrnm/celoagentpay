import { CalendarDays, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const schedules = [
  { title: "Weekly Rent", amount: "200.00 cUSD", target: "Landlord", cadence: "every Friday.", next: "NEXT: JUN 19", icon: CalendarDays, secondary: false },
  { title: "DCA Ethereum", amount: "50.00 cUSD", target: "ETH", cadence: "every 1st.", next: "NEXT: JUL 01", icon: TrendingUp, secondary: true },
];

export default function SchedulesPage() {
  return (
    <div className="page">
      <PageHeader title="Schedules" actionLabel="New +" />
      <main className="page-scroll content-area">
        {schedules.map((schedule) => {
          const Icon = schedule.icon;
          return (
            <article className="schedule-card" key={schedule.title}>
              <div className="schedule-header">
                <div className="schedule-title"><div className={`schedule-icon ${schedule.secondary ? "secondary" : ""}`}><Icon size={20} strokeWidth={2.5} color={schedule.secondary ? "var(--color-surface)" : "var(--border-color)"} /></div>{schedule.title}</div>
                <div className="badge active">Active</div>
              </div>
              <div className="schedule-details">Send <span className="mono font-bold text-[var(--border-color)]">{schedule.amount}</span> to <span className="mono">{schedule.target}</span> {schedule.cadence}</div>
              <div className="schedule-footer"><div className={`next-run ${schedule.secondary ? "secondary" : ""}`}>{schedule.next}</div><button className="btn-ghost">Execute</button></div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
