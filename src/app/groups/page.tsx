import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const groups = [
  { title: "Trip to Bali", members: "4 PPL", amount: "850 / 1,000 cUSD", progress: 85, badge: "On Track", badgeColor: "bg-[var(--color-secondary)] text-[var(--color-surface)]", fill: "var(--color-secondary)" },
  { title: "Office Lunch", members: "12 PPL", amount: "40 / 120 cUSD", progress: 33, badge: "Action", badgeColor: "bg-[var(--color-accent)] text-[var(--border-color)]", fill: "var(--color-primary)" },
];

export default function GroupsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="Groups" actionLabel="New +" />
      <div className="flex border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)]" style={{ gap: 12, padding: 16 }}>
        {['Active', 'Done', 'Void'].map((tab, index) => <button key={tab} className={`rounded-[12px] border-2 border-[var(--border-color)] px-[18px] py-2 text-[13px] font-bold uppercase shadow-[2px_2px_0_var(--border-color)] ${index === 0 ? 'translate-x-0.5 translate-y-0.5 bg-[var(--color-accent)] shadow-none' : 'bg-[var(--color-surface)]'}`}>{tab}</button>)}
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        {groups.map((group) => (
          <article key={group.title} className="rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] shadow-[var(--shadow-offset)]" style={{ padding: 18 }}>
            <div className="flex items-start justify-between" style={{ marginBottom: 16 }}>
              <div>
                <div className="text-[22px] font-bold leading-tight text-[var(--border-color)]">{group.title}</div>
                <div className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-text-secondary)]"><Users size={16} strokeWidth={2.5} />{group.members}</div>
              </div>
              <div className={`inline-flex h-6 items-center rounded-[12px] border-2 border-[var(--border-color)] px-2.5 text-[11px] font-bold uppercase shadow-[2px_2px_0_var(--border-color)] ${group.badgeColor}`}>{group.badge}</div>
            </div>
            <div className="rounded-[12px] border-2 border-dashed border-[var(--border-color)] bg-white" style={{ marginTop: 16, padding: 12 }}>
              <div className="mb-3 flex justify-between text-[13px] font-bold text-[var(--border-color)]"><span className="mono">{group.amount}</span><span>{group.progress}%</span></div>
              <div className="h-3 overflow-hidden rounded-full border-2 border-[var(--border-color)] bg-[var(--color-surface)]"><div className="h-full border-r-2 border-[var(--border-color)]" style={{ width: `${group.progress}%`, backgroundColor: group.fill }} /></div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
