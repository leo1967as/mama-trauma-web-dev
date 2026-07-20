import test from "node:test";
import assert from "node:assert/strict";

import { mergeFirestoreProfile } from "../src/lib/user-data.js";

test("Firestore profile maps into onboarding data without overwriting local values or consent", () => {
  assert.deepEqual(mergeFirestoreProfile({
    name: "Cloud name",
    phone: "0812345678",
    delivery_date: "2026-01-02",
    health_data_consent: true,
  }, {
    preferred_name: "Local name",
  }), {
    mother_name: "Cloud name",
    phone: "0812345678",
    baby_birth_date: "2026-01-02",
    health_data_consent: true,
    preferred_name: "Local name",
    complete: true,
  });
});

test("legacy camelCase profile fields also restore a returning user's setup", () => {
  assert.equal(mergeFirestoreProfile({
    motherName: "แม่เก่า",
    legalFirstName: "Old",
    legalLastName: "Name",
    preferredName: "แม่เก่า",
    deliveryDate: "2025-12-20",
    isFirstTimeMother: false,
    preferredCheckinTime: "08:00",
    healthDataConsent: false,
    consentAt: null,
  }).complete, true);
  assert.deepEqual(mergeFirestoreProfile({
    motherName: "แม่เก่า",
    legalFirstName: "Old",
    legalLastName: "Name",
    preferredName: "แม่เก่า",
    deliveryDate: "2025-12-20",
    isFirstTimeMother: false,
    preferredCheckinTime: "08:00",
    healthDataConsent: false,
    consentAt: null,
  }), {
    mother_name: "แม่เก่า",
    legal_first_name: "Old",
    legal_last_name: "Name",
    preferred_name: "แม่เก่า",
    baby_birth_date: "2025-12-20",
    is_first_time_mother: false,
    preferred_checkin_time: "08:00",
    health_data_consent: false,
    consent_at: null,
    complete: true,
  });
});
