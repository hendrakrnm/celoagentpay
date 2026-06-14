import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui";

const groups = [
  { name: "Trip to Bali", members: "8 friends", raised: "1,275 cUSD", target: "1,500 cUSD", progress: 85, badge: "Active" },
  { name: "Office Lunch", members: "12 teammates", raised: "99 cUSD", target: "300 cUSD", progress: 33, badge: "Active" },
];

export default function GroupsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="Groups" actionLabel="New +" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-5 grid grid-cols-3 gap-2">
          {['Active', 'Done', 'Void'].map((tab, index) => (
            <button
              key={tab}
              className={`rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] px-3 py-2 text-xs font-black uppercase shadow-[2px_2px_0_var(--border-color)] ${
                index === 0 ? "bg-[var(--color-accent)]" : "bg-[var(--color-surface)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <article key={group.name} className="memphis-card p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[var(--border-color)] bg-[var(--color-secondary)]">
                    <Users className="h-6 w-6 text-[var(--color-surface)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase text-[var(--color-text-primary)]">{group.name}</h2>
                    <p className="text-xs font-bold uppercase text-[var(--color-text-tertiary)]">{group.members}</p>
                  </div>
                </div>
                <Badge variant="warning">{group.badge}</Badge>
              </div>

              <div className="mb-2 flex justify-between text-xs font-bold uppercase text-[var(--color-text-secondary)]">
                <span>{group.raised}</span>
                <span>{group.target}</span>
              </div>
              <div className="h-5 rounded-full border-[3px] border-[var(--border-color)] bg-white p-0.5">
                <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${group.progress}%` }} />
              </div>
              <p className="mono mt-3 text-right text-sm text-[var(--border-color)]">{group.progress}% funded</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
