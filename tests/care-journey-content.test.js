import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CARE_JOURNEY_EN, CARE_JOURNEY_HOTLINE, CARE_JOURNEY_TH } from "../src/lib/care-journey-data.js";

const thaiCopy = JSON.parse(readFileSync(new URL("../src/lib/i18n/th.json", import.meta.url), "utf8"));

test("approved Thai Care Journey has nine complete phases and permanent 1323 support", () => {
  assert.equal(CARE_JOURNEY_TH.length, 9);
  for (const phase of CARE_JOURNEY_TH) {
    for (const field of ["feel", "body", "watchOut", "tips", "sources"]) {
      assert.ok(phase[field].trim(), `${phase.range} ${field}`);
    }
  }
  assert.deepEqual(CARE_JOURNEY_TH.filter(phase => phase.epdsPrompt).map(phase => phase.range), ["Week 2–3", "Week 4–6", "Month 7–9"]);
  for (const phase of CARE_JOURNEY_TH) {
    const label = thaiCopy.careJourney.ranges[phase.range];
    assert.ok(label && !/[A-Za-z]/.test(label), `${phase.range} range translation`);
  }
  assert.equal(thaiCopy.careJourney.sourcesLabel, undefined);
  assert.match(CARE_JOURNEY_HOTLINE, /1323/);
});

test("English Care Journey mirrors all nine Thai detail phases", () => {
  assert.equal(CARE_JOURNEY_EN.length, CARE_JOURNEY_TH.length);
  for (const phase of CARE_JOURNEY_EN) {
    for (const field of ["feel", "body", "watchOut", "tips", "sources"]) {
      assert.ok(phase[field].trim(), `${phase.range} ${field}`);
    }
  }
  assert.deepEqual(CARE_JOURNEY_EN.filter(phase => phase.epdsPrompt).map(phase => phase.range), ["Week 2–3", "Week 4–6", "Month 7–9"]);
  assert.match(CARE_JOURNEY_EN[0].feel, /mother|baby/i);
  assert.doesNotMatch(CARE_JOURNEY_EN[0].feel, /คุณแม่/);
});

test("Care Timeline renders the localized full journey and routes help through its parent", () => {
  const source = readFileSync(new URL("../src/components/afterbloom/CareTimeline.jsx", import.meta.url), "utf8");
  assert.match(source, /lang === "th"/);
  assert.doesNotMatch(source, /<details/);
  assert.doesNotMatch(source, /sourcesLabel/);
  assert.match(source, /onClick=\{onNeedHelp\}/);
  assert.match(source, /CARE_JOURNEY_HOTLINE/);
  assert.doesNotMatch(source, /pendingTranslation/);
  assert.match(source, /CARE_JOURNEY_EN/);
  assert.match(source, /const journey = lang === "th"/);
  assert.match(source, /setTimeout\(\(\) =>/);
  assert.match(source, /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/);
  assert.match(source, /scrollMarginTop: "5vh"/);
  assert.doesNotMatch(source, /TRIGGER_STAGES/);
});
