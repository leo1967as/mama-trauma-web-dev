import test from "node:test";
import assert from "node:assert/strict";
import { deriveAlerts } from "../Admin-Dashboard/src/lib/alerts.js";

const mother = (patch = {}) => ({ id: "m1", name: "Sia", postpartumStage: "Week 2", case_status: "none", ...patch });

test("dashboard flags trend and safety access without turning them into callback requests", () => {
  assert.equal(deriveAlerts([mother({ low_composite_trend: true })])[0]?.type, "low_composite_trend");
  assert.equal(deriveAlerts([mother({ safety_access_used: true })])[0]?.type, "safety_access");
  assert.equal(deriveAlerts([mother({ support_request: true, safety_access_used: true })])[0]?.type, "need_help");
  assert.deepEqual(deriveAlerts([mother({ case_status: "resolved", support_request: true })]), []);
});

test("dashboard opens high-risk tag alerts from camelCase and snake_case classes without immediate level", () => {
  const camel = deriveAlerts([mother({ supportLevel: "gentle", problemTagClasses: ["high"], lastCheckIn: "2026-07-15T09:00:00Z" })])[0];
  const snake = deriveAlerts([mother({ support_level: "gentle", problem_tag_classes: ["high"], last_check_in: "2026-07-15T09:00:00Z" })])[0];

  assert.equal(camel?.type, "high_risk_tag");
  assert.notEqual(camel?.type, "high_risk");
  assert.equal(snake?.type, "high_risk_tag");
});
