"use client";

import { useState } from "react";

type Props = {
  onSave: () => Promise<void>;
  onNew: () => void;
  onShowHistory: () => void;
  currentQuoteId: number | null;
  quoteStatus: string;
  setQuoteStatus: (status: string) => void;
};

const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

export default function SaveLoadQuote({ onSave, onNew, onShowHistory, currentQuoteId, quoteStatus, setQuoteStatus }: Props) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
      <h2 className="font-semibold text-cyan-200">Quote Management</h2>
      
      <div className="mt-3">
        <label className="text-sm font-semibold text-slate-300">Status</label>
        <select
          value={quoteStatus}
          onChange={(e) => setQuoteStatus(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100"
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {saving ? "Saving..." : currentQuoteId ? "Update Quote" : "Save Quote"}
        </button>
        <button
          type="button"
          onClick={onNew}
          className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
        >
          New Quote
        </button>
        <button
          type="button"
          onClick={onShowHistory}
          className="rounded-2xl border border-cyan-600 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-950"
        >
          View History
        </button>
      </div>

      {currentQuoteId && (
        <p className="mt-3 text-xs text-slate-500">
          Editing quote ID: {currentQuoteId}
        </p>
      )}
    </div>
  );
}
