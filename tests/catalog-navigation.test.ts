import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getRoomJobIds, roomCategories } from "../src/lib/room-categories";
import { getSameFixtureAddOns, serviceJobs } from "../src/lib/service-catalog";

const catalogIds = new Set(serviceJobs.map((job) => job.id));

describe("room and job navigation", () => {
  it("gives every room area at least one valid Step 3 job", () => {
    for (const room of roomCategories) {
      assert.ok(room.areas.length > 0, `${room.name} must contain an area`);

      for (const area of room.areas) {
        const jobIds = getRoomJobIds(room.id, area.id);
        assert.ok(jobIds.length > 0, `${room.name} > ${area.name} must contain a job`);
        assert.equal(new Set(jobIds).size, jobIds.length, `${room.name} > ${area.name} contains duplicate job IDs`);

        for (const jobId of jobIds) {
          assert.ok(catalogIds.has(jobId), `${room.name} > ${area.name} references missing catalog job ${jobId}`);
        }
      }
    }
  });

  it("populates the all-jobs view and every room-level view", () => {
    assert.ok(getRoomJobIds("all").length > 0);

    for (const room of roomCategories) {
      assert.ok(getRoomJobIds(room.id).length > 0, `${room.name} must populate Step 3`);
    }
  });
});

describe("same-fixture add-ons", () => {
  function addOnIds(jobId: string) {
    const job = serviceJobs.find((item) => item.id === jobId);
    assert.ok(job, `Missing test job ${jobId}`);
    return getSameFixtureAddOns(job).map((item) => item.id);
  }

  it("returns fixture-specific options that change with the selected job", () => {
    const sink = addOnIds("faucet-replacement-visible-shutoffs");
    const toilet = addOnIds("toilet-seat-replacement");
    const interiorDoor = addOnIds("door-knob-lever-replacement-existing-bore-latch-prep");
    const closetDoor = addOnIds("bifold-closet-door-adjustment-repair");
    const screen = addOnIds("window-screen-mesh-replacement");

    assert.ok(sink.some((id) => id.startsWith("sink-")));
    assert.ok(toilet.some((id) => id.startsWith("toilet-")));
    assert.ok(interiorDoor.some((id) => id.startsWith("door-")));
    assert.ok(closetDoor.some((id) => id.startsWith("closet-")));
    assert.ok(screen.some((id) => id.startsWith("screen-")));

    assert.notDeepEqual(sink, toilet);
    assert.notDeepEqual(toilet, interiorDoor);
    assert.notDeepEqual(interiorDoor, closetDoor);
    assert.notDeepEqual(closetDoor, screen);
  });

  it("does not offer the selected primary repair as its own add-on", () => {
    assert.ok(!addOnIds("p-trap-replacement-visible").includes("sink-p-trap"));
    assert.ok(!addOnIds("hinge-replacement").includes("door-hinges"));
    assert.ok(!addOnIds("screen-frame-corner-repair").includes("screen-corners"));
  });

  it("removes fixture-group choices duplicated by job-specific add-ons", () => {
    assert.ok(!addOnIds("faucet-replacement-visible-shutoffs").includes("sink-supply-lines"));
    assert.ok(!addOnIds("toilet-fill-valve-replacement").includes("toilet-supply-line"));
    assert.ok(!addOnIds("minor-sink-unplugging-hand-snake").includes("sink-p-trap"));
    assert.ok(!addOnIds("vanity-sink-replacement").includes("sink-caulk"));
  });
});
