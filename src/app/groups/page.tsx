"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Users,
  AlertCircle,
  X,
  Zap,
  Check,
  Ban,
  Plus,
  Loader2,
  Clock,
  Trash2,
  UserPlus,
  Target,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCheck,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useWallet } from "@/lib/wallet";
import { useWriteContract, useSendTransaction } from "wagmi";
import { CONTRACT_ADDRESSES, shortAddress } from "@/lib/celo";
import { GROUP_PAYMENT_ABI, executeAction, type ExecuteOptions } from "@/lib/contracts";


// ─── Types ────────────────────────────────────────────────────────────────────

type GroupStatus = "active" | "done" | "cancelled";

interface GroupMember {
  address: string;
  name?: string;
}

interface LocalGroup {
  id: string;
  title: string;
  recipient: string;
  targetAmount: number;
  deadline: string; // ISO date string
  members: GroupMember[];
  contributions: Record<string, number>; // address -> amount contributed
  status: GroupStatus;
  createdAt: string;
  // on-chain group id (once created)
  onChainId?: number;
}

const STORAGE_KEY = "celopay-groups-v2";

// ─── Demo group (shown in Done tab) ──────────────────────────────────────────

const DEMO_GROUP: LocalGroup = {
  id: "demo-1",
  title: "Trip to Bali 🌴",
  recipient: "0x7F3a...3B9A",
  targetAmount: 1000,
  deadline: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  members: [
    { address: "0x1aB2...Cd3E", name: "Alice" },
    { address: "0x4dE5...Fg6H", name: "Bob" },
    { address: "0x7iJ8...Kl9M", name: "Charlie" },
    { address: "0xnO10...Pq1R", name: "Diana" },
  ],
  contributions: {
    "0x1aB2...Cd3E": 250,
    "0x4dE5...Fg6H": 250,
    "0x7iJ8...Kl9M": 250,
    "0xnO10...Pq1R": 250,
  },
  status: "done",
  createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadGroups(): LocalGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGroups(groups: LocalGroup[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch { }
}

function createId() {
  return crypto.randomUUID?.() ?? `g-${Date.now()}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidAddress(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}

function totalContributed(g: LocalGroup) {
  return Object.values(g.contributions).reduce((a, b) => a + b, 0);
}

function progressPct(g: LocalGroup) {
  if (g.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((totalContributed(g) / g.targetAmount) * 100));
}

function perPerson(g: LocalGroup) {
  const count = g.members.length || 1;
  return (g.targetAmount / count).toFixed(2);
}

function deadlineLabel(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = d.getTime() - now;
  if (diff <= 0) return "EXPIRED";
  const h = Math.floor(diff / 3600000);
  if (h > 48) return `${Math.floor(h / 24)}D ${h % 24}H LEFT`;
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}H ${m}M LEFT`;
}

function badgeFor(g: LocalGroup) {
  if (g.status === "done") return { label: "Done ✓", cls: "success" };
  if (g.status === "cancelled") return { label: "Cancelled", cls: "warning" };
  const expired = new Date(g.deadline).getTime() <= Date.now();
  if (expired) return { label: "Expired", cls: "warning" };
  return { label: "Active", cls: "active" };
}

// ─── Shared Field component ───────────────────────────────────────────────────

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="input-group-ref">
      <label className="input-label-ref">
        <span>{label}</span>
        {hint && <span className="helper-text-ref">{hint}</span>}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-danger)]">
          <AlertCircle size={11} strokeWidth={2.5} />
          {error}
        </span>
      )}
    </div>
  );
}

const inp = (err?: string) =>
  [
    "memphis-input-ref",
    err ? "border-[var(--color-danger)]" : "",
  ].filter(Boolean).join(" ");

// ─── GroupCard component ──────────────────────────────────────────────────────

