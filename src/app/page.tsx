"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  getSameFixtureAddOns,
  accessOptions,
  categories,
  conditionAdjustments,
  materialOptions,
  parkingOptions,
  pricingModes,
  serviceJobs,
  travelOptions,
  urgencyOptions,
  type PricingMode,
  type ServiceJob,
  type TradeStatus,
} from "@/lib/service-catalog";
import { calculateMultiJobQuote, calculateQuote, type CartJobInput } from "@/lib/pricing-engine";

const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

const tradeLabels: Record<TradeStatus, string> = {
  handyman_ok: "Handyman OK",
  caution: "Caution",
  licensed_required: "Licence required",
  do_not_accept: "Do not accept",
};

const tradeStyles: Record<TradeStatus, string> = {
  handyman_ok: "border-emerald-200 bg-emerald-50 text-emerald-950",
  caution: "border-amber-200 bg-amber-50 text-amber-950",
  licensed_required: "border-red-200 bg-red-50 text-red-950",
  do_not_accept: "border-zinc-300 bg-zinc-100 text-zinc-950",
};

const statusOptions: Array<{ id: "all" | TradeStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "handyman_ok", label: "Handyman OK" },
  { id: "caution", label: "Caution" },
  { id: "licensed_required", label: "Licence required" },
  { id: "do_not_accept", label: "Do not accept" },
];

type QuoteCartItem = {
  id: string;
  jobId: string;
  quantity: number;
  conditionId: string;
  materialId: string;
  materialCost: number;
  materialMarkupPercent: number;
  materialPickupFee: number;
  selectedAddOnIds: string[];
};

