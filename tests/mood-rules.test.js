import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Vite resolves extensionless app imports; evaluate the pure rule block directly for node:test.
const source = readFileSync(new URL("../src/lib/mood-data.js", import.meta.url), "utf8");
const firebaseSource = readFileSync(new URL("../src/lib/firebase-sync.js", import.meta.url), "utf8");
const ruleBlock = source.slice(source.indexOf("export const CANONICAL_PROBLEM_TAGS"), source.indexOf("export function getMoodHistory"));
const rules = new Function(`${ruleBlock.replaceAll("export ", "")}\nreturn { CANONICAL_PROBLEM_TAGS, calculateComposite, classifyProblemTag, getMoodSupportLevel, isPhase2Triggered, normalizeEntry, normalizeProblemTags };`)();
const { CANONICAL_PROBLEM_TAGS, calculateComposite, classifyProblemTag, getMoodSupportLevel, isPhase2Triggered, normalizeEntry, normalizeProblemTags } = rules;

const answers = (moodScore, sleepScore, energyScore, worryScore) => ({ moodScore, sleepScore, energyScore, worryScore });

test("weighted composite uses mood twice and raw worry reversed", () => {
  assert.equal(calculateComposite(answers(3, 4, 5, 2)), 3.8);
  assert.equal(calculateComposite(answers(3, null, 5, 2)), null);
});

test("phase 2 thresholds use raw worry and core scores", () => {
  assert.equal(isPhase2Triggered(answers(3, 3, 3, 5)), true);
  assert.equal(isPhase2Triggered(answers(1, 5, 5, 1)), true);
  assert.equal(isPhase2Triggered(answers(3, 3, 3, 1)), false);
});

test("support level precedence and tag classes", () => {
  assert.equal(getMoodSupportLevel({ ...answers(4, 4, 4, 1), supportRequest: true }), "steady");
  assert.equal(getMoodSupportLevel({ ...answers(1, 1, 2, 5), babyConnectionScore: 1 }), "immediate");
  assert.equal(getMoodSupportLevel({ ...answers(1, 1, 1, 5), problemTags: ["overwhelmed"] }), "immediate");
  assert.equal(getMoodSupportLevel({ ...answers(2, 4, 4, 4) }), "extra");
  assert.equal(getMoodSupportLevel({ ...answers(3, 3, 3, 2) }), "gentle");
  assert.equal(getMoodSupportLevel({ ...answers(4, 4, 4, 1) }), "steady");
  assert.equal(CANONICAL_PROBLEM_TAGS.length, 23);
  assert.equal(classifyProblemTag("overwhelmed"), "critical");
  assert.equal(classifyProblemTag("partner_support"), "high");
  assert.equal(classifyProblemTag("feeding"), "monitoring");
  assert.deepEqual(CANONICAL_PROBLEM_TAGS.map(({ id }) => id), [
    "exhaustion", "sleep_deprivation", "body_image_worry", "body_pain", "recovery_after_birth",
    "baby_crying", "feeding", "baby_health_worry", "lonely", "overwhelmed", "irritable_angry",
    "not_good_enough_mother", "adapting_to_motherhood", "unresolved_grief", "partner_relationship",
    "partner_support", "family_stress", "privacy_personal_space", "household_responsibilities",
    "financial_worry", "return_to_work_stress", "unsure", "other",
  ]);
  assert.equal(CANONICAL_PROBLEM_TAGS.some(({ id }) => ["anxiety", "intrusive_thoughts", "identity_change", "safety_concern"].includes(id)), false);
  assert.deepEqual(normalizeProblemTags(["Feeling overwhelmed and unable to cope", "partner_support", "feeding"]), ["overwhelmed", "partner_support"]);
});

test("snake_case entries remain readable without B2B support fields", () => {
  const normalized = normalizeEntry({ date_key: "2026-07-14", mood_score: 2, sleep_score: 3, energy_score: 4, worry_score: 5, support_request: true, problem_tags: ["lonely"] });
  assert.equal(normalized.dateKey, "2026-07-14");
  assert.equal(normalized.supportLevel, "extra");
  assert.deepEqual(normalized.problemTagClasses, ["critical"]);
  assert.equal(Object.hasOwn(normalized, "supportRequest"), false);
  assert.equal(Object.hasOwn(normalized, "worryAdjustedScore"), false);
  assert.doesNotMatch(firebaseSource, /adjusted_worry\s*:/);
});

test("high tags stay non-immediate while critical tags still escalate", () => {
  const highOnly = normalizeEntry({ date_key: "2026-07-15", mood_score: 3, sleep_score: 3, energy_score: 3, worry_score: 3, problem_tags: ["partner_support"] });
  assert.equal(highOnly.supportLevel, "gentle");
  assert.deepEqual(highOnly.problemTagClasses, ["high"]);

  const critical = normalizeEntry({ date_key: "2026-07-15", mood_score: 1, sleep_score: 1, energy_score: 1, worry_score: 5, problem_tags: ["overwhelmed"] });
  assert.equal(critical.supportLevel, "immediate");
  assert.deepEqual(critical.problemTagClasses, ["critical"]);
});
