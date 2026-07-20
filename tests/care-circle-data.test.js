import test from "node:test";
import assert from "node:assert/strict";
import { CAREGIVERS, THERAPISTS } from "../src/lib/therapy-data.js";

test("Care Circle mock data matches the source categories and counts", () => {
  assert.equal(CAREGIVERS.length, 12);
  assert.equal(THERAPISTS.length, 5);
  assert.deepEqual(new Set(CAREGIVERS.map((provider) => provider.category)), new Set(["Nanny", "Midwife", "Lactation Consultant", "Postnatal Massage"]));
  for (const provider of [...CAREGIVERS, ...THERAPISTS]) {
    for (const field of ["provider_id", "name", "profile_photo", "category", "sub_specialty", "bio", "experience", "expertise", "hourly_rate", "rating", "review_count", "availability"]) {
      assert.ok(Object.hasOwn(provider, field), `${provider.id} is missing ${field}`);
    }
  }
});
