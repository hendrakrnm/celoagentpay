import { CalendarDays, Play } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, Button } from "@/components/ui";

const schedules = [
  { name: "Weekly Rent", amount: "125 cUSD", cadence: "Every Friday", next: "Next run Jun 19", badge: "Live" },
  { name: "DCA Ethereum", amount: "20 cUSD", cadence: "Every Monday", next: "Next run Jun 22", badge: "Queued" },
];

export default function SchedulesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="Schedules" actionLabel="New +" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <article key={schedule.name} className="memphis-card p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[var(--border-color)] ${index === 0 ? "bg-[var(--color-accent)]" : "bg-[var(--color-secondary)]"}`}>
                    <CalendarDays className="h-6 w-6 text-[var(--border-color)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase text-[var(--color-text-primary)]">{schedule.name}</h2>
                    <p className="text-xs font-bold uppercase text-[var(--color-text-tertiary)]">{schedule.cadence}</p>
                  </div>
                </div>
                <Badge variant={index === 0 ? "success" : "warning"}>{schedule.badge}</Badge>
              </div>

              <div className="mb-4 rounded-[var(--border-radius)] border-2 border-dashed border-[var(--border-color)] bg-white p-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="uppercase text-[var(--color-text-secondary)]">Amount</span>
                  <span className="mono text-[var(--border-color)]">{schedule.amount}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm font-bold">
                  <span className="uppercase text-[var(--color-text-secondary)]">Next</span>
                  <span className="text-[var(--color-primary)]">{schedule.next}</span>
                </div>
              </div>

              <Button variant="primary" size="lg" fullWidth>
                <Play className="mr-2 h-4 w-4" /> Execute now
              </Button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
