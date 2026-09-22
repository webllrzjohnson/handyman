import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { completionVariance, parseQuoteItemPayloads, parseQuotePayload, parseRouteId } from "../src/lib/api-helpers";

describe("api helpers", () => {
  it("validates positive integer route IDs", () => {
    assert.equal(parseRouteId("42"), 42);
    assert.equal(parseRouteId("0"), null);
    assert.equal(parseRouteId("-1"), null);
    assert.equal(parseRouteId("abc"), null);
  });

  it("returns clear quote validation errors before database writes", () => {
    const result = parseQuotePayload({
      quoteNumber: "",
      clientName: "Louie",
      status: "draft",
      pricingMode: "solo_freelancer",
      urgencyType: "flat",
    });

    assert.deepEqual(result, { error: "Quote number is required" });
  });

  it("preserves quote item IDs for update payloads", () => {
    const result = parseQuoteItemPayloads([
      {
        id: 123,
        jobId: "door-knob-lever-replacement-existing-bore-latch-prep",
        jobName: "Door knob/lever replacement, existing bore/latch prep",
        jobCategory: "Doors, locks, and hardware",
        quantity: 1,
        conditionId: "normal",
        conditionLabel: "Normal",
        conditionAmount: 0,
        materialId: "client",
        materialCost: 0,
        materialMarkupPercent: 0,
        materialPickupFee: 0,
        selectedAddOnIds: "[]",
        location: "Entry / Hallway - Entry Doors & Security",
        lineSubtotal: 110,
      },
    ]);

    assert.ok(Array.isArray(result));
    assert.equal(result[0].id, 123);
  });

  it("calculates completion variance when actual cost is zero", () => {
    assert.deepEqual(completionVariance({ estimatedCost: 100, actualTotalCost: 0 }), {
      variance: -100,
      variancePercent: -100,
    });
  });
});
