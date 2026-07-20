import test from "node:test";
import assert from "node:assert/strict";

import {
  activateUserSession,
  archiveAndClearActiveSession,
  getActiveSessionUid,
  saveActiveSessionSnapshot,
} from "../src/lib/session-data.js";

class MemoryStorage {
  #data = new Map();

  get length() { return this.#data.size; }
  key(index) { return [...this.#data.keys()][index] ?? null; }
  getItem(key) { return this.#data.get(key) ?? null; }
  setItem(key, value) { this.#data.set(key, String(value)); }
  removeItem(key) { this.#data.delete(key); }
}

test("unowned active data is cleared instead of leaking to the restored user", () => {
  const storage = new MemoryStorage();
  storage.setItem("afterbloom_onboarding", '{"complete":true}');
  storage.setItem("afterbloom_lang", "th");
  storage.setItem("afterbloom_device_id", "device-1");

  activateUserSession("user-a", storage);

  assert.equal(getActiveSessionUid(storage), "user-a");
  assert.equal(storage.getItem("afterbloom_onboarding"), null);
  assert.equal(storage.getItem("afterbloom_lang"), "th");
  assert.equal(storage.getItem("afterbloom_device_id"), "device-1");
});

test("switching users archives and restores only that user's app data", () => {
  const storage = new MemoryStorage();
  storage.setItem("afterbloom_active_uid", "user-a");
  storage.setItem("afterbloom_onboarding", '{"mother_name":"A"}');
  storage.setItem("afterbloom_mood_history", "[1]");
  storage.setItem("afterbloom_lang", "en");

  activateUserSession("user-b", storage);
  assert.equal(storage.getItem("afterbloom_onboarding"), null);
  assert.equal(storage.getItem("afterbloom_mood_history"), null);
  assert.equal(storage.getItem("afterbloom_lang"), "en");

  storage.setItem("afterbloom_onboarding", '{"mother_name":"B"}');
  activateUserSession("user-a", storage);

  assert.equal(storage.getItem("afterbloom_onboarding"), '{"mother_name":"A"}');
  assert.equal(storage.getItem("afterbloom_mood_history"), "[1]");
  assert.equal(getActiveSessionUid(storage), "user-a");
});

test("logout clears active data and restores it after the same user returns", () => {
  const storage = new MemoryStorage();
  storage.setItem("afterbloom_active_uid", "user-a");
  storage.setItem("afterbloom_onboarding", '{"complete":true}');
  storage.setItem("afterbloom_future_sensitive_key", "kept");

  archiveAndClearActiveSession("user-a", storage);
  assert.equal(storage.getItem("afterbloom_onboarding"), null);
  assert.equal(storage.getItem("afterbloom_future_sensitive_key"), null);
  assert.equal(getActiveSessionUid(storage), null);

  archiveAndClearActiveSession("user-a", storage);

  activateUserSession("user-a", storage);
  assert.equal(storage.getItem("afterbloom_onboarding"), '{"complete":true}');
  assert.equal(storage.getItem("afterbloom_future_sensitive_key"), "kept");
});

test("logout snapshot survives auth state cleanup before local data is cleared", () => {
  const storage = new MemoryStorage();
  storage.setItem("afterbloom_active_uid", "user-a");
  storage.setItem("afterbloom_onboarding", '{"complete":true}');

  saveActiveSessionSnapshot("user-a", storage);
  storage.removeItem("afterbloom_active_uid");
  storage.removeItem("afterbloom_onboarding");

  activateUserSession("user-a", storage);
  assert.equal(storage.getItem("afterbloom_onboarding"), '{"complete":true}');
});

test("same UID rehydrates its snapshot after an interrupted local cleanup", () => {
  const storage = new MemoryStorage();
  storage.setItem("afterbloom_active_uid", "user-a");
  storage.setItem("afterbloom_onboarding", '{"complete":true}');

  saveActiveSessionSnapshot("user-a", storage);
  storage.removeItem("afterbloom_onboarding");

  activateUserSession("user-a", storage);

  assert.equal(storage.getItem("afterbloom_onboarding"), '{"complete":true}');
  assert.equal(getActiveSessionUid(storage), "user-a");
});

test("a different UID never rehydrates the previous UID's snapshot", () => {
  const storage = new MemoryStorage();
  storage.setItem("afterbloom_active_uid", "user-a");
  storage.setItem("afterbloom_onboarding", '{"mother_name":"A"}');
  archiveAndClearActiveSession("user-a", storage);

  activateUserSession("user-b", storage);

  assert.equal(storage.getItem("afterbloom_onboarding"), null);
  assert.equal(getActiveSessionUid(storage), "user-b");
});
