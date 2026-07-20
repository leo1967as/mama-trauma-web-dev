import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("elevated check-in actions include the existing Care Circle route", () => {
  const checkin = read("src/components/afterbloom/CheckInFlow.jsx");
  const english = read("src/lib/i18n/en.json");
  const thai = read("src/lib/i18n/th.json");

  assert.match(checkin, /key === "care_circle"/);
  assert.match(english, /"key": "care_circle"/);
  assert.match(thai, /"key": "care_circle"/);
  assert.doesNotMatch(checkin, /support_request|hospital_contact_initiated/);
});

test("Admin active graph is read-only and excludes B2B surfaces", () => {
  const app = read("Admin-Dashboard/src/App.jsx");
  const dashboard = read("Admin-Dashboard/src/pages/Dashboard.jsx");
  const detail = read("Admin-Dashboard/src/pages/MotherDetail.jsx");
  const timeline = read("Admin-Dashboard/src/components/detail/CareTimeline.jsx");
  const firestore = read("Admin-Dashboard/src/lib/firestore.js");
  const rules = read("firestore.rules");

  for (const route of ["/alerts", "/messages", "/reports", "/resources", "/settings"]) {
    assert.doesNotMatch(app, new RegExp(`path=\\"${route}\\"`));
  }
  assert.doesNotMatch(dashboard, /AlertPanel|Help Requests|ขอความช่วยเหลือ/);
  assert.doesNotMatch(detail, /ActionPanel|CareNotes|hospital protocol|โรงพยาบาล/);
  assert.doesNotMatch(timeline, /useCaseNotes|case_notes|caseStatus|CareNotes/);
  assert.match(firestore, /READ_ONLY_ERROR/);
  assert.doesNotMatch(firestore, /updateDoc|addDoc|serverTimestamp/);
  assert.match(rules, /allow read: if[\s\S]*isStaff\(\);/);
  assert.doesNotMatch(rules, /allow read, write: if isStaff\(\);/);
});
