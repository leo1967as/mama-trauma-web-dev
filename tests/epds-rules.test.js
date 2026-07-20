import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/lib/epds-data.js", import.meta.url), "utf8");
const block = source.slice(source.indexOf("export const EPDS_CHECKPOINTS"), source.indexOf("const NEXT_STEPS"));
const rules = new Function(`${block.replaceAll("export ", "")}\nreturn { EPDS_CHECKPOINTS, getEpdsCheckpoint, getPendingCheckpoint };`)();

test("EPDS uses the latest due checkpoint without queuing older phases", () => {
  assert.deepEqual(rules.EPDS_CHECKPOINTS, [8, 22, 181]);
  assert.equal(rules.getEpdsCheckpoint(7), null);
  assert.equal(rules.getEpdsCheckpoint(8), 8);
  assert.equal(rules.getEpdsCheckpoint(21), 8);
  assert.equal(rules.getEpdsCheckpoint(22), 22);
  assert.equal(rules.getEpdsCheckpoint(181), 181);
  assert.equal(rules.getPendingCheckpoint([], 43), 22);
  assert.equal(rules.getPendingCheckpoint([{ checkpointDay: 8 }], 43), 22);
  assert.equal(rules.getPendingCheckpoint([{ checkpointDay: 22 }], 43), null);
});

test("legacy checkpoint completions suppress only their mapped checkpoint", () => {
  assert.equal(rules.getPendingCheckpoint([{ checkpoint_day: 14 }], 8), null);
  assert.equal(rules.getPendingCheckpoint([{ checkpoint_day: 42 }], 43), null);
  assert.equal(rules.getPendingCheckpoint([{ checkpoint_day: 270 }], 181), null);
  assert.equal(rules.getPendingCheckpoint([{ checkpoint_day: 90 }], 181), 181);
});

test("urgent safety trigger does not treat callback request as unsafe", () => {
  const body = source.slice(source.indexOf("export function getEpdsTrigger"), source.indexOf("function isTriggerRecorded"));
  assert.match(body, /hasUrgentSafetyAccess/);
  assert.doesNotMatch(body, /supportRequest|support_request/);
});
