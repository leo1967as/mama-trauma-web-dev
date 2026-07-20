import test from "node:test";
import assert from "node:assert/strict";

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};

const { getPostpartumDay, getCurrentStage, STAGES } = await import("../src/lib/user-data.js");

test("postpartum calendar days and all nine phase boundaries are 1-based", () => {
  localStorage.setItem("afterbloom_onboarding", JSON.stringify({ baby_birth_date: "2026-07-18" }));
  assert.equal(getPostpartumDay(new Date(2026, 6, 18, 23, 59)), 1);
  assert.equal(getPostpartumDay(new Date(2026, 6, 19, 0, 1)), 2);

  const expected = new Map([
    [1, 0], [3, 0], [4, 1], [7, 1], [8, 2], [21, 2], [22, 3],
    [42, 3], [43, 4], [90, 4], [91, 5], [150, 5], [151, 6],
    [180, 6], [181, 7], [270, 7], [271, 8], [365, 8], [500, 8],
  ]);
  assert.equal(STAGES.length, 9);
  for (const [day, stageIndex] of expected) {
    assert.equal(getCurrentStage(day).stageIndex, stageIndex, `Day ${day}`);
  }
});
