import { getSameFixtureAddOns, pricingModes, type PricingMode, type ServiceJob, type TradeStatus } from "./service-catalog";

export type MaterialOption = { defaultMarkupPercent: number; defaultPickupFee: number };
export type UrgencyOption = { type: "flat" | "percent"; amount: number };

export type QuoteInput = {
  job: ServiceJob;
  pricingMode: PricingMode;
  quantity: number;
  conditionAmount: number;
  travelAmount: number;
  parkingAmount: number;
  accessAmount: number;
  material: MaterialOption;
  materialCost: number;
  materialMarkupPercent: number;
  materialPickupFee: number;
  urgency: UrgencyOption;
  selectedAddOnIds: string[];
};

export type QuoteLine = { label: string; amount: number };

export type QuoteResult = {
  isQuotable: boolean;
  disabledReason?: string;
  quantity: number;
  includedQuantity: number;
  additionalQuantity: number;
  lineItems: QuoteLine[];
  base: number;
  quantityAddOn: number;
  addOns: number;
  materialCost: number;
  materialMarkup: number;
  materialPickupFee: number;
  materialSubtotal: number;
  logistics: number;
  rush: number;
  subtotalBeforeRush: number;
  suggested: number;
  low: number;
  high: number;
};

export type CartJobInput = {
  id: string;
  job: ServiceJob;
  quantity: number;
  conditionLabel: string;
  conditionAmount: number;
  materialCost: number;
  materialMarkupPercent: number;
  materialPickupFee: number;
  selectedAddOnIds: string[];
};

export type CartJobResult = {
  id: string;
  job: ServiceJob;
  quantity: number;
  conditionLabel: string;
  additionalQuantity: number;
  baseLabour: number;
  quantityAddOn: number;
  conditionAmount: number;
  addOns: number;
  addOnLabels: string[];
  materialCost: number;
  materialMarkup: number;
  materialPickupFee: number;
  materialSubtotal: number;
  labourSubtotal: number;
  lineSubtotal: number;
};

export type MultiJobQuoteInput = {
  items: CartJobInput[];
  pricingMode: PricingMode;
  travelAmount: number;
  parkingAmount: number;
  accessAmount: number;
  urgency: UrgencyOption;
  hstPercent: number;
};

export type MultiJobQuoteResult = {
  jobLines: CartJobResult[];
  lineItems: QuoteLine[];
  labourSubtotal: number;
  visitMinimum: number;
  visitMinimumAdjustment: number;
  materialSubtotal: number;
  logistics: number;
  rush: number;
  subtotal: number;
  tax: number;
  total: number;
  hasBlockedJobs: boolean;
  blockedJobNames: string[];
};

export function isQuotableStatus(status: TradeStatus) {
  return status === "handyman_ok" || status === "caution";
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const isQuotable = isQuotableStatus(input.job.tradeStatus);
  const mode = pricingModes.find((item) => item.id === input.pricingMode) ?? pricingModes[1];
  const line = calculateCartJobLine({
    id: input.job.id,
    job: input.job,
    quantity: input.quantity,
    conditionLabel: "Condition adjustment",
    conditionAmount: input.conditionAmount,
    materialCost: input.materialCost,
    materialMarkupPercent: input.materialMarkupPercent || input.material.defaultMarkupPercent || 0,
    materialPickupFee: input.materialPickupFee,
    selectedAddOnIds: input.selectedAddOnIds,
  }, input.pricingMode);
  const logistics = input.travelAmount + input.parkingAmount + input.accessAmount;
  const base = Math.max(line.baseLabour, mode.minimumVisit);
  const subtotalBeforeRush = base + line.quantityAddOn + line.conditionAmount + line.addOns + line.materialSubtotal + logistics;
  const rush = input.urgency.type === "percent" ? Math.round(subtotalBeforeRush * input.urgency.amount) : input.urgency.amount;
  const suggested = isQuotable ? roundToFive(Math.max(mode.minimumVisit, subtotalBeforeRush + rush)) : 0;
  const band = input.job.pricing[input.pricingMode];
  const low = isQuotable
    ? roundToFive(Math.max(mode.minimumVisit, band.low + line.additionalQuantity * Math.round(input.job.additionalUnitPrice * 0.8) + input.conditionAmount + logistics + line.materialCost))
    : 0;
  const high = isQuotable
    ? roundToFive(band.high + line.additionalQuantity * Math.round(input.job.additionalUnitPrice * 1.2) + Math.max(input.conditionAmount, 0) + line.addOns + line.materialSubtotal + logistics + rush)
    : 0;

  const lineItems: QuoteLine[] = [{ label: `Base or minimum (${mode.label})`, amount: base }];
  if (line.additionalQuantity > 0) lineItems.push({ label: `${line.additionalQuantity} additional ${input.job.unitLabel}${line.additionalQuantity === 1 ? "" : "s"}`, amount: line.quantityAddOn });
  if (input.conditionAmount !== 0) lineItems.push({ label: "Condition adjustment", amount: input.conditionAmount });
  if (line.addOns > 0) lineItems.push({ label: "Selected add ons", amount: line.addOns });
  if (line.materialCost > 0) lineItems.push({ label: "Parts/materials cost", amount: line.materialCost });
  if (line.materialMarkup > 0) lineItems.push({ label: `Material markup (${input.materialMarkupPercent}%)`, amount: line.materialMarkup });
  if (line.materialPickupFee > 0) lineItems.push({ label: "Shopping/pickup fee", amount: line.materialPickupFee });
  if (logistics > 0) lineItems.push({ label: "Travel, parking, and access", amount: logistics });
  if (rush > 0) lineItems.push({ label: "Urgency premium", amount: rush });

  return {
    isQuotable,
    disabledReason: isQuotable ? undefined : "Referral only. Do not present this as work Louie can accept.",
    quantity: line.quantity,
    includedQuantity: Math.max(1, input.job.includedQuantity || 1),
    additionalQuantity: line.additionalQuantity,
    lineItems,
    base,
    quantityAddOn: line.quantityAddOn,
    addOns: line.addOns,
    materialCost: line.materialCost,
    materialMarkup: line.materialMarkup,
    materialPickupFee: line.materialPickupFee,
    materialSubtotal: line.materialSubtotal,
    logistics,
    rush,
    subtotalBeforeRush,
    suggested,
    low,
    high,
  };
}

