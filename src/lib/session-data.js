const ACTIVE_UID_KEY = "afterbloom_active_uid";
const SNAPSHOT_PREFIX = "afterbloom_user_session:";
const GLOBAL_KEYS = new Set(["afterbloom_lang", "afterbloom_device_id", ACTIVE_UID_KEY]);

function snapshotKey(uid) {
  return `${SNAPSHOT_PREFIX}${encodeURIComponent(uid)}`;
}

function isUserDataKey(key) {
  return key.startsWith("afterbloom_")
    && !GLOBAL_KEYS.has(key)
    && !key.startsWith(SNAPSHOT_PREFIX);
}

function userData(storage) {
  const data = {};
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && isUserDataKey(key)) data[key] = storage.getItem(key);
  }
  return data;
}

function clearUserData(storage) {
  Object.keys(userData(storage)).forEach((key) => storage.removeItem(key));
}

function saveSnapshot(uid, storage) {
  if (!uid) return;
  const data = userData(storage);
  if (Object.keys(data).length === 0) return;
  storage.setItem(snapshotKey(uid), JSON.stringify(data));
}

function restoreSnapshot(uid, storage) {
  const raw = storage.getItem(snapshotKey(uid));
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([key, value]) => {
      if (isUserDataKey(key) && typeof value === "string") storage.setItem(key, value);
    });
  } catch {
    storage.removeItem(snapshotKey(uid));
  }
}

function hasUserData(storage) {
  return Object.keys(userData(storage)).length > 0;
}

export function getActiveSessionUid(storage = localStorage) {
  return storage.getItem(ACTIVE_UID_KEY);
}

export function activateUserSession(uid, storage = localStorage) {
  if (!uid) throw new Error("A user ID is required to activate a session");

  const activeUid = getActiveSessionUid(storage);
  if (activeUid === uid) {
    // Recover from an auth callback that retained the UID after local cleanup.
    if (!hasUserData(storage)) restoreSnapshot(uid, storage);
    return;
  }

  if (activeUid) saveSnapshot(activeUid, storage);
  clearUserData(storage);
  restoreSnapshot(uid, storage);
  storage.setItem(ACTIVE_UID_KEY, uid);
}

export function saveActiveSessionSnapshot(uid, storage = localStorage) {
  const activeUid = getActiveSessionUid(storage) || uid;
  saveSnapshot(activeUid, storage);
}

export function archiveAndClearActiveSession(uid, storage = localStorage) {
  const activeUid = getActiveSessionUid(storage) || uid;
  saveSnapshot(activeUid, storage);
  clearUserData(storage);
  storage.removeItem(ACTIVE_UID_KEY);
}
