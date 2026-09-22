import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isQuotableStatus } from "../src/lib/pricing-engine";
import { quoteTemplates } from "../src/lib/quote-templates";
import { getSameFixtureAddOns, serviceJobs } from "../src/lib/service-catalog";

const jobsById = new Map(serviceJobs.map((job) => [job.id, job]));

describe("quote templates", () => {
  it("only reference quotable catalog jobs", () => {
    for (const template of quoteTemplates) {
      assert.ok(template.items.length > 0, `${template.name} must include at least one job`);

      for (const item of template.items) {
        const job = jobsById.get(item.jobId);
        assert.ok(job, `${template.name} references missing job ${item.jobId}`);
        assert.ok(isQuotableStatus(job.tradeStatus), `${template.name} references non-quotable job ${job.name}`);
      }
    }
  });

  it("only preselect add-ons available for each template job", () => {
    for (const template of quoteTemplates) {
      for (const item of template.items) {
        const job = jobsById.get(item.jobId);
        assert.ok(job, `${template.name} references missing job ${item.jobId}`);

        const availableAddOnIds = new Set(getSameFixtureAddOns(job).map((addOn) => addOn.id));
        for (const addOnId of item.selectedAddOnIds ?? []) {
          assert.ok(availableAddOnIds.has(addOnId), `${template.name} preselects unavailable add-on ${addOnId} for ${job.name}`);
        }
      }
    }
  });
});
