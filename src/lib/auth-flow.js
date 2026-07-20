export const AUTH_INTENT_KEY = "afterbloom_auth_intent";
const APP_AUTH_DOMAINS = new Set([
  "afterbloom-app.vercel.app",
  "mama-trauma-web-dev.vercel.app",
]);
const FIREBASE_AUTH_DOMAIN = "afterbloom-18d15.firebaseapp.com";

export function firebaseAuthDomain(hostname = globalThis.location?.hostname || "") {
  return APP_AUTH_DOMAINS.has(hostname) ? hostname : FIREBASE_AUTH_DOMAIN;
}

export function isEmbeddedBrowser(userAgent = globalThis.navigator?.userAgent || "") {
  return /FBAN|FBAV|Instagram|Line\/|; wv\)/i.test(userAgent);
}

export function authErrorKey(code) {
  switch (code) {
    case "embedded-browser": return "embeddedBrowser";
    case "auth/unauthorized-domain": return "unauthorizedDomain";
    case "auth/popup-blocked": return "popupBlocked";
    case "auth/popup-closed-by-user": return "popupClosed";
    case "auth/web-storage-unsupported": return "webStorageUnsupported";
    default: return "authFailed";
  }
}

export function readAuthIntent(storage) {
  try { return (storage || globalThis.sessionStorage).getItem(AUTH_INTENT_KEY); } catch { return null; }
}

export function setAuthIntent(storage) {
  try {
    (storage || globalThis.sessionStorage).setItem(AUTH_INTENT_KEY, "onboarding");
    return true;
  } catch {
    return false;
  }
}

export function clearAuthIntent(storage) {
  try { (storage || globalThis.sessionStorage).removeItem(AUTH_INTENT_KEY); } catch {}
}
