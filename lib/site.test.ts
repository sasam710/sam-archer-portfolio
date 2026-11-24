import assert from "node:assert/strict";
import test from "node:test";
import { PRODUCTION_SITE_URL, resolveSiteUrl } from "./site.ts";

test("the public site URL does not follow the deployment host", () => {
  assert.equal(resolveSiteUrl(undefined), PRODUCTION_SITE_URL);
  assert.equal(resolveSiteUrl(""), PRODUCTION_SITE_URL);
  assert.equal(resolveSiteUrl("   "), PRODUCTION_SITE_URL);
  assert.equal(resolveSiteUrl("https://sam-archer.vercel.app/"), "https://sam-archer.vercel.app");
  assert.equal(PRODUCTION_SITE_URL, "https://sam-archer.vercel.app");
});
