import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const groups = [
  { title: "Trip to Bali", members: "4 PPL", amount: "850 / 1,000 cUSD", progress: 85, badge: "On Track", badgeClass: "success", fill: "var(--color-secondary)" },
  { title: "Office Lunch", members: "12 PPL", amount: "40 / 120 cUSD", progress: 33, badge: "Action", badgeClass: "warning", fill: "var(--color-primary)" },
];

export default function GroupsPage() {
  return (
    <div className="page-shell">
      <PageHeader title="Groups" actionLabel="New +" />
      <div className="tab-filter">
        <button className="tab active">Active</button>
        <button className="tab">Done</button>
        <button className="tab">Void</button>
      </div>
      <main className="page-scroll content-area">
        {groups.map((group) => (
          <article className="group-card" key={group.title}>
            <div className="group-header">
              <div>
                <div className="group-title">{group.title}</div>
                <div className="group-members"><Users size={16} strokeWidth={2.5} /> {group.members}</div>
              </div>
              <div className={`badge ${group.badgeClass}`}>{group.badge}</div>
            </div>
            <div className="progress-wrapper">
              <div className="progress-stats"><span className="mono">{group.amount}</span><span>{group.progress}%</span></div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${group.progress}%`, backgroundColor: group.fill }} />
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