export default function Home() {
  const [jobId, setJobId] = useState(serviceJobs[0].id);
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TradeStatus>("all");
  const [query, setQuery] = useState("");
  const [onlyAcceptable, setOnlyAcceptable] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [pricingMode, setPricingMode] = useState<PricingMode>("solo_freelancer");
  const [conditionId, setConditionId] = useState("normal");
  const [travelId, setTravelId] = useState("normal");
  const [parkingId, setParkingId] = useState("none");
  const [accessId, setAccessId] = useState("easy");
  const [materialId, setMaterialId] = useState("client");
  const [materialCost, setMaterialCost] = useState(0);
  const [materialMarkupPercent, setMaterialMarkupPercent] = useState(0);
  const [materialPickupFee, setMaterialPickupFee] = useState(0);
  const [urgencyId, setUrgencyId] = useState("scheduled");
  const [hstPercent, setHstPercent] = useState(0);
  const [cart, setCart] = useState<QuoteCartItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [quoteNumber, setQuoteNumber] = useState(() => `Q-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-001`);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const counts = useMemo(
    () => serviceJobs.reduce((acc, item) => ({ ...acc, [item.tradeStatus]: acc[item.tradeStatus] + 1 }), { handyman_ok: 0, caution: 0, licensed_required: 0, do_not_accept: 0 } as Record<TradeStatus, number>),
    [],
  );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return serviceJobs.filter((item) => {
      const categoryMatch = category === "all" || item.category === category;
      const statusMatch = statusFilter === "all" || item.tradeStatus === statusFilter;
      const acceptableMatch = !onlyAcceptable || item.tradeStatus === "handyman_ok" || item.tradeStatus === "caution";
      const queryMatch = !q || `${item.category} ${item.name} ${item.stopConditions}`.toLowerCase().includes(q);
      return categoryMatch && statusMatch && acceptableMatch && queryMatch;
    });
  }, [category, onlyAcceptable, query, statusFilter]);

  const selectedJob = serviceJobs.find((item) => item.id === jobId) ?? serviceJobs[0];
  const job = filteredJobs.find((item) => item.id === selectedJob.id) ?? filteredJobs[0] ?? selectedJob;
  const condition = conditionAdjustments.find((item) => item.id === conditionId) ?? conditionAdjustments[1];
  const travel = travelOptions.find((item) => item.id === travelId) ?? travelOptions[1];
  const parking = parkingOptions.find((item) => item.id === parkingId) ?? parkingOptions[0];
  const access = accessOptions.find((item) => item.id === accessId) ?? accessOptions[0];
  const material = materialOptions.find((item) => item.id === materialId) ?? materialOptions[0];
  const urgency = urgencyOptions.find((item) => item.id === urgencyId) ?? urgencyOptions[0];
  const sameFixtureAddOns = getSameFixtureAddOns(job);
  const previewQuote = calculateQuote({
    job,
    pricingMode,
    quantity,
    conditionAmount: condition.amount,
    travelAmount: travel.amount,
    parkingAmount: parking.amount,
    accessAmount: access.amount,
    material,
    materialCost,
    materialMarkupPercent,
    materialPickupFee,
    urgency,
    selectedAddOnIds: selectedAddOns,
  });

  const cartInputs: CartJobInput[] = cart.map((item) => {
    const cartJob = serviceJobs.find((serviceJob) => serviceJob.id === item.jobId) ?? serviceJobs[0];
    const cartCondition = conditionAdjustments.find((option) => option.id === item.conditionId) ?? conditionAdjustments[1];
    return {
      id: item.id,
      job: cartJob,
      quantity: item.quantity,
      conditionLabel: cartCondition.label,
      conditionAmount: cartCondition.amount,
      materialCost: item.materialCost,
      materialMarkupPercent: item.materialMarkupPercent,
      materialPickupFee: item.materialPickupFee,
      selectedAddOnIds: item.selectedAddOnIds,
    };
  });

  const invoice = calculateMultiJobQuote({
    items: cartInputs,
    pricingMode,
    travelAmount: travel.amount,
    parkingAmount: parking.amount,
    accessAmount: access.amount,
    urgency,
    hstPercent,
  });

  function updateMaterialMode(nextMaterialId: string) {
    const next = materialOptions.find((item) => item.id === nextMaterialId) ?? materialOptions[0];
    setMaterialId(nextMaterialId);
    setMaterialMarkupPercent(next.defaultMarkupPercent);
    setMaterialPickupFee(next.defaultPickupFee);
    if (nextMaterialId === "client") setMaterialCost(0);
  }

  function updateJob(nextJobId: string) {
    const next = serviceJobs.find((item) => item.id === nextJobId);
    setJobId(nextJobId);
    setQuantity(next?.defaultQuantity ?? 1);
    setSelectedAddOns([]);
  }

  function addToQuote() {
    if (!previewQuote.isQuotable) return;
    setCart((current) => [
      ...current,
      {
        id: `${job.id}-${Date.now()}-${current.length}`,
        jobId: job.id,
        quantity,
        conditionId,
        materialId,
        materialCost,
        materialMarkupPercent,
        materialPickupFee,
        selectedAddOnIds: selectedAddOns,
      },
    ]);
    setSelectedAddOns([]);
  }

  function removeFromQuote(id: string) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function toggleAddOn(id: string) {
    setSelectedAddOns((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  const clientMessage = cart.length
    ? `Quote ${quoteNumber} for ${clientName || "client"}: ${currency.format(invoice.total)} total${hstPercent > 0 ? ` including ${hstPercent}% HST/tax` : " with no tax added"}. This covers ${invoice.jobLines.map((line) => line.job.name.toLowerCase()).join(", ")}, plus shared visit expenses once. Parts/materials are listed separately where supplied. If hidden damage, unsafe conditions, or licensed trade work appears, I will stop and confirm before doing anything extra.`
    : previewQuote.isQuotable
      ? `For ${quantity} ${job.unitLabel}${quantity === 1 ? "" : "s"} (${job.name.toLowerCase()}), I would be at ${currency.format(previewQuote.suggested)}. Add this to the quote if the client wants it included with other jobs.`
      : `I would not quote ${job.name.toLowerCase()} as handyman work. Refer it to the proper licensed, certified, or specialist trade.`;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Toronto freelancer pricing</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Handyman Price Guide</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Build a multi-job quote or invoice with quantity pricing, materials, shared visit expenses, and optional HST/tax.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-2">
              <CountPill label="OK" value={counts.handyman_ok} tone="emerald" />
              <CountPill label="Caution" value={counts.caution} tone="amber" />
              <CountPill label="Licence" value={counts.licensed_required} tone="red" />
              <CountPill label="Refer" value={counts.do_not_accept} tone="zinc" />
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(430px,0.95fr)]">
          <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-4 text-slate-950 shadow-xl sm:p-6">
            <div className="grid gap-3 xl:grid-cols-[1fr_220px]">
              <TextBox id="search" label="Search jobs" value={query} onChange={setQuery} placeholder="Try curtain, caulk, shower, deadbolt, screen..." />
              <SelectBox id="category" label="Category" value={category} onChange={setCategory} options={[{ id: "all", label: "All categories" }, ...categories.map((item) => ({ id: item, label: item }))]} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((item) => <PillButton key={item.id} active={statusFilter === item.id} onClick={() => setStatusFilter(item.id)}>{item.label}</PillButton>)}
                <PillButton active={onlyAcceptable} onClick={() => setOnlyAcceptable((current) => !current)} tone="cyan">{onlyAcceptable ? "Acceptable only" : "Only show jobs I can accept"}</PillButton>
              </div>
              <p className="mt-3 text-sm text-slate-500">Showing {filteredJobs.length} of {serviceJobs.length} researched jobs.</p>
            </div>

            <SelectBox id="job" label="Job type" value={job.id} onChange={updateJob} options={filteredJobs.map((item) => ({ id: item.id, label: `${item.category}: ${item.name}` }))} />

            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <QuantityBox value={quantity} setValue={setQuantity} unit={job.unitLabel} />
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                <p className="text-sm font-semibold text-cyan-950">Quantity rule</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{job.pricingUnit}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">Includes first {job.includedQuantity} {job.unitLabel}{job.includedQuantity === 1 ? "" : "s"}. Additional same-visit price: {job.additionalUnitPrice ? currency.format(job.additionalUnitPrice) : "manual quote"} each.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Pricing band</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {pricingModes.map((item) => (
                  <button key={item.id} type="button" className={`rounded-2xl border p-4 text-left transition ${pricingMode === item.id ? "border-cyan-600 bg-cyan-100" : "border-slate-200 bg-white hover:border-cyan-400"}`} onClick={() => setPricingMode(item.id)}>
                    <p className="font-bold">{item.label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.note}</p>
                    <p className="mt-3 text-sm font-semibold">Visit minimum {currency.format(item.minimumVisit)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SelectBox id="condition" label="Condition" value={conditionId} onChange={setConditionId} disabled={!previewQuote.isQuotable} note={condition.note} options={conditionAdjustments.map((item) => ({ id: item.id, label: `${item.label} (${signedMoney(item.amount)})` }))} />
              <SelectBox id="materials" label="Materials" value={materialId} onChange={updateMaterialMode} disabled={!previewQuote.isQuotable} note={material.note} options={materialOptions.map((item) => ({ id: item.id, label: item.label }))} />
              <SelectBox id="urgency" label="Visit urgency" value={urgencyId} onChange={setUrgencyId} options={urgencyOptions.map((item) => ({ id: item.id, label: item.type === "percent" ? `${item.label} (+${Math.round(item.amount * 100)}%)` : `${item.label} (+${currency.format(item.amount)})` }))} />
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-950">Same-fixture add-ons</p>
              <p className="mt-2 text-sm leading-6 text-blue-950">
                Use these when the extra work is on the same fixture during the same visit. Example: toilet tank replacement can also include a flush handle, toilet seat, fill valve, flush valve, or supply line. Sink jobs can bundle related faucet, PO plug, basket strainer, P-trap, supply line, and caulk work.
              </p>
              <div className="mt-3 grid gap-2">
                {sameFixtureAddOns.length ? sameFixtureAddOns.map((item) => (
                  <label key={item.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-slate-800">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedAddOns.includes(item.id)} disabled={!previewQuote.isQuotable} onChange={() => toggleAddOn(item.id)} />
                      <span>{item.label}</span>
                    </span>
                    <span className="font-bold">+{currency.format(item.price)}</span>
                  </label>
                )) : <p className="rounded-xl border border-dashed border-blue-200 bg-white p-3 text-sm text-slate-500">No related add-ons for this job yet. If it is a separate fixture, add it as another job in the cart.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-amber-900">Parts and materials reminder</p>
                  <p className="mt-2 text-sm leading-6 text-amber-950">If you supply parts, charge actual cost, plus markup, plus shopping or pickup time. Default for standard parts is 25% markup and a $40 pickup fee.</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-amber-950">This job: {currency.format(previewQuote.materialSubtotal)}</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <NumberBox id="material-cost" label="Material cost" value={materialCost} disabled={!previewQuote.isQuotable || materialId === "client"} onChange={setMaterialCost} prefix="$" />
                <NumberBox id="material-markup" label="Markup %" value={materialMarkupPercent} disabled={!previewQuote.isQuotable || materialId === "client"} onChange={setMaterialMarkupPercent} suffix="%" />
                <NumberBox id="pickup-fee" label="Pickup fee" value={materialPickupFee} disabled={!previewQuote.isQuotable || materialId === "client"} onChange={setMaterialPickupFee} prefix="$" />
              </div>
              <p className="mt-3 text-sm text-amber-950">Calculation: {currency.format(previewQuote.materialCost)} cost + {currency.format(previewQuote.materialMarkup)} markup + {currency.format(previewQuote.materialPickupFee)} pickup = {currency.format(previewQuote.materialSubtotal)}.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SelectBox id="travel" label="Shared travel" value={travelId} onChange={setTravelId} note={travel.note} options={travelOptions.map((item) => ({ id: item.id, label: `${item.label} (+${currency.format(item.amount)})` }))} />
              <SelectBox id="parking" label="Shared parking" value={parkingId} onChange={setParkingId} options={parkingOptions.map((item) => ({ id: item.id, label: `${item.label} (+${currency.format(item.amount)})` }))} />
              <SelectBox id="access" label="Shared access" value={accessId} onChange={setAccessId} note={access.note} options={accessOptions.map((item) => ({ id: item.id, label: `${item.label} (+${currency.format(item.amount)})` }))} />
            </div>

            <StatusCard job={job} />

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <button type="button" onClick={addToQuote} disabled={!previewQuote.isQuotable} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300">Add this job to quote</button>
              <p className="text-sm text-slate-600">Preview for this job alone: <span className="font-bold text-slate-950">{previewQuote.isQuotable ? currency.format(previewQuote.suggested) : "Referral only"}</span></p>
            </div>
          </section>

          <aside className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">
            <div className="rounded-3xl bg-cyan-300 p-5 text-slate-950">
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">Quote / invoice total</p>
              <p className="mt-3 text-5xl font-black">{currency.format(invoice.total)}</p>
              <p className="mt-3 text-sm font-medium">Subtotal {currency.format(invoice.subtotal)} {hstPercent > 0 ? `+ HST/tax ${currency.format(invoice.tax)}` : "+ no tax added"}</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <h2 className="font-semibold text-cyan-200">Client and tax</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <DarkTextBox id="client-name" label="Client name" value={clientName} onChange={setClientName} placeholder="Client" />
                <DarkTextBox id="quote-number" label="Quote/invoice #" value={quoteNumber} onChange={setQuoteNumber} placeholder="Q-001" />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_140px]">
                <DarkTextBox id="client-address" label="Job address" value={clientAddress} onChange={setClientAddress} placeholder="Toronto address" />
                <NumberBox id="hst-percent" label="HST / tax %" value={hstPercent} onChange={setHstPercent} suffix="%" dark />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-cyan-200">Job cart</h2>
                {cart.length ? <button type="button" onClick={() => setCart([])} className="text-xs font-bold text-red-300">Clear</button> : null}
              </div>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                {invoice.jobLines.length ? invoice.jobLines.map((line) => (
                  <div key={line.id} className="rounded-2xl bg-slate-900 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-100">{line.job.name}</p>
                        <p className="mt-1 text-slate-400">{line.quantity} {line.job.unitLabel}{line.quantity === 1 ? "" : "s"}, {line.conditionLabel}</p>
                        {line.addOnLabels.length ? <p className="mt-1 text-slate-400">Same-fixture add-ons: {line.addOnLabels.join(", ")} ({currency.format(line.addOns)})</p> : null}
                        {line.materialSubtotal > 0 ? <p className="mt-1 text-slate-400">Materials: {currency.format(line.materialCost)} + {currency.format(line.materialMarkup)} markup + {currency.format(line.materialPickupFee)} pickup</p> : null}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-cyan-200">{currency.format(line.lineSubtotal)}</p>
                        <button type="button" className="mt-2 text-xs font-bold text-red-300" onClick={() => removeFromQuote(line.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                )) : <p className="rounded-2xl border border-dashed border-slate-700 p-4 text-slate-400">Add jobs to build a quote. Shared travel, parking, access, urgency, and HST apply once.</p>}
              </div>
              {invoice.hasBlockedJobs ? <p className="mt-3 rounded-xl bg-red-950 p-3 text-sm text-red-100">Blocked jobs were excluded: {invoice.blockedJobNames.join(", ")}</p> : null}
            </div>

            <QuoteTotals invoice={invoice} />

            <div className="no-print flex flex-wrap gap-3">
              <button type="button" onClick={() => window.print()} disabled={!cart.length} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
                Print / save PDF invoice
              </button>
              <button type="button" onClick={() => navigator.clipboard?.writeText(clientMessage)} className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-400">
                Copy client message
              </button>
            </div>

            <div className="invoice-print rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <h2 className="font-semibold text-cyan-200">Quote / invoice preview</h2>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <p><span className="text-slate-500">Client:</span> {clientName || "Client"}</p>
                <p><span className="text-slate-500">Address:</span> {clientAddress || "Job address"}</p>
                <p><span className="text-slate-500">Number:</span> {quoteNumber}</p>
                <p><span className="text-slate-500">Date:</span> {new Date().toLocaleDateString("en-CA")}</p>
              </div>
              <div className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-300">
                {invoice.lineItems.length ? invoice.lineItems.map((item) => <div key={item.label} className="flex justify-between gap-4 py-1"><span>{item.label}</span><span className="font-bold text-slate-100">{currency.format(item.amount)}</span></div>) : <p>Add jobs before printing.</p>}
              </div>
              <div className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-300">
                <div className="flex justify-between gap-4 py-1"><span>Subtotal</span><span className="font-bold text-slate-100">{currency.format(invoice.subtotal)}</span></div>
                <div className="flex justify-between gap-4 py-1"><span>HST/tax ({hstPercent}%)</span><span className="font-bold text-slate-100">{currency.format(invoice.tax)}</span></div>
                <div className="flex justify-between gap-4 py-2 text-lg"><span className="font-black">Total</span><span className="font-black text-cyan-200">{currency.format(invoice.total)}</span></div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">Notes: Quote assumes visible scope only. Hidden damage, unsafe conditions, incorrect parts, or licensed trade work may change the price or require referral.</p>
            </div>

            <InfoBlock title="Client message" items={[clientMessage]} />
            <MarketCards job={job} />
            <InfoBlock title="Stop or refer if selected job has" items={[job.stopConditions]} danger />
          </aside>
        </div>
      </section>
    </main>
  );
}

function signedMoney(value: number) {
  if (value === 0) return currency.format(0);
  return `${value > 0 ? "+" : ""}${currency.format(value)}`;
}

function PillButton({ children, active, onClick, tone = "slate" }: { children: ReactNode; active: boolean; onClick: () => void; tone?: "slate" | "cyan" }) {
  const activeClass = tone === "cyan" ? "border-cyan-700 bg-cyan-100 text-cyan-950" : "border-slate-950 bg-slate-950 text-white";
  return <button type="button" className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? activeClass : "border-slate-300 bg-white text-slate-700 hover:border-cyan-500"}`} onClick={onClick}>{children}</button>;
}

function SelectBox({ id, label, value, disabled, options, note, onChange }: { id: string; label: string; value: string; disabled?: boolean; options: Array<{ id: string; label: string }>; note?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={id}>{label}</label>
      <select id={id} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-cyan-500 transition focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
        {options.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      {note ? <p className="mt-2 text-sm text-slate-500">{note}</p> : null}
    </div>
  );
}

function TextBox({ id, label, value, placeholder, onChange }: { id: string; label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700" htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-cyan-500 transition focus:ring-2" />
    </div>
  );
}

function DarkTextBox({ id, label, value, placeholder, onChange }: { id: string; label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-300" htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none ring-cyan-500 transition focus:ring-2" />
    </div>
  );
}

function QuantityBox({ value, setValue, unit }: { value: number; setValue: (value: number | ((current: number) => number)) => void; unit: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <label className="text-sm font-semibold text-slate-700" htmlFor="quantity">Quantity</label>
      <div className="mt-2 flex items-center gap-2">
        <button className="rounded-xl border border-slate-300 px-3 py-2 font-bold" type="button" onClick={() => setValue((current) => Math.max(1, current - 1))}>−</button>
        <input id="quantity" type="number" min={1} value={value} onChange={(event) => setValue(Math.max(1, Number(event.target.value) || 1))} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-center text-lg font-bold outline-none ring-cyan-500 focus:ring-2" />
        <button className="rounded-xl border border-slate-300 px-3 py-2 font-bold" type="button" onClick={() => setValue((current) => current + 1)}>+</button>
      </div>
      <p className="mt-2 text-xs text-slate-500">Unit: {unit}</p>
    </div>
  );
}

function NumberBox({ id, label, value, disabled, prefix, suffix, dark = false, onChange }: { id: string; label: string; value: number; disabled?: boolean; prefix?: string; suffix?: string; dark?: boolean; onChange: (value: number) => void }) {
  return (
    <div>
      <label className={`text-sm font-semibold ${dark ? "text-slate-300" : "text-amber-950"}`} htmlFor={id}>{label}</label>
      <div className={`mt-2 flex items-center rounded-2xl border px-3 py-2 focus-within:ring-2 ${dark ? "border-slate-700 bg-slate-900 focus-within:ring-cyan-500" : "border-amber-200 bg-white focus-within:ring-amber-400"}`}>
        {prefix ? <span className="text-sm font-bold opacity-80">{prefix}</span> : null}
        <input id={id} type="number" min={0} value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} disabled={disabled} className={`w-full bg-transparent px-2 text-base font-bold outline-none disabled:text-slate-400 ${dark ? "text-slate-100" : "text-slate-950"}`} />
        {suffix ? <span className="text-sm font-bold opacity-80">{suffix}</span> : null}
      </div>
    </div>
  );
}

function CountPill({ label, value, tone }: { label: string; value: number; tone: "emerald" | "amber" | "red" | "zinc" }) {
  const tones = { emerald: "border-emerald-800 bg-emerald-950 text-emerald-200", amber: "border-amber-800 bg-amber-950 text-amber-200", red: "border-red-800 bg-red-950 text-red-200", zinc: "border-zinc-700 bg-zinc-900 text-zinc-200" };
  return <div className={`rounded-2xl border px-4 py-3 ${tones[tone]}`}><p className="text-xs uppercase tracking-wide opacity-80">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}

function StatusCard({ job }: { job: ServiceJob }) {
  return (
    <div className={`rounded-2xl border p-4 ${tradeStyles[job.tradeStatus]}`}>
      <div className="flex flex-wrap items-center gap-3"><p className="text-sm font-semibold uppercase tracking-wide">Trade status</p><span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wide">{tradeLabels[job.tradeStatus]}</span></div>
      <p className="mt-2 text-sm leading-6">{job.tradeStatus === "caution" ? "Quote only if it stays within simple visible handyman scope." : job.tradeStatus === "handyman_ok" ? "Ordinary handyman scope, with stop conditions still checked." : "Referral only. Keep this visible because clients ask, but do not quote it as accepted work."}</p>
    </div>
  );
}

function QuoteTotals({ invoice }: { invoice: ReturnType<typeof calculateMultiJobQuote> }) {
  const rows = [
    ["Labour subtotal", invoice.labourSubtotal],
    ["Visit minimum adjustment", invoice.visitMinimumAdjustment],
    ["Materials subtotal", invoice.materialSubtotal],
    ["Shared travel, parking, access", invoice.logistics],
    ["Urgency", invoice.rush],
    ["Subtotal", invoice.subtotal],
    ["HST/tax", invoice.tax],
    ["Total", invoice.total],
  ] as const;
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
      <h2 className="font-semibold text-cyan-200">Quote math</h2>
      <div className="mt-3 space-y-2 text-sm text-slate-300">
        {rows.map(([label, amount]) => <div key={label} className="flex justify-between gap-4 rounded-xl bg-slate-900 px-3 py-2"><span>{label}</span><span className="font-bold text-slate-100">{currency.format(amount)}</span></div>)}
      </div>
    </div>
  );
}

function MarketCards({ job }: { job: ServiceJob }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs">
      {pricingModes.map((mode) => <div key={mode.id} className={`rounded-2xl border p-3 ${mode.id === "solo_freelancer" ? "border-cyan-400 bg-cyan-950 text-cyan-100" : "border-slate-700 bg-slate-950 text-slate-300"}`}><p className="font-semibold">{mode.label}</p><p className="mt-2 leading-5">{currency.format(job.pricing[mode.id].low)} to {currency.format(job.pricing[mode.id].high)}</p><p className="mt-1 text-slate-400">Target {currency.format(job.pricing[mode.id].target)}</p></div>)}
    </div>
  );
}

function InfoBlock({ title, items, danger = false }: { title: string; items: string[]; danger?: boolean }) {
  return <div className={`rounded-2xl border p-4 ${danger ? "border-red-900 bg-red-950/40" : "border-slate-700 bg-slate-950"}`}><h2 className={`font-semibold ${danger ? "text-red-200" : "text-cyan-200"}`}>{title}</h2><ul className={`mt-3 space-y-2 text-sm leading-6 ${danger ? "text-red-100" : "text-slate-300"}`}>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
