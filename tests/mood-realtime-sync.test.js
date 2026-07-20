import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/lib/mood-data.js", import.meta.url), "utf8")
  .replace(/^import .*;\r?\n/gm, "")
  .replace(/^export /gm, "");

function createRuntime(localEntries) {
  const storage = new Map([["afterbloom_mood_history", JSON.stringify(localEntries)]]);
  const syncCalls = [];
  const window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    dispatchEvent: () => {},
  };
  class CustomEvent {}
  const runtime = new Function(
    "window",
    "CustomEvent",
    "isSupportEpisodeSuppressed",
    "syncCheckin",
    `${source}\nreturn { mergeRemoteMoodHistory };`,
  )(window, CustomEvent, () => false, (entry) => syncCalls.push(entry));
  return { ...runtime, syncCalls };
}

test("remote check-ins normalize, replace matching dates, and keep local-only entries without writes", () => {
  const runtime = createRuntime([
    { dateKey: "2026-01-01", moodScore: 1, sleepScore: 2, energyScore: 3, worryScore: 4 },
    { dateKey: "2026-01-02", moodScore: 2, sleepScore: 2, energyScore: 2, worryScore: 2 },
  ]);
  const snapshot = [
    { id: "2026-01-01", date_key: "2026-01-01", mood_score: 5, sleep_score: 4, energy_score: 3, worry_score: 1 },
  ];

  const first = runtime.mergeRemoteMoodHistory(snapshot);
  const second = runtime.mergeRemoteMoodHistory(snapshot);

  assert.equal(first.find((entry) => entry.dateKey === "2026-01-01").moodScore, 5);
  assert.equal(first.find((entry) => entry.dateKey === "2026-01-02").moodScore, 2);
  assert.equal(second.filter((entry) => entry.dateKey === "2026-01-01").length, 1);
  assert.equal(runtime.syncCalls.length, 0);
});