function GroupCard({
  group,
  myAddress,
  onContribute,
  onFinalize,
  onCancel,
  isDemo,
}: {
  group: LocalGroup;
  myAddress?: string;
  onContribute?: (id: string, amount: number) => void;
  onFinalize?: (id: string) => void;
  onCancel?: (id: string) => void;
  isDemo?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [contribAmt, setContribAmt] = useState("");
  const [copied, setCopied] = useState(false);

  const progress = progressPct(group);
  const collected = totalContributed(group);
  const badge = badgeFor(group);
  // eslint-disable-next-line react-hooks/purity
  const isOpen = group.status === "active" && new Date(group.deadline).getTime() > Date.now();
  const isInitiator = myAddress && group.members[0]?.address?.toLowerCase() === myAddress.toLowerCase();

  const copyRecipient = () => {
    navigator.clipboard.writeText(group.recipient);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="group-card">
      {/* ── Clickable header ── */}
      <button
        className="w-full text-left"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="group-header">
          <div className="min-w-0 flex-1">
            <div className="group-title truncate">{group.title}</div>
            <div className="group-members">
              <Users size={13} strokeWidth={2.5} />
              {group.members.length} members
              {" · "}
              <span className="font-mono">{perPerson(group)} cUSD / person</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`badge ${badge.cls}`}>{badge.label}</span>
            {expanded
              ? <ChevronUp size={15} strokeWidth={2.5} />
              : <ChevronDown size={15} strokeWidth={2.5} />}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-wrapper mt-3">
          <div className="progress-stats">
            <span className="mono">
              {collected.toFixed(2)} / {group.targetAmount.toFixed(2)} cUSD
            </span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
                backgroundColor:
                  badge.cls === "success"
                    ? "var(--color-secondary)"
                    : "var(--color-primary)",
              }}
            />
          </div>
        </div>
      </button>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="mt-5 pt-5 border-t-2 border-dashed border-[var(--border-color)] flex flex-col gap-4">

          {/* Recipient row */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5">
              Recipient
            </p>
            <button
              onClick={copyRecipient}
              className="w-full flex items-center justify-between gap-3 bg-white border-2 border-[var(--border-color)] rounded-xl px-4 py-3 hover:bg-[var(--color-accent)] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ArrowRight size={14} strokeWidth={2.5} className="text-[var(--color-text-secondary)] shrink-0" />
                <span className="font-mono text-sm font-bold text-[var(--border-color)] truncate">
                  {group.recipient}
                </span>
              </div>
              {copied
                ? <CheckCheck size={14} strokeWidth={2.5} className="text-[var(--color-secondary)] shrink-0" />
                : <Copy size={14} strokeWidth={2.5} className="text-[var(--color-text-tertiary)] shrink-0" />}
            </button>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between bg-white border-2 border-[var(--border-color)] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]">
              <Clock size={13} strokeWidth={2.5} />
              Deadline
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black text-[var(--color-primary)] uppercase tracking-wide">
                {isDemo ? "DONE 2 DAYS AGO" : deadlineLabel(group.deadline)}
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] font-mono">
                {new Date(group.deadline).toLocaleDateString("en-US", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Members list */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
              Members ({group.members.length})
            </p>
            <div className="flex flex-col gap-2">
              {group.members.map((m, i) => {
                const paid = (group.contributions[m.address] ?? 0) > 0;
                const amtPaid = group.contributions[m.address] ?? 0;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white border-2 border-[var(--border-color)] rounded-xl px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 border-[var(--border-color)] flex items-center justify-center shrink-0 ${paid ? "bg-[var(--color-secondary)]" : "bg-[var(--color-bg)]"
                          }`}
                      >
                        {paid
                          ? <Check size={11} strokeWidth={3} color="white" />
                          : <span className="text-[9px] font-black text-[var(--color-text-tertiary)]">{i + 1}</span>}
                      </div>
                      <div>
                        {m.name && (
                          <div className="text-[12px] font-extrabold text-[var(--border-color)] leading-none mb-0.5">
                            {m.name}
                          </div>
                        )}
                        <div className="font-mono text-[11px] text-[var(--color-text-secondary)]">
                          {m.address.length > 20 ? shortAddress(m.address) : m.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {paid ? (
                        <span className="text-xs font-black font-mono text-[var(--color-secondary)]">
                          +{amtPaid.toFixed(2)} cUSD
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-[var(--color-text-tertiary)] bg-[var(--color-bg)] border border-[var(--border-color)] px-2 py-0.5 rounded-lg">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contribution input (only if active & not demo) */}
          {isOpen && !isDemo && (
            <div className="pt-4 border-t-2 border-[var(--border-color)]">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
                Pay Your Share
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder={`${perPerson(group)} (your share)`}
                    value={contribAmt}
                    onChange={(e) => setContribAmt(e.target.value)}
                    className="h-11 w-full font-semibold text-[14px] bg-white rounded-xl border-2 border-[var(--border-color)] outline-none px-4 pr-14 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-secondary)] transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[var(--border-color)] pointer-events-none uppercase">
                    cUSD
                  </span>
                </div>
                <button
                  onClick={() => onContribute?.(group.id, Number(contribAmt))}
                  disabled={!contribAmt || Number(contribAmt) <= 0}
                  className="px-4 h-11 bg-[var(--color-primary)] text-white border-2 border-[var(--border-color)] rounded-xl font-bold uppercase text-xs shadow-[2px_2px_0px_var(--border-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <Zap size={13} strokeWidth={2.5} />
                  Pay
                </button>
              </div>
            </div>
          )}

          {/* Initiator actions (only if active & not demo) */}
          {isOpen && isInitiator && !isDemo && (
            <div className="flex gap-2 pt-3 border-t-2 border-[var(--border-color)]">
              <button
                onClick={() => onCancel?.(group.id)}
                className="flex-1 h-10 bg-[var(--color-danger)] text-white border-2 border-[var(--border-color)] rounded-xl font-bold uppercase text-xs shadow-[2px_2px_0px_var(--border-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                <Ban size={13} />
                Cancel
              </button>
              <button
                onClick={() => onFinalize?.(group.id)}
                className="flex-1 h-10 bg-[var(--color-secondary)] text-white border-2 border-[var(--border-color)] rounded-xl font-bold uppercase text-xs shadow-[2px_2px_0px_var(--border-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                <Check size={13} />
                Finalize
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GroupsPage() {
  const { address, isConnected, publicClient, connect } = useWallet();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  const [groups, setGroups] = useState<LocalGroup[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "done">("active");
  const [mounted, setMounted] = useState(false);

  // ── Create modal state ──
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [formTitle, setFormTitle] = useState("");
  const [formRecipient, setFormRecipient] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formDeadlineDate, setFormDeadlineDate] = useState("");
  const [formMembers, setFormMembers] = useState<{ addr: string; name: string }[]>([
    { addr: "", name: "" },
  ]);
  const [formErrs, setFormErrs] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  // ── Load from localStorage ──
  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      setGroups(loadGroups());
    });
  }, []);

  const persist = (g: LocalGroup[]) => {
    setGroups(g);
    saveGroups(g);
  };

  // ── Actions ──
  const handleContribute = async (id: string, amount: number) => {
    const group = groups.find((g) => g.id === id);
    if (!group || !address || amount <= 0) return;

    // If group has on-chain ID, call the contract
    if (group.onChainId !== undefined) {
      try {
        const opts: ExecuteOptions = {
          writeContractAsync: writeContractAsync as unknown as ExecuteOptions["writeContractAsync"],
          sendTransactionAsync: sendTransactionAsync as unknown as ExecuteOptions["sendTransactionAsync"],
        };
        await executeAction(
          { action: "contribute", params: { groupId: group.onChainId, amount, token: "cUSD" } },
          opts
        );
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        alert(`Contribute failed: ${errorMsg}`);
        return;
      }
    }

    // Update local state
    const updated = groups.map((g) =>
      g.id === id
        ? { ...g, contributions: { ...g.contributions, [address]: (g.contributions[address] ?? 0) + amount } }
        : g
    );
    persist(updated);
  };

  const handleFinalize = (id: string) => {
    if (!window.confirm("Finalize this group and mark as done?")) return;
    persist(groups.map((g) => (g.id === id ? { ...g, status: "done" as GroupStatus } : g)));
  };

  const handleCancel = (id: string) => {
    if (!window.confirm("Cancel this group?")) return;
    persist(groups.map((g) => (g.id === id ? { ...g, status: "cancelled" as GroupStatus } : g)));
  };

  // ── Form validation ──
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formTitle.trim()) errs.title = "Group name is required";
    if (!isValidAddress(formRecipient)) errs.recipient = "Enter a valid 0x address";
    const t = Number(formTarget);
    if (isNaN(t) || t <= 0) errs.target = "Must be > 0";
    if (!formDeadlineDate) errs.deadline = "Pick a deadline date";
    else if (new Date(formDeadlineDate).getTime() <= Date.now()) errs.deadline = "Must be a future date";
    setFormErrs(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) setStep(2);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) { handleNextStep(); return; }

    // Validate member addresses
    const errs: Record<string, string> = {};
    const validMembers = formMembers.filter((m) => m.addr.trim());
    validMembers.forEach((m, i) => {
      if (!isValidAddress(m.addr)) errs[`m_${i}`] = `Member ${i + 1}: invalid address`;
    });
    if (Object.keys(errs).length > 0) { setFormErrs(errs); return; }
    setFormErrs({});

    try {
      setCreating(true);

      // Create on-chain if contract is available
      let onChainId: number | undefined;
      if (CONTRACT_ADDRESSES.groupPayment && isConnected) {
        const hours = Math.ceil(
          (new Date(formDeadlineDate).getTime() - Date.now()) / 3600000
        );
        const opts: ExecuteOptions = {
          writeContractAsync: writeContractAsync as unknown as ExecuteOptions["writeContractAsync"],
          sendTransactionAsync: sendTransactionAsync as unknown as ExecuteOptions["sendTransactionAsync"],
        };
        await executeAction(
          {
            action: "createGroup",
            params: {
              recipient: formRecipient.trim(),
              targetAmount: Number(formTarget),
              description: formTitle.trim(),
              deadlineHours: Math.max(1, hours),
              token: "cUSD",
            },
          },
          opts
        );
        if (publicClient) {
          const cnt = await publicClient.readContract({
            address: CONTRACT_ADDRESSES.groupPayment!,
            abi: GROUP_PAYMENT_ABI,
            functionName: "groupCount",
          }) as bigint;
          onChainId = Number(cnt) - 1;
        }
      }

      const newGroup: LocalGroup = {
        id: createId(),
        title: formTitle.trim(),
        recipient: formRecipient.trim(),
        targetAmount: Number(formTarget),
        deadline: new Date(formDeadlineDate).toISOString(),
        members: validMembers.map((m) => ({ address: m.addr.trim(), name: m.name.trim() })),
        contributions: {},
        status: "active",
        createdAt: new Date().toISOString(),
        onChainId,
      };

      persist([newGroup, ...groups]);

      // Reset
      setFormTitle(""); setFormRecipient(""); setFormTarget("");
      setFormDeadlineDate(""); setFormMembers([{ addr: "", name: "" }]);
      setStep(1); setOpen(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create group";
      setFormErrs({ submit: errorMsg });
    } finally {
      setCreating(false);
    }
  };

  const addMember = () => setFormMembers((p) => [...p, { addr: "", name: "" }]);
  const removeMember = (i: number) => setFormMembers((p) => p.filter((_, idx) => idx !== i));
  const updateMember = (i: number, key: "addr" | "name", val: string) =>
    setFormMembers((p) => p.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));

  const closeModal = () => { if (!creating) { setOpen(false); setStep(1); setFormErrs({}); } };

  // ── Filtered lists ──
  const myActive = mounted
    ? groups.filter((g) => {
      if (g.status === "cancelled") return false;
      if (g.status === "done") return false;
      // eslint-disable-next-line react-hooks/purity
      const expired = new Date(g.deadline).getTime() <= Date.now();
      return !expired;
    })
    : [];

  const myDone = mounted
    ? groups.filter((g) =>
      g.status === "done" ||
      g.status === "cancelled" ||
      // eslint-disable-next-line react-hooks/purity
      new Date(g.deadline).getTime() <= Date.now()
    )
    : [];

  const doneList = [DEMO_GROUP, ...myDone];

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="page relative">
      <PageHeader
        title="Groups"
      />

      {/* ── Tabs ── */}
      <div className="tab-filter">
        <button className={`tab ${activeTab === "active" ? "active" : ""}`} onClick={() => setActiveTab("active")}>
          Active
        </button>
        <button className={`tab ${activeTab === "done" ? "active" : ""}`} onClick={() => setActiveTab("done")}>
          Done
        </button>
      </div>

      <main className="page-scroll content-area pb-4">
        {/* ── Active tab ── */}
        {activeTab === "active" && (
          <>
            {!isConnected ? (
              <article className="group-card text-center">
                <div className="flex flex-col items-center gap-4 py-8">
                  <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--color-secondary)", border: "3px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0 var(--border-color)" }}>
                    <Users size={30} strokeWidth={2.5} color="var(--color-surface)" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base uppercase tracking-wider text-[var(--border-color)] mb-1">
                      Group Savings
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                      Connect wallet to create or join group payment pools.
                    </p>
                  </div>
                  <button onClick={connect} className="px-6 h-11 flex items-center gap-2 bg-[var(--color-accent)] text-[var(--border-color)] border-[var(--border-width)] border-[var(--border-color)] rounded-[var(--border-radius)] font-bold uppercase text-sm shadow-[var(--shadow-offset)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                    Connect Wallet
                  </button>
                </div>
              </article>
            ) : myActive.length === 0 ? (
              <article className="group-card text-center">
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="schedule-icon secondary">
                    <Users size={20} strokeWidth={2.5} color="var(--color-surface)" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--border-color)]">No active groups</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium mt-1">
                      Start a group savings pool to pay or save together.
                    </p>
                  </div>
                  <button onClick={() => { setOpen(true); setStep(1); }} className="mt-1 px-5 h-10 flex items-center gap-1.5 bg-[var(--color-accent)] text-[var(--border-color)] border-[var(--border-width)] border-[var(--border-color)] rounded-[var(--border-radius)] font-bold uppercase text-sm shadow-[var(--shadow-offset)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                    <Plus size={14} strokeWidth={3} /> New Group
                  </button>
                </div>
              </article>
            ) : (
              <>
                {myActive.map((g) => (
                  <GroupCard
                    key={g.id}
                    group={g}
                    myAddress={address}
                    onContribute={handleContribute}
                    onFinalize={handleFinalize}
                    onCancel={handleCancel}
                  />
                ))}
              </>
            )}

            {isConnected && myActive.length > 0 && (
              <button
                type="button"
                onClick={() => { setOpen(true); setStep(1); }}
                className="w-full mt-4 flex items-center justify-center gap-2 h-14 bg-[var(--color-accent)] text-[var(--border-color)] border-[var(--border-width)] border-[var(--border-color)] rounded-[var(--border-radius)] font-bold uppercase tracking-wider text-sm shadow-[var(--shadow-offset)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <Plus size={18} strokeWidth={3} />
                New Group Pool
              </button>
            )}
          </>
        )}

        {/* ── Done tab ── */}
        {activeTab === "done" && (
          <>
            {doneList.map((g) => (
              <GroupCard
                key={g.id}
                group={g}
                myAddress={address}
                isDemo={g.id === "demo-1"}
              />
            ))}
          </>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          CREATE MODAL — 2-step
      ══════════════════════════════════════════════════════════════════════ */}
      {open && (
        <div className="modal-backdrop-ref">
          <div className="absolute inset-0" onClick={closeModal} />

          <div
            className="bottom-sheet-ref"
          >
            {/* ── Modal top bar ── */}
            <div className="modal-header-ref">
              <div className="modal-header-left-ref">
                <span className="step-indicator-dash-ref" />
                <span className="step-indicator-dot-ref" />
                <h2 className="modal-header-title-ref">
                  {step === 1 ? "1 — Group Details" : "2 — Add Members"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={creating}
                className="modal-close-btn-ref"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col min-h-0 flex-1">
              <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">

                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <>
                    {/* Error banner */}
                    {formErrs.submit && (
                      <div className="flex items-center gap-2 bg-[var(--color-danger)] text-white text-xs font-bold p-3 rounded-xl border-2 border-[var(--border-color)]">
                        <AlertCircle size={14} />
                        {formErrs.submit}
                      </div>
                    )}

                    <Field label="Group Name" error={formErrs.title}>
                      <input
                        autoFocus
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className={inp(formErrs.title) + " memphis-input-teal-ref"}
                        placeholder="e.g. Trip to Bali 🌴"
                        disabled={creating}
                      />
                    </Field>

                    <Field label="Recipient Wallet" hint="who gets the money" error={formErrs.recipient}>
                      <input
                        type="text"
                        value={formRecipient}
                        onChange={(e) => setFormRecipient(e.target.value)}
                        className={inp(formErrs.recipient)}
                        placeholder="0x..."
                        disabled={creating}
                      />
                    </Field>

                    <div className="input-row-ref">
                      <div style={{ flex: 1.1 }}><Field label="Target" hint="total cUSD" error={formErrs.target}>
                        <div className="input-wrapper-inner-ref">
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={formTarget}
                            onChange={(e) => setFormTarget(e.target.value)}
                            className={inp(formErrs.target) + " input-inner-field-ref"}
                            placeholder="0.00"
                            disabled={creating}
                          />
                          <span className="currency-badge-ref">
                            cUSD
                          </span>
                        </div>
                      </Field></div>

                      <div className=""><Field label="Deadline" error={formErrs.deadline}>
                        <input
                          type="date"
                          value={formDeadlineDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setFormDeadlineDate(e.target.value)}
                          className={inp(formErrs.deadline)}
                          disabled={creating}
                        />
                      </Field></div>
                    </div>

                    {/* Per-person preview card */}
                    {Number(formTarget) > 0 && formMembers.filter((m) => m.addr.trim()).length > 0 && (
                      <div className="flex items-center gap-3 bg-[var(--color-accent)] border-2 border-[var(--border-color)] rounded-2xl p-4">
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-surface)", border: "2px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Target size={18} strokeWidth={2.5} color="var(--border-color)" />
                        </div>
                        <div>
                          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--border-color)]">
                            Per Person
                          </div>
                          <div className="text-[18px] font-black text-[var(--border-color)] font-mono leading-tight">
                            {(Number(formTarget) / formMembers.filter((m) => m.addr.trim()).length).toFixed(2)}
                            <span className="text-[12px] ml-1">cUSD</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 text-[12px] font-semibold text-[var(--color-text-secondary)]">
                          Select participating members:
                        </p>
                        <p className="truncate text-[14px] font-extrabold text-[var(--border-color)]">
                          {formTitle || "Group"}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                          Target
                        </p>
                        <p className="font-black font-mono text-[var(--border-color)]">
                          {formTarget || "0"} cUSD
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Field label="Group Members" hint="invite friends" error={undefined}>
                        <div className="flex flex-col gap-2.5">
                          {formMembers.map((m, i) => (
                            <div key={i} className="rounded-[var(--border-radius)] border-2 border-[var(--border-color)] bg-[var(--color-surface)] p-3">
                              <div className="mb-2 flex items-center gap-2">
                                <div
                                  style={{ width: 28, height: 28, borderRadius: 8, background: "var(--color-accent)", border: "2px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 900, fontSize: 11, color: "var(--border-color)", boxShadow: "2px 2px 0 var(--border-color)" }}
                                >
                                  {i + 1}
                                </div>
                                <div className="grid flex-1 grid-cols-[1fr_auto] gap-2">
                                  <input
                                    type="text"
                                    value={m.name}
                                    onChange={(e) => updateMember(i, "name", e.target.value)}
                                    className="h-10 w-full rounded-lg border-2 border-[var(--border-color)] bg-[var(--color-surface)] px-3 text-[13px] font-semibold outline-none placeholder:text-[var(--color-text-tertiary)] placeholder:font-normal focus:border-[var(--color-secondary)]"
                                    placeholder="Name (optional)"
                                    disabled={creating}
                                  />
                                  {formMembers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeMember(i)}
                                      className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[var(--border-color)] bg-[var(--color-surface)] hover:bg-[var(--color-danger)] hover:text-white"
                                    >
                                      <Trash2 size={13} strokeWidth={2.5} />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={m.addr}
                                  onChange={(e) => updateMember(i, "addr", e.target.value)}
                                  className={
                                    inp(formErrs[`m_${i}`]) +
                                    " h-11 font-mono text-[12px] pr-10"
                                  }
                                  placeholder="0x... wallet address"
                                  disabled={creating}
                                />
                                {m.addr && (
                                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center ${isValidAddress(m.addr) ? "bg-[var(--color-secondary)]" : "bg-[var(--color-danger)]"}`}>
                                    {isValidAddress(m.addr)
                                      ? <Check size={8} strokeWidth={3} color="white" />
                                      : <X size={8} strokeWidth={3} color="white" />}
                                  </div>
                                )}
                              </div>
                              {formErrs[`m_${i}`] && (
                                <p className="text-[11px] font-bold text-[var(--color-danger)] flex items-center gap-1">
                                  <AlertCircle size={11} /> {formErrs[`m_${i}`]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Field>

                      <button
                        type="button"
                        onClick={addMember}
                        disabled={creating}
                        className="btn-ghost w-full border-dashed gap-2"
                      >
                        <UserPlus size={13} strokeWidth={2.5} />
                        Add Another Member
                      </button>

                      {/* Per-person summary */}
                      {Number(formTarget) > 0 && (
                        <div className="flex items-center justify-between rounded-[var(--border-radius)] border-2 border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--border-color)]">
                            Each pays
                          </span>
                          <span className="font-black font-mono text-[var(--border-color)] whitespace-nowrap">
                            {(
                              Number(formTarget) /
                              Math.max(1, formMembers.filter((m) => m.addr.trim()).length)
                            ).toFixed(2)}{" "}
                            cUSD
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="modal-footer-btns-ref">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={creating}
                    
                    className="btn-ghost"
                  >
                    ← Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={creating}
                    
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  style={{ backgroundColor: step === 2 ? "var(--color-primary)" : "var(--color-secondary)", color: "var(--color-surface)" }}
                  className="btn-ghost gap-2"
                >
                  {creating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : step === 1 ? (
                    <>Next — Add Members →</>
                  ) : (
                    <><Zap size={15} strokeWidth={2.5} /> Create Pool</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
