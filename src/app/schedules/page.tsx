"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CalendarDays,
  Pencil,
  Plus,
  Trash2,
  Zap,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

type Cadence = "One-time" | "Day" | "Week" | "Month";

type Schedule = {
  id: string;
  title: string;
  amount: string;
  target: string;
  date: string;
  time: string;
  cadence: Cadence;
};

type ScheduleFormData = {
  title: string;
  amount: string;
  target: string;
  date: string;
  time: string;
  cadence: Cadence;
};

const STORAGE_KEY = "agent-pay-schedules";

const emptyForm: ScheduleFormData = {
  title: "",
  amount: "",
  target: "",
  date: "",
  time: "12:00",
  cadence: "One-time",
};

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `schedule-${Date.now()}`;
}

function formatNextDate(date: string, time?: string) {
  if (!date) return "TBA";
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date.toUpperCase();
  
  const parsedDate = new Date(year, month - 1, day);
  let timeStr = "";
  
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    parsedDate.setHours(hours, minutes);
    timeStr = " AT " + parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  return (
    parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    }).toUpperCase() + timeStr.toUpperCase()
  );
}

function formatCadence(cadence: Cadence) {
  if (cadence === "One-time") return "once.";
  return `every ${cadence.toLowerCase()}.`;
}

function normalizeAmount(amount: string) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "0.00";
  return value.toFixed(2);
}

function isValidAddress(address: string) {
  const clean = address.trim();
  if (
    clean.toLowerCase().endsWith(".eth") ||
    clean.toLowerCase().endsWith(".celo")
  )
    return true;
  return /^0x[a-fA-F0-9]{40}$/.test(clean);
}

function isPastDateTime(dateStr: string, timeStr: string) {
  if (!dateStr) return false;
  const today = new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  if (timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    dateObj.setHours(hours, minutes, 0, 0);
  } else {
    dateObj.setHours(23, 59, 59, 999);
  }
  
  return dateObj < today;
}

/* ─── Field wrapper ─────────────────────────────────────────────── */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="input-group-ref">
      <label className="input-label-ref">
        <span>{label}</span>
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-danger)] mt-1 pl-1">
          <AlertCircle size={14} strokeWidth={2.5} />
          {error}
        </span>
      )}
    </div>
  );
}

