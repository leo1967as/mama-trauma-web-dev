import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { authErrorKey, clearAuthIntent, firebaseAuthDomain, isEmbeddedBrowser, readAuthIntent, setAuthIntent } from "../src/lib/auth-flow.js";

function storage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

test("auth intent survives the redirect boundary and can be cleared", () => {
  const fakeStorage = storage();

  assert.equal(setAuthIntent(fakeStorage), true);
  assert.equal(readAuthIntent(fakeStorage), "onboarding");
  clearAuthIntent(fakeStorage);
  assert.equal(readAuthIntent(fakeStorage), null);
});

test("embedded browser detection blocks common social WebViews", () => {
  assert.equal(isEmbeddedBrowser("Mozilla/5.0 FBAN/FB4A"), true);
  assert.equal(isEmbeddedBrowser("Mozilla/5.0 Instagram 320.0.0"), true);
  assert.equal(isEmbeddedBrowser("Mozilla/5.0 iPhone Line/14.0"), true);
  assert.equal(isEmbeddedBrowser("Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36"), false);
});

test("production auth helpers stay on the app origin", () => {
  assert.equal(firebaseAuthDomain("afterbloom-app.vercel.app"), "afterbloom-app.vercel.app");
  assert.equal(firebaseAuthDomain("mama-trauma-web-dev.vercel.app"), "mama-trauma-web-dev.vercel.app");
  assert.equal(firebaseAuthDomain("localhost"), "afterbloom-18d15.firebaseapp.com");
});

test("Vercel proxies Firebase auth helpers before the SPA fallback", () => {
  const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));

  assert.deepEqual(config.redirects, [
    {
      source: "/",
      destination: "https://afterbloom-18d15.firebaseapp.com/",
      permanent: false,
    },
  ]);

  assert.deepEqual(config.rewrites.slice(0, 2), [
    {
      source: "/__/auth/:path*",
      destination: "https://afterbloom-18d15.firebaseapp.com/__/auth/:path*",
    },
    {
      source: "/__/firebase/init.json",
      destination: "https://afterbloom-18d15.firebaseapp.com/__/firebase/init.json",
    },
  ]);
  assert.deepEqual(config.rewrites.at(-1), { source: "/(.*)", destination: "/index.html" });
});

test("Firebase auth errors map to localized UI keys", () => {
  assert.equal(authErrorKey("auth/unauthorized-domain"), "unauthorizedDomain");
  assert.equal(authErrorKey("embedded-browser"), "embeddedBrowser");
  assert.equal(authErrorKey("auth/unknown-error"), "authFailed");
});
