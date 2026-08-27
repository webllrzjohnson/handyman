import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calculateMultiJobQuote, calculateQuote } from "../src/lib/pricing-engine";
import { materialOptions, serviceJobs, getSameFixtureAddOns, type ServiceJob } from "../src/lib/service-catalog";

function job(id: string): ServiceJob {
  const found = serviceJobs.find((item) => item.id === id);
  assert.ok(found, `Expected seeded job ${id} to exist`);
  return found;
}

const clientSupplies = materialOptions.find((item) => item.id === "client")!;

describe("pricing engine", () => {
  it("suppresses normal quote totals for licensed or do-not-accept jobs", () => {
    const result = calculateQuote({
      job: job("outlet-switch-gfci-dimmer-replacement"),
      pricingMode: "solo_freelancer",
      quantity: 1,
      conditionAmount: 0,
      travelAmount: 30,
      parkingAmount: 20,
      accessAmount: 40,
      material: clientSupplies,
      materialCost: 100,
      materialMarkupPercent: 25,
      materialPickupFee: 40,
      urgency: { type: "flat", amount: 75 },
      selectedAddOnIds: [],
    });

    assert.equal(result.isQuotable, false);
    assert.equal(result.suggested, 0);
    assert.equal(result.low, 0);
    assert.equal(result.high, 0);
    assert.match(result.disabledReason ?? "", /Referral only/i);
  });

  it("calculates quantity, material markup, pickup, and shared expenses visibly", () => {
    const result = calculateQuote({
      job: job("door-knob-lever-replacement-existing-bore-latch-prep"),
      pricingMode: "solo_freelancer",
      quantity: 3,
      conditionAmount: 0,
      travelAmount: 30,
      parkingAmount: 20,
      accessAmount: 40,
      material: clientSupplies,
      materialCost: 100,
      materialMarkupPercent: 25,
      materialPickupFee: 40,
      urgency: { type: "flat", amount: 0 },
      selectedAddOnIds: [],
    });

    assert.equal(result.isQuotable, true);
    assert.equal(result.includedQuantity, 1);
    assert.equal(result.additionalQuantity, 2);
    assert.equal(result.quantityAddOn, 96);
    assert.equal(result.materialCost, 100);
    assert.equal(result.materialMarkup, 25);
    assert.equal(result.materialPickupFee, 40);
    assert.equal(result.materialSubtotal, 165);
    assert.equal(result.logistics, 90);
    assert.equal(result.suggested, 490);
    assert.equal(result.low, 335);
    assert.equal(result.high, 530);
  });

  it("shares visit expenses once across multi-job quotes", () => {
    const result = calculateMultiJobQuote({
      pricingMode: "solo_freelancer",
      travelAmount: 30,
      parkingAmount: 20,
      accessAmount: 40,
      urgency: { type: "flat", amount: 75 },
      hstPercent: 13,
      items: [
        {
          id: "line-1",
          job: job("door-knob-lever-replacement-existing-bore-latch-prep"),
          quantity: 2,
          conditionLabel: "Normal",
          conditionAmount: 0,
          materialCost: 100,
          materialMarkupPercent: 25,
          materialPickupFee: 40,
          selectedAddOnIds: [],
        },
        {
          id: "line-2",
          job: job("toilet-fill-valve-replacement"),
          quantity: 1,
          conditionLabel: "Difficult",
          conditionAmount: 50,
          materialCost: 0,
          materialMarkupPercent: 0,
          materialPickupFee: 0,
          selectedAddOnIds: [],
        },
      ],
    });

    assert.equal(result.jobLines.length, 2);
    assert.equal(result.labourSubtotal, 348);
    assert.equal(result.materialSubtotal, 165);
    assert.equal(result.logistics, 90);
    assert.equal(result.rush, 75);
    assert.equal(result.subtotal, 680);
    assert.equal(result.tax, 88);
    assert.equal(result.total, 768);
  });

  it("offers toilet same-fixture add-ons beyond tank valves", () => {
    const toiletTank = job("toilet-tank-replacement");
    const addOns = getSameFixtureAddOns(toiletTank);

    assert.ok(addOns.some((item) => item.id === "toilet-handle-flapper"));
    assert.ok(addOns.some((item) => item.id === "toilet-seat"));

    const result = calculateQuote({
      job: toiletTank,
      pricingMode: "solo_freelancer",
      quantity: 1,
      conditionAmount: 0,
      travelAmount: 0,
      parkingAmount: 0,
      accessAmount: 0,
      material: clientSupplies,
      materialCost: 0,
      materialMarkupPercent: 0,
      materialPickupFee: 0,
      urgency: { type: "flat", amount: 0 },
      selectedAddOnIds: ["toilet-handle-flapper", "toilet-seat"],
    });

    assert.equal(result.addOns, 100);
    assert.ok(result.suggested >= 300);
  });

  it("offers sink same-fixture add-ons for faucet, PO plug, basket strainer, and P-trap work", () => {
    const faucet = job("faucet-replacement-visible-shutoffs");
    const addOns = getSameFixtureAddOns(faucet);

    assert.ok(addOns.some((item) => item.id === "sink-pop-up-po-plug"));
    assert.ok(addOns.some((item) => item.id === "sink-basket-strainer"));
    assert.ok(addOns.some((item) => item.id === "sink-p-trap"));

    const result = calculateQuote({
      job: faucet,
      pricingMode: "solo_freelancer",
      quantity: 1,
      conditionAmount: 0,
      travelAmount: 0,
      parkingAmount: 0,
      accessAmount: 0,
      material: clientSupplies,
      materialCost: 0,
      materialMarkupPercent: 0,
      materialPickupFee: 0,
      urgency: { type: "flat", amount: 0 },
      selectedAddOnIds: ["sink-pop-up-po-plug", "sink-basket-strainer", "sink-p-trap"],
    });

    assert.equal(result.addOns, 240);
  });

  it("does not generate a quote total when every selected job is referral-only", () => {
    const result = calculateMultiJobQuote({
      pricingMode: "solo_freelancer",
      travelAmount: 30,
      parkingAmount: 20,
      accessAmount: 40,
      urgency: { type: "flat", amount: 75 },
      hstPercent: 13,
      items: [
        {
          id: "blocked-1",
          job: job("gas-fuel-appliance-work"),
          quantity: 1,
          conditionLabel: "Normal",
          conditionAmount: 0,
          materialCost: 100,
          materialMarkupPercent: 25,
          materialPickupFee: 40,
          selectedAddOnIds: [],
        },
      ],
    });

    assert.equal(result.hasBlockedJobs, true);
    assert.deepEqual(result.blockedJobNames, ["Gas or fuel appliance work"]);
    assert.equal(result.jobLines.length, 0);
    assert.equal(result.total, 0);
    assert.equal(result.subtotal, 0);
  });
});