/* ─── Shared input class ────────────────────────────────────────── */
const inputCls = (error?: string) =>
  [
    "memphis-input-ref",
    error ? "border-[var(--color-danger)]" : "",
  ].filter(Boolean).join(" ");

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScheduleFormData>(emptyForm);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState({ target: "", date: "" });

  const isEditing = editingScheduleId !== null;

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSchedules(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load schedules:", e);
    } finally {
      setIsStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageReady) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules, isStorageReady]);

  const openCreateModal = () => {
    setEditingScheduleId(null);
    setFormData(emptyForm);
    setErrors({ target: "", date: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Schedule) => {
    setEditingScheduleId(s.id);
    setFormData({
      title: s.title,
      amount: s.amount,
      target: s.target,
      date: s.date,
      time: s.time || "12:00",
      cadence: s.cadence,
    });
    setErrors({ target: "", date: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingScheduleId(null);
    setFormData(emptyForm);
    setErrors({ target: "", date: "" });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addrOk = isValidAddress(formData.target);
    const pastOk = isPastDateTime(formData.date, formData.time);
    const newErrs = {
      target: addrOk ? "" : "Invalid address or ENS.",
      date: pastOk ? "Date/time cannot be in the past." : "",
    };
    if (!addrOk || pastOk) {
      setErrors(newErrs);
      return;
    }
    setErrors({ target: "", date: "" });

    const payload: Schedule = {
      id: editingScheduleId ?? createId(),
      title: formData.title.trim(),
      amount: normalizeAmount(formData.amount),
      target: formData.target.trim(),
      date: formData.date,
      time: formData.time,
      cadence: formData.cadence,
    };

    if (isEditing) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingScheduleId ? payload : s))
      );
    } else {
      setSchedules((prev) => [payload, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this schedule?")) return;
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  /* ─── Loading skeleton ──────────────────────────────────────────── */
  if (!mounted) {
    return (
      <div className="page">
        <PageHeader title="Schedules" />
        <main className="page-scroll content-area">
          <div className="animate-pulse flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-[var(--color-surface)] border-[var(--border-width)] border-[var(--border-color)] rounded-[var(--border-radius)] opacity-60"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page relative">
      <PageHeader title="Schedules" />

      <main className="page-scroll content-area">
        {/* ── Schedule cards ── */}
        {schedules.length === 0 ? (
          <article className="schedule-card text-center">
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="schedule-icon secondary">
                <CalendarDays size={22} strokeWidth={2.5} color="var(--color-surface)" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--border-color)]">
                  No schedules yet
                </h3>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
                  Create your first scheduled crypto payment.
                </p>
              </div>
            </div>
          </article>
        ) : (
          schedules.map((schedule) => (
            <article className="schedule-card" key={schedule.id}>
              <div className="schedule-header">
                <div className="schedule-title">
                  <div className="schedule-icon secondary">
                    <CalendarDays size={20} strokeWidth={2.5} color="var(--color-surface)" />
                  </div>
                  {schedule.title}
                </div>
                <div className="badge active">Active</div>
              </div>

              <div className="schedule-details">
                Send{" "}
                <span className="mono font-bold text-[var(--border-color)]">
                  {schedule.amount} cUSD
                </span>{" "}
                to <span className="mono">{schedule.target}</span>{" "}
                {formatCadence(schedule.cadence)}
              </div>

              <div className="schedule-footer">
                <div className="next-run secondary">
                  NEXT: {formatNextDate(schedule.date, schedule.time)}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => openEditModal(schedule)}
                  >
                    <Pencil size={14} strokeWidth={3} className="mr-1" /> Edit
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => handleDelete(schedule.id)}
                  >
                    <Trash2 size={14} strokeWidth={3} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}

        {/* ── New + button below list ── */}
        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] text-sm font-bold uppercase tracking-wider text-[var(--border-color)] shadow-[var(--shadow-offset)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--border-color)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <Plus size={20} strokeWidth={3} />
          New Schedule
        </button>
      </main>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="modal-backdrop-ref">
          <div className="absolute inset-0" onClick={closeModal} />

          <div
            className="bottom-sheet-ref"
          >
            {/* ── Header ── */}
            <div className="modal-header-ref">
              <div className="modal-header-left-ref">
                <div className="modal-header-icon-ref">
                  <CalendarDays size={18} strokeWidth={2.5} />
                </div>
                <h2 className="modal-header-title-ref">
                  {isEditing ? "Edit Schedule" : "New Schedule"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn-ref"
              >
                ✕
              </button>
            </div>

            {/* ── Form body ── */}
            <form onSubmit={handleSubmit}>
              <div>
                {/* Title */}
                <Field label="Title">
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={inputCls()}
                    placeholder="e.g. Weekly Savings"
                  />
                </Field>

                {/* Amount */}
                <Field label="Amount">
                  <div className="input-wrapper-inner-ref">
                    <input
                      required
                      min="0.01"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className={inputCls() + " input-inner-field-ref"}
                      placeholder="0.00"
                    />
                    <div className="currency-badge-ref">
                      cUSD
                    </div>
                  </div>
                </Field>

                {/* Target */}
                <Field label="Target Wallet / ENS" error={errors.target}>
                  <input
                    required
                    type="text"
                    value={formData.target}
                    onChange={(e) => {
                      setFormData({ ...formData, target: e.target.value });
                      setErrors({ ...errors, target: "" });
                    }}
                    className={inputCls(errors.target) + " font-mono text-[14px]"}
                    placeholder="0x... or name.eth"
                  />
                </Field>

                {/* Date + Time side by side */}
                <div className="input-row-ref">
                  <Field label="Start Date" error={errors.date}>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        setErrors({ ...errors, date: "" });
                      }}
                      className={inputCls(errors.date)}
                    />
                  </Field>

                  <Field label="Start Time">
                    <input
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className={inputCls()}
                    />
                  </Field>
                </div>

                {/* Repeat */}
                <Field label="Repeat">
                  <div className="relative">
                    <select
                      value={formData.cadence}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cadence: e.target.value as Cadence,
                        })
                      }
                      className="memphis-select-ref"
                    >
                      <option value="One-time">One-time</option>
                      <option value="Day">Daily</option>
                      <option value="Week">Weekly</option>
                      <option value="Month">Monthly</option>
                    </select>
                  </div>
                </Field>
              </div>

              {/* ── Submit footer ── */}
              <div className="mt-[26px] flex shrink-0 gap-3 bg-[var(--color-surface)]">
                <button
                  type="button"
                  onClick={closeModal}

                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
style={{ backgroundColor: "var(--color-primary)", color: "var(--color-surface)" }}
                  className="btn-ghost"
                >
                  <Zap size={16} strokeWidth={3} />
                  {isEditing ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}