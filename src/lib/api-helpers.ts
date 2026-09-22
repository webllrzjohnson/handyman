import { NextResponse } from "next/server";
import type { CompletionPayload, QuoteItemPayload, QuotePayload, QuoteStatus } from "./api-types";

const quoteStatuses = new Set<QuoteStatus>(["draft", "sent", "approved", "completed", "cancelled"]);
const pricingModes = new Set(["informal_floor", "solo_freelancer", "insured_company"]);
const urgencyTypes = new Set(["flat", "percent"]);

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function parseRouteId(id: string): number | null {
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function isDuplicateQuoteNumber(error: unknown) {
  return errorMessage(error, "").includes("UNIQUE constraint failed: quotes.quote_number");
}

function asObject(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown) {
  const text = stringValue(value);
  return text || null;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function nullableNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function parseQuotePayload(value: unknown): QuotePayload | { error: string } {
  const body = asObject(value);
  if (!body) return { error: "Invalid quote payload" };

  const quoteNumber = stringValue(body.quoteNumber);
  const clientName = stringValue(body.clientName);
  const status = stringValue(body.status) as QuoteStatus;
  const pricingMode = stringValue(body.pricingMode);
  const urgencyType = stringValue(body.urgencyType);

  if (!quoteNumber) return { error: "Quote number is required" };
  if (!clientName) return { error: "Client name is required" };
  if (!quoteStatuses.has(status)) return { error: "Invalid quote status" };
  if (!pricingModes.has(pricingMode)) return { error: "Invalid pricing mode" };
  if (!urgencyTypes.has(urgencyType)) return { error: "Invalid urgency type" };

  return {
    quoteNumber,
    clientId: nullableNumber(body.clientId),
    clientName,
    clientAddress: nullableString(body.clientAddress),
    status,
    pricingMode,
    travelAmount: numberValue(body.travelAmount),
    parkingAmount: numberValue(body.parkingAmount),
    accessAmount: numberValue(body.accessAmount),
    urgencyType,
    urgencyAmount: numberValue(body.urgencyAmount),
    hstPercent: numberValue(body.hstPercent),
    subtotal: numberValue(body.subtotal),
    tax: numberValue(body.tax),
    total: numberValue(body.total),
    notes: nullableString(body.notes),
  };
}

export function parseQuoteItemPayloads(value: unknown): QuoteItemPayload[] | { error: string } {
  if (!Array.isArray(value)) return { error: "Quote items must be an array" };

  const items: QuoteItemPayload[] = [];
  for (const raw of value) {
    const item = asObject(raw);
    if (!item) return { error: "Invalid quote item payload" };

    const jobId = stringValue(item.jobId);
    const jobName = stringValue(item.jobName);
    const jobCategory = stringValue(item.jobCategory);
    if (!jobId || !jobName || !jobCategory) return { error: "Quote item job details are required" };

    items.push({
      id: nullableNumber(item.id) ?? undefined,
      jobId,
      jobName,
      jobCategory,
      quantity: Math.max(1, Math.floor(numberValue(item.quantity, 1))),
      conditionId: stringValue(item.conditionId) || "normal",
      conditionLabel: stringValue(item.conditionLabel) || "Normal",
      conditionAmount: numberValue(item.conditionAmount),
      materialId: stringValue(item.materialId) || "client",
      materialCost: Math.max(0, numberValue(item.materialCost)),
      materialMarkupPercent: Math.max(0, numberValue(item.materialMarkupPercent)),
      materialPickupFee: Math.max(0, numberValue(item.materialPickupFee)),
      selectedAddOnIds: stringValue(item.selectedAddOnIds) || "[]",
      location: stringValue(item.location) || "Other",
      lineSubtotal: Math.max(0, numberValue(item.lineSubtotal)),
    });
  }

  return items;
}

export function parseCompletionPayload(value: unknown): CompletionPayload | { error: string } {
  const body = asObject(value);
  if (!body) return { error: "Invalid completion payload" };

  const quoteId = nullableNumber(body.quoteId);
  const jobId = stringValue(body.jobId);
  const jobName = stringValue(body.jobName);
  const estimatedCost = nullableNumber(body.estimatedCost);

  if (!quoteId) return { error: "Quote ID is required" };
  if (!jobId || !jobName) return { error: "Job details are required" };
  if (estimatedCost === null) return { error: "Estimated cost is required" };

  return {
    quoteId,
    quoteItemId: nullableNumber(body.quoteItemId),
    jobId,
    jobName,
    estimatedTime: nullableNumber(body.estimatedTime),
    actualTime: nullableNumber(body.actualTime),
    estimatedCost,
    actualLabourCost: nullableNumber(body.actualLabourCost),
    actualMaterialCost: nullableNumber(body.actualMaterialCost),
    actualTotalCost: nullableNumber(body.actualTotalCost),
    notes: nullableString(body.notes),
    completedAt: body.completedAt instanceof Date ? body.completedAt : null,
  };
}

export function completionVariance(input: Pick<CompletionPayload, "actualTotalCost" | "estimatedCost">) {
  if (input.actualTotalCost === null || input.actualTotalCost === undefined || input.estimatedCost === 0) {
    return { variance: null, variancePercent: null };
  }

  const variance = input.actualTotalCost - input.estimatedCost;
  return { variance, variancePercent: (variance / input.estimatedCost) * 100 };
}
