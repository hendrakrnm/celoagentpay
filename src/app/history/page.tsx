import { ArrowDown, ArrowUp, PenLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function HistoryPage() {
  return (
    <div className="page">
      <PageHeader title="History" actionLabel="June 2026" />
      <main className="page-scroll">
        <div className="stats-row">
          <div className="stat-card in"><div className="stat-label">In</div><div className="stat-value mono">+$850</div></div>
          <div className="stat-card out"><div className="stat-label">Out</div><div className="stat-value mono">-$240</div></div>
          <div className="stat-card saved"><div className="stat-label">Saved</div><div className="stat-value mono">$610</div></div>
        </div>
        <div className="history-list">
          <div className="list-group-header">Today</div>
          <div className="list-item">
            <div className="item-left"><div className="item-icon primary"><ArrowUp size={22} strokeWidth={3} /></div><div><div className="item-title">Sent to Alice</div><div className="item-subtitle mono">0x7F...3B9A</div></div></div>
            <div className="item-right"><div className="item-title mono text-[var(--color-primary)]">-50.00 cUSD</div><div className="item-subtitle">9:41 AM</div></div>
          </div>
          <div className="list-group-header secondary">Yesterday</div>
          <div className="list-item">
            <div className="item-left"><div className="item-icon secondary"><ArrowDown size={22} strokeWidth={3} /></div><div><div className="item-title">Salary Deposit</div><div className="item-subtitle mono">Company Inc.</div></div></div>
            <div className="item-right"><div className="item-title mono text-[var(--color-secondary)]">+850.00 cUSD</div><div className="item-subtitle">10:00 AM</div></div>
          </div>
          <div className="list-item">
            <div className="item-left"><div className="item-icon"><PenLine size={22} strokeWidth={3} /></div><div><div className="item-title">Agent Contract</div><div className="item-subtitle mono">Swap CELO to cUSD</div></div></div>
            <div className="item-right"><div className="item-title mono">-12.50 CELO</div><div className="item-subtitle">2:15 PM</div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
