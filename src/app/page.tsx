"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
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
import { roomCategories, findJobLocation, getRoomJobIds } from "@/lib/room-categories";
import { calculateMultiJobQuote, calculateQuote, type CartJobInput } from "@/lib/pricing-engine";
import * as api from "@/lib/api-client";

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
  location: string; // Track which room/area
};

export default function Home() {
  const [jobId, setJobId] = useState(serviceJobs[0].id);
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
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
  
  // Database features
  const [currentQuoteId, setCurrentQuoteId] = useState<number | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<string>("draft");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showReports, setShowReports] = useState(false);

  useEffect(() => {
    loadClients();
    loadQuotes();
    loadCompletions();
  }, []);

  async function loadClients() {
    try {
      const data = await api.fetchClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  }

  async function loadQuotes() {
    try {
      const data = await api.fetchQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Error loading quotes:", error);
    }
  }

  async function loadCompletions() {
    try {
      const data = await api.fetchCompletions();
      setCompletions(data);
    } catch (error) {
      console.error("Error loading completions:", error);
    }
  }

  const counts = useMemo(
    () => serviceJobs.reduce((acc, item) => ({ ...acc, [item.tradeStatus]: acc[item.tradeStatus] + 1 }), { handyman_ok: 0, caution: 0, licensed_required: 0, do_not_accept: 0 } as Record<TradeStatus, number>),
    [],
  );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    const roomJobIds = getRoomJobIds(selectedRoom, selectedArea);
    
    return serviceJobs.filter((item) => {
      const roomMatch = selectedRoom === "all" || roomJobIds.includes(item.id);
      const categoryMatch = category === "all" || item.category === category;
      const statusMatch = statusFilter === "all" || item.tradeStatus === statusFilter;
      const acceptableMatch = !onlyAcceptable || item.tradeStatus === "handyman_ok" || item.tradeStatus === "caution";
      const queryMatch = !q || `${item.category} ${item.name} ${item.stopConditions}`.toLowerCase().includes(q);
      return roomMatch && categoryMatch && statusMatch && acceptableMatch && queryMatch;
    });
  }, [selectedRoom, selectedArea, category, onlyAcceptable, query, statusFilter]);

  const job = filteredJobs.find((item) => item.id === jobId) ?? filteredJobs[0] ?? serviceJobs[0];
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
    if (!next) return;
    setJobId(nextJobId);
    setQuantity(next.defaultQuantity);
    setSelectedAddOns([]);
  }

  function selectRoom(nextRoomId: string) {
    setSelectedRoom(nextRoomId);
    setSelectedArea(null);
    setSelectedAddOns([]);

    const nextJobId = getRoomJobIds(nextRoomId).find((id) => serviceJobs.some((job) => job.id === id));
    if (nextJobId) updateJob(nextJobId);
  }

  function selectArea(nextAreaId: string | null) {
    setSelectedArea(nextAreaId);
    setSelectedAddOns([]);

    const nextJobId = getRoomJobIds(selectedRoom, nextAreaId).find((id) => serviceJobs.some((job) => job.id === id));
    if (nextJobId) updateJob(nextJobId);
  }

  function addToQuote() {
    if (!previewQuote.isQuotable) return;
    
    const room = roomCategories.find((item) => item.id === selectedRoom);
    const area = room?.areas.find((item) => item.id === selectedArea);
    const locationLabel = room
      ? `${room.name} - ${area?.name ?? "General"}`
      : "All Rooms / Unassigned";
    
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
        location: locationLabel,
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

  async function saveQuote() {
    try {
      const quoteData = {
        quoteNumber,
        clientId: selectedClientId,
        clientName,
        clientAddress,
        status: quoteStatus,
        pricingMode,
        travelAmount: travel.amount,
        parkingAmount: parking.amount,
        accessAmount: access.amount,
        urgencyType: urgency.type,
        urgencyAmount: urgency.amount,
        hstPercent,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
      };

      const items = cartInputs.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        return {
          jobId: item.job.id,
          jobName: item.job.name,
          jobCategory: item.job.category,
          quantity: item.quantity,
          conditionId: cartItem?.conditionId || "normal",
          conditionLabel: item.conditionLabel,
          conditionAmount: item.conditionAmount,
          materialId: cartItem?.materialId || "client",
          materialCost: item.materialCost,
          materialMarkupPercent: item.materialMarkupPercent,
          materialPickupFee: item.materialPickupFee,
          selectedAddOnIds: JSON.stringify(item.selectedAddOnIds),
          location: cartItem?.location || "Other",
          lineSubtotal: invoice.jobLines.find((line) => line.id === item.id)?.lineSubtotal ?? 0,
        };
      });

      if (currentQuoteId) {
        await api.updateQuote(currentQuoteId, { quote: quoteData, items });
        alert("Quote updated successfully!");
      } else {
        const saved = await api.createQuote({ quote: quoteData, items });
        setCurrentQuoteId(saved.id);
        alert("Quote saved successfully!");
      }
      
      await loadQuotes();
    } catch (error) {
      console.error("Error saving quote:", error);
      alert("Failed to save quote. Make sure you have items in the cart.");
    }
  }

  async function loadQuote(quoteId: number) {
    try {
      const { quote, items } = await api.fetchQuote(quoteId);
      
      setQuoteNumber(quote.quoteNumber);
      setClientName(quote.clientName);
      setClientAddress(quote.clientAddress || "");
      setSelectedClientId(quote.clientId);
      setPricingMode(quote.pricingMode);
      setHstPercent(quote.hstPercent);
      setQuoteStatus(quote.status);
      setCurrentQuoteId(quote.id);
      
      // Find travel, parking, access options
      const foundTravel = travelOptions.find(opt => opt.amount === quote.travelAmount);
      const foundParking = parkingOptions.find(opt => opt.amount === quote.parkingAmount);
      const foundAccess = accessOptions.find(opt => opt.amount === quote.accessAmount);
      
      if (foundTravel) setTravelId(foundTravel.id);
      if (foundParking) setParkingId(foundParking.id);
      if (foundAccess) setAccessId(foundAccess.id);
      
      const loadedCart = items.map((item: any) => {
        return {
          id: `${item.jobId}-${item.id}`,
          jobId: item.jobId,
          quantity: item.quantity,
          conditionId: item.conditionId,
          materialId: item.materialId || "client",
          materialCost: item.materialCost,
          materialMarkupPercent: item.materialMarkupPercent,
          materialPickupFee: item.materialPickupFee,
          selectedAddOnIds: JSON.parse(item.selectedAddOnIds || "[]"),
          location: item.location || "Other",
        };
      });
      
      setCart(loadedCart);
      setShowHistory(false);
      alert("Quote loaded successfully!");
    } catch (error) {
      console.error("Error loading quote:", error);
      alert("Failed to load quote");
    }
  }

  async function newQuote() {
    setCart([]);
    setClientName("");
    setClientAddress("");
    setSelectedClientId(null);
    setCurrentQuoteId(null);
    setQuoteStatus("draft");
    setShowHistory(false);
    
    // Generate next quote number
    try {
      const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
      const todayQuotes = quotes.filter(q => q.quoteNumber.startsWith(`Q-${today}`));
      const nextNum = todayQuotes.length + 1;
      setQuoteNumber(`Q-${today}-${String(nextNum).padStart(3, "0")}`);
    } catch (error) {
      console.error("Error generating quote number:", error);
      setQuoteNumber(`Q-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-001`);
    }
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
            <div className="rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-950">Step 1: Where are you working?</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[{ id: "all", name: "All Rooms", icon: "🔍" }, ...roomCategories].map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => selectRoom(room.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${
                      selectedRoom === room.id
                        ? "border-cyan-600 bg-cyan-600 text-white shadow-lg"
                        : "border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:bg-cyan-50"
                    }`}
                  >
                    <span className="text-2xl">{room.icon}</span>
                    <span className="text-sm">{room.name}</span>
                  </button>
                ))}
              </div>

              {selectedRoom && selectedRoom !== "all" && (() => {
                const room = roomCategories.find(r => r.id === selectedRoom);
                return room ? (
                  <div className="mt-4">
                    <p className="text-sm font-bold uppercase tracking-wide text-cyan-950">Step 2: What area/fixture?</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => selectArea(null)}
                        className={`rounded-xl border-2 px-4 py-2 text-left text-sm font-semibold transition ${
                          selectedArea === null
                            ? "border-cyan-600 bg-cyan-100 text-cyan-950"
                            : "border-slate-200 bg-white text-slate-600 hover:border-cyan-400"
                        }`}
                      >
                        All {room.name} Jobs
                      </button>
                      {room.areas.map((area) => (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => selectArea(area.id)}
                          className={`rounded-xl border-2 px-4 py-2 text-left text-sm font-semibold transition ${
                            selectedArea === area.id
                              ? "border-cyan-600 bg-cyan-100 text-cyan-950"
                              : "border-slate-200 bg-white text-slate-600 hover:border-cyan-400"
                          }`}
                        >
                          {area.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="grid gap-3 xl:grid-cols-[1fr_220px]">
              <TextBox id="search" label="Quick search (optional)" value={query} onChange={setQuery} placeholder="Search within selected area..." />
              <SelectBox id="category" label="Filter by type" value={statusFilter} onChange={(val) => setStatusFilter(val as any)} options={statusOptions.map((item) => ({ id: item.id, label: item.label }))} />
            </div>

            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-950">Step 3: Select specific job</p>
              <p className="mt-1 text-xs text-blue-800">Showing {filteredJobs.length} jobs in this area</p>
              <select 
                id="job" 
                value={filteredJobs.length ? job.id : ""}
                onChange={(e) => updateJob(e.target.value)}
                disabled={filteredJobs.length === 0}
                className="mt-3 w-full rounded-xl border-2 border-blue-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none ring-blue-500 transition focus:ring-2"
              >
                {filteredJobs.length === 0 ? <option value="">No jobs match these filters</option> : null}
                {filteredJobs.map((item) => {
                  const location = findJobLocation(item.id);
                  const displayName = location 
                    ? `${item.name}` 
                    : `${item.name}`;
                  return (
                    <option key={item.id} value={item.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              
              {job.imageUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border-2 border-blue-200">
                  <img 
                    src={job.imageUrl} 
                    alt={job.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${tradeStyles[job.tradeStatus]}`}>
                  {tradeLabels[job.tradeStatus]}
                </span>
              </div>
            </div>

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
                These options are specific to the selected job and refresh when Step 3 changes. Use them only when the extra work is on that same toilet, sink, door, closet door, or screen during this visit.
              </p>
              <div key={job.id} className="mt-3 grid gap-2">
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
              {clients.length > 0 && (
                <div className="mt-3">
                  <label className="text-sm font-semibold text-slate-300">Select existing client (optional)</label>
                  <select
                    value={selectedClientId || ""}
                    onChange={(e) => {
                      const id = e.target.value ? Number(e.target.value) : null;
                      setSelectedClientId(id);
                      if (id) {
                        const client = clients.find(c => c.id === id);
                        if (client) {
                          setClientName(client.name);
                          setClientAddress(client.address || "");
                        }
                      }
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100"
                  >
                    <option value="">New client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
              
              {cart.length > 0 && (
                <div className="mt-3 rounded-xl border border-amber-600 bg-amber-950/30 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-300">Multi-Room Visit Pricing</p>
                  <p className="mt-1 text-xs leading-5 text-amber-200">
                    Travel, parking, and access charges apply ONCE per visit, no matter how many rooms. Each job is priced separately.
                  </p>
                </div>
              )}

              <div className="mt-3 space-y-3 text-sm text-slate-300">
                {invoice.jobLines.length ? (() => {
                  // Group jobs by location
                  const grouped: Record<string, typeof invoice.jobLines> = {};
                  invoice.jobLines.forEach(line => {
                    const cartItem = cart.find(c => c.id === line.id);
                    const location = cartItem?.location || "Other";
                    if (!grouped[location]) grouped[location] = [];
                    grouped[location].push(line);
                  });

                  return Object.entries(grouped).map(([location, lines]) => (
                    <div key={location} className="rounded-2xl border border-slate-700 bg-slate-900/50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                          📍 {location}
                        </span>
                        <span className="text-xs text-slate-500">
                          {lines.length} job{lines.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      {lines.map((line) => (
                        <div key={line.id} className="mt-2 rounded-xl bg-slate-900 p-3">
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
                      ))}
                    </div>
                  ));
                })() : <p className="rounded-2xl border border-dashed border-slate-700 p-4 text-slate-400">Add jobs to build a quote. Shared travel, parking, access, urgency, and HST apply once.</p>}
              </div>
              {invoice.hasBlockedJobs ? <p className="mt-3 rounded-xl bg-red-950 p-3 text-sm text-red-100">Blocked jobs were excluded: {invoice.blockedJobNames.join(", ")}</p> : null}
            </div>

            <QuoteTotals invoice={invoice} />

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
                  onClick={saveQuote}
                  disabled={cart.length === 0}
                  className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentQuoteId ? "Update Quote" : "Save Quote"}
                </button>
                <button
                  type="button"
                  onClick={newQuote}
                  className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className="rounded-2xl border border-cyan-600 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-950"
                >
                  History ({quotes.length})
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowTracking(true)}
                  className="rounded-xl border border-emerald-600 px-4 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-950"
                >
                  Job Tracking ({completions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShowReports(true)}
                  className="rounded-xl border border-amber-600 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-950"
                >
                  Reports
                </button>
              </div>
              {currentQuoteId && (
                <p className="mt-3 text-xs text-slate-500">Editing quote ID: {currentQuoteId}</p>
              )}
            </div>

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

            <div className="rounded-2xl border border-blue-600 bg-blue-950/30 p-4">
              <h2 className="font-semibold text-blue-200">💡 Charging Strategy</h2>
              <div className="mt-3 space-y-3 text-xs leading-5 text-blue-100">
                <div>
                  <p className="font-bold text-blue-200">Same House, Multiple Rooms:</p>
                  <p className="text-blue-100">✓ Travel/parking/access charged ONCE per visit</p>
                  <p className="text-blue-100">✓ Each room's work priced separately</p>
                  <p className="text-blue-100">✓ Example: Bedroom door + Kitchen faucet = 1 visit charge + 2 job charges</p>
                </div>
                <div>
                  <p className="font-bold text-blue-200">Same Room, Multiple Fixtures:</p>
                  <p className="text-blue-100">✓ Use same-fixture add-ons when working on same fixture</p>
                  <p className="text-blue-100">✓ Add separate jobs for different fixtures in same room</p>
                  <p className="text-blue-100">✓ Example: Bathroom = Toilet seat (main) + fill valve (add-on) + Sink faucet (separate job)</p>
                </div>
                <div>
                  <p className="font-bold text-blue-200">Same Fixture, Multiple Tasks:</p>
                  <p className="text-blue-100">✓ Always use same-fixture add-ons</p>
                  <p className="text-blue-100">✓ More efficient, saves client money</p>
                  <p className="text-blue-100">✓ Example: Door knob replacement + hinges + weather strip = main job + add-ons</p>
                </div>
              </div>
            </div>

            <InfoBlock title="Client message" items={[clientMessage]} />
            <MarketCards job={job} />
            <InfoBlock title="Stop or refer if selected job has" items={[job.stopConditions]} danger />
          </aside>
        </div>
      </section>

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowHistory(false)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-300">Quote History</h2>
              <button onClick={() => setShowHistory(false)} className="rounded-xl px-4 py-2 text-lg font-bold text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <div className="mt-6 space-y-3">
              {quotes.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                  No saved quotes yet. Create and save a quote to see it here.
                </p>
              ) : (
                quotes.map((quote) => (
                  <div key={quote.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-cyan-200">{quote.quoteNumber}</p>
                        <p className="mt-1 text-sm text-slate-400">{quote.clientName}</p>
                        {quote.clientAddress && <p className="text-sm text-slate-400">{quote.clientAddress}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                            quote.status === "approved" ? "bg-emerald-950 text-emerald-300" :
                            quote.status === "sent" ? "bg-cyan-950 text-cyan-300" :
                            quote.status === "completed" ? "bg-blue-950 text-blue-300" :
                            quote.status === "cancelled" ? "bg-red-950 text-red-300" :
                            "bg-slate-800 text-slate-300"
                          }`}>
                            {quote.status}
                          </span>
                          <span className="text-sm text-slate-500">
                            {new Date(quote.createdAt).toLocaleDateString("en-CA")}
                          </span>
                        </div>
                        <p className="mt-3 text-lg font-bold text-slate-100">{currency.format(quote.total)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadQuote(quote.id)}
                          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-500"
                        >
                          Load
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this quote?")) {
                              await api.deleteQuote(quote.id);
                              await loadQuotes();
                            }
                          }}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowTracking(false)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-300">Job Completion Tracking</h2>
              <button onClick={() => setShowTracking(false)} className="rounded-xl px-4 py-2 text-lg font-bold text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <p className="mt-2 text-sm text-slate-400">Track actual costs and time vs estimates. Mark quotes as completed, then log actual values here.</p>
            <div className="mt-6 space-y-3">
              {completions.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                  No completed jobs tracked yet. Save this feature for after you complete jobs.
                </p>
              ) : (
                completions.map((completion) => (
                  <div key={completion.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                    <p className="font-bold text-cyan-200">{completion.jobName}</p>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Estimated:</p>
                        <p className="font-bold text-slate-100">{currency.format(completion.estimatedCost)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Actual:</p>
                        <p className="font-bold text-slate-100">{completion.actualTotalCost ? currency.format(completion.actualTotalCost) : "—"}</p>
                      </div>
                      {completion.variance !== null && (
                        <div className="col-span-2">
                          <p className="text-slate-500">Variance:</p>
                          <p className={`text-lg font-bold ${completion.variance > 0 ? "text-red-400" : "text-emerald-400"}`}>
                            {completion.variance > 0 ? "+" : ""}{currency.format(completion.variance)} ({completion.variancePercent?.toFixed(1)}%)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowReports(false)}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-300">Pricing Accuracy Reports</h2>
              <button onClick={() => setShowReports(false)} className="rounded-xl px-4 py-2 text-lg font-bold text-slate-400 hover:text-slate-200">✕</button>
            </div>
            {(() => {
              const completedJobs = completions.filter((c) => c.actualTotalCost !== null);
              const totalVariance = completedJobs.reduce((sum, c) => sum + (c.variance || 0), 0);
              const avgVariancePercent = completedJobs.length > 0
                ? completedJobs.reduce((sum, c) => sum + (c.variancePercent || 0), 0) / completedJobs.length
                : 0;
              const underEstimated = completedJobs.filter(c => (c.variance || 0) > 0).length;
              const overEstimated = completedJobs.filter(c => (c.variance || 0) < 0).length;
              const accurate = completedJobs.filter(c => Math.abs(c.variancePercent || 0) < 10).length;

              return (
                <>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                      <p className="text-sm text-slate-500">Completed Jobs</p>
                      <p className="mt-2 text-3xl font-black text-cyan-200">{completedJobs.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                      <p className="text-sm text-slate-500">Total Variance</p>
                      <p className={`mt-2 text-3xl font-black ${totalVariance > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {totalVariance > 0 ? "+" : ""}{currency.format(totalVariance)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                      <p className="text-sm text-slate-500">Avg Variance %</p>
                      <p className={`mt-2 text-3xl font-black ${avgVariancePercent > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {avgVariancePercent > 0 ? "+" : ""}{avgVariancePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-red-700 bg-red-950/30 p-4">
                      <p className="text-sm text-red-300">Under-estimated</p>
                      <p className="mt-2 text-2xl font-bold text-red-200">{underEstimated} jobs</p>
                      <p className="mt-1 text-xs text-red-400">Cost more than quoted</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-700 bg-emerald-950/30 p-4">
                      <p className="text-sm text-emerald-300">Accurate (±10%)</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-200">{accurate} jobs</p>
                      <p className="mt-1 text-xs text-emerald-400">Within 10% of estimate</p>
                    </div>
                    <div className="rounded-2xl border border-amber-700 bg-amber-950/30 p-4">
                      <p className="text-sm text-amber-300">Over-estimated</p>
                      <p className="mt-2 text-2xl font-bold text-amber-200">{overEstimated} jobs</p>
                      <p className="mt-1 text-xs text-amber-400">Cost less than quoted</p>
                    </div>
                  </div>

                  {completedJobs.length === 0 && (
                    <p className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                      No completed jobs with actual costs yet. Complete jobs and log actual costs to see analysis.
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
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
