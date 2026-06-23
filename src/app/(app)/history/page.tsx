"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowDown, ArrowUp, AlertCircle, Clock3, RefreshCw, Wallet } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { useWallet } from "@/lib/wallet";
import { fetchTransactionHistory, type Transaction } from "@/lib/explorer";
import { shortAddress } from "@/lib/celo";

export default function HistoryPage() {
  const { address, isConnected, connect } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "cUSD" | "CELO" | "cEUR" | "cREAL">("ALL");

  const loadHistory = useCallback(async (addr: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactionHistory(addr);
      setTransactions(data);
    } catch (err) {
      console.error("Error loading transaction history:", err);
      setError("Failed to fetch transaction history. Please pull down or retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadHistory(address);
    } else {
      setTransactions([]);
    }
  }, [isConnected, address, loadHistory]);

  const handleRefresh = () => {
    if (address) {
      loadHistory(address);
    }
  };

  // Filter transactions based on selected token
  const filteredTxs = transactions.filter((tx) => {
    if (activeTab === "ALL") return true;
    return tx.tokenSymbol.toUpperCase() === activeTab.toUpperCase();
  });

  // Calculate dynamic stats based on selected tab or cUSD
  const statsToken = activeTab === "ALL" ? "cUSD" : activeTab;
  const statsList = transactions.filter(
    (tx) => tx.tokenSymbol.toUpperCase() === statsToken.toUpperCase()
  );

  const totalIn = statsList
    .filter((tx) => !tx.isOut)
    .reduce((sum, tx) => sum + parseFloat(tx.value || "0"), 0);

  const totalOut = statsList
    .filter((tx) => tx.isOut)
    .reduce((sum, tx) => sum + parseFloat(tx.value || "0"), 0);

  const netSaved = totalIn - totalOut;

  const formatStatValue = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Group transactions by date
  const groupTransactionsByDate = (txs: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    txs.forEach((tx) => {
      const date = new Date(tx.timestamp * 1000);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let groupKey = "";
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday";
      } else {
        groupKey = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });
    return groups;
  };

  const groupedTxs = groupTransactionsByDate(filteredTxs);
  const groupKeys = Object.keys(groupedTxs);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="page">
      <PageHeader title="History" />

      <div className="tab-filter justify-between items-center py-3 px-4 gap-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-none flex-1">
          {(["ALL", "cUSD", "CELO", "cEUR", "cREAL"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="tab shrink-0 flex items-center justify-center hover:bg-[var(--color-accent)] disabled:opacity-50"
          style={{ padding: 0, width: 38, height: 38 }}
          title="Refresh History"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
        </button>
      </div>

      <main className="page-scroll">
        {isConnected ? (
          <>
            {/* Stats row */}
            <div className="stats-row">
              <div className="stat-card in">
                <div className="stat-label">In ({statsToken})</div>
                <div className="stat-value mono">+{formatStatValue(totalIn)}</div>
              </div>
              <div className="stat-card out">
                <div className="stat-label">Out ({statsToken})</div>
                <div className="stat-value mono">-{formatStatValue(totalOut)}</div>
              </div>
              <div className="stat-card saved">
                <div className="stat-label">Net ({statsToken})</div>
                <div className="stat-value mono">
                  {netSaved >= 0 ? "+" : ""}
                  {formatStatValue(netSaved)}
                </div>
              </div>
            </div>

            {/* List area */}
            {loading ? (
              /* Loading Skeleton */
              <div className="history-list animate-pulse">
                <div className="list-group-header w-24 h-6 mb-4 bg-gray-200 border-gray-300"></div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="list-item opacity-60">
                    <div className="item-left">
                      <div className="item-icon bg-gray-200 border-gray-300 w-11 h-11 rounded-xl"></div>
                      <div className="flex flex-col gap-2">
                        <div className="bg-gray-200 h-4 w-28 rounded"></div>
                        <div className="bg-gray-200 h-3 w-20 rounded"></div>
                      </div>
                    </div>
                    <div className="item-right flex flex-col gap-2 items-end">
                      <div className="bg-gray-200 h-4 w-16 rounded"></div>
                      <div className="bg-gray-200 h-3 w-12 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] gap-6">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] border-[3px] border-[var(--border-color)] flex items-center justify-center text-white shadow-[4px_4px_0px_var(--border-color)]">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Failed to Load History</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mt-2">{error}</p>
                </div>
                <button onClick={handleRefresh} className="btn-ghost">
                  <RefreshCw className="mr-2 inline" size={14} /> Retry
                </button>
              </div>
            ) : filteredTxs.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] gap-6">
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] border-[3px] border-[var(--border-color)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-color)]">
                  <Clock3 size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">No Transactions</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mt-2">
                    No transactions found for {activeTab === "ALL" ? "any token" : activeTab} on Celo.
                  </p>
                </div>
                <Link href="/chat" className="btn-ghost text-center no-underline text-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]">
                  Go to Chat
                </Link>
              </div>
            ) : (
              /* Grouped List */
              <div className="history-list">
                {groupKeys.map((groupKey, index) => (
                  <div key={groupKey} className="flex flex-col">
                    <div className={`list-group-header ${index % 2 !== 0 ? "secondary" : ""}`}>
                      {groupKey}
                    </div>
                    {groupedTxs[groupKey].map((tx) => (
                      <a
                        key={tx.hash}
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="list-item text-[var(--color-text-primary)] no-underline hover:no-underline"
                      >
                        <div className="item-left">
                          <div className={`item-icon ${tx.isOut ? "primary" : "secondary"}`}>
                            {tx.isOut ? (
                              <ArrowUp size={22} strokeWidth={3} />
                            ) : (
                              <ArrowDown size={22} strokeWidth={3} />
                            )}
                          </div>
                          <div>
                            <div className="item-title">
                              {tx.isOut ? "Sent to" : "Received from"}
                            </div>
                            <div className="item-subtitle mono">
                              {tx.isOut ? shortAddress(tx.to) : shortAddress(tx.from)}
                            </div>
                          </div>
                        </div>
                        <div className="item-right">
                          <div
                            className={`item-title mono ${tx.isOut
                              ? "text-[var(--color-primary)]"
                              : "text-[var(--color-secondary)]"
                              }`}
                          >
                            {tx.isOut ? "-" : "+"}
                            {tx.value} {tx.tokenSymbol}
                          </div>
                          <div className="item-subtitle">{formatTime(tx.timestamp)}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Disconnected State */
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-[350px] gap-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] border-[3px] border-[var(--border-color)] flex items-center justify-center shadow-[4px_4px_0px_var(--border-color)]">
              <Wallet size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Wallet Disconnected</h3>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mt-2">
                Connect your wallet to securely fetch your Celo transaction history.
              </p>
            </div>
            <button onClick={connect} className="btn-ghost">
              Connect Wallet
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