export function calculateCartJobLine(input: CartJobInput, pricingMode: PricingMode): CartJobResult {
  const band = input.job.pricing[pricingMode];
  const quantity = Math.max(1, Math.floor(input.quantity || 1));
  const includedQuantity = Math.max(1, input.job.includedQuantity || 1);
  const additionalQuantity = Math.max(0, quantity - includedQuantity);
  const quantityAddOn = additionalQuantity * input.job.additionalUnitPrice;
  const selectedAddOns = getSameFixtureAddOns(input.job).filter((item) => input.selectedAddOnIds.includes(item.id));
  const addOns = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const addOnLabels = selectedAddOns.map((item) => item.label);
  const materialCost = Math.max(0, Math.round(input.materialCost || 0));
  const materialMarkupPercent = Math.max(0, input.materialMarkupPercent || 0);
  const materialMarkup = Math.round(materialCost * (materialMarkupPercent / 100));
  const materialPickupFee = Math.max(0, Math.round(input.materialPickupFee || 0));
  const materialSubtotal = materialCost + materialMarkup + materialPickupFee;
  const labourSubtotal = band.target + quantityAddOn + input.conditionAmount + addOns;

  return {
    id: input.id,
    job: input.job,
    quantity,
    conditionLabel: input.conditionLabel,
    additionalQuantity,
    baseLabour: band.target,
    quantityAddOn,
    conditionAmount: input.conditionAmount,
    addOns,
    addOnLabels,
    materialCost,
    materialMarkup,
    materialPickupFee,
    materialSubtotal,
    labourSubtotal,
    lineSubtotal: labourSubtotal + materialSubtotal,
  };
}

export function calculateMultiJobQuote(input: MultiJobQuoteInput): MultiJobQuoteResult {
  const mode = pricingModes.find((item) => item.id === input.pricingMode) ?? pricingModes[1];
  const blockedJobNames = input.items.filter((item) => !isQuotableStatus(item.job.tradeStatus)).map((item) => item.job.name);

  if (input.items.length === 0) {
    return {
      jobLines: [],
      lineItems: [],
      labourSubtotal: 0,
      visitMinimum: mode.minimumVisit,
      visitMinimumAdjustment: 0,
      materialSubtotal: 0,
      logistics: 0,
      rush: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
      hasBlockedJobs: blockedJobNames.length > 0,
      blockedJobNames,
    };
  }
  const jobLines = input.items.filter((item) => isQuotableStatus(item.job.tradeStatus)).map((item) => calculateCartJobLine(item, input.pricingMode));

  if (jobLines.length === 0) {
    return {
      jobLines,
      lineItems: [],
      labourSubtotal: 0,
      visitMinimum: mode.minimumVisit,
      visitMinimumAdjustment: 0,
      materialSubtotal: 0,
      logistics: 0,
      rush: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
      hasBlockedJobs: blockedJobNames.length > 0,
      blockedJobNames,
    };
  }

  const labourSubtotal = jobLines.reduce((sum, item) => sum + item.labourSubtotal, 0);
  const materialSubtotal = jobLines.reduce((sum, item) => sum + item.materialSubtotal, 0);
  const visitMinimum = mode.minimumVisit;
  const visitMinimumAdjustment = Math.max(0, visitMinimum - labourSubtotal);
  const logistics = input.travelAmount + input.parkingAmount + input.accessAmount;
  const beforeRush = labourSubtotal + visitMinimumAdjustment + materialSubtotal + logistics;
  const rush = input.urgency.type === "percent" ? Math.round(beforeRush * input.urgency.amount) : input.urgency.amount;
  const subtotal = roundToFive(beforeRush + rush);
  const tax = Math.round(subtotal * (Math.max(0, input.hstPercent || 0) / 100));
  const total = subtotal + tax;
  const lineItems: QuoteLine[] = [];

  jobLines.forEach((item) => lineItems.push({ label: `${item.job.name} (${item.quantity} ${item.job.unitLabel}${item.quantity === 1 ? "" : "s"})`, amount: item.lineSubtotal }));
  if (visitMinimumAdjustment > 0) lineItems.push({ label: `Visit minimum adjustment (${mode.label})`, amount: visitMinimumAdjustment });
  if (logistics > 0) lineItems.push({ label: "Travel, parking, and access", amount: logistics });
  if (rush > 0) lineItems.push({ label: "Urgency premium", amount: rush });
  if (tax > 0) lineItems.push({ label: `HST/tax (${input.hstPercent}%)`, amount: tax });

  return {
    jobLines,
    lineItems,
    labourSubtotal,
    visitMinimum,
    visitMinimumAdjustment,
    materialSubtotal,
    logistics,
    rush,
    subtotal,
    tax,
    total,
    hasBlockedJobs: blockedJobNames.length > 0,
    blockedJobNames,
  };
}

export function roundToFive(value: number) {
  return Math.round(value / 5) * 5;
}
