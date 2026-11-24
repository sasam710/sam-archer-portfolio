import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { changelog } from "./changelog.ts";

test("CHANGELOG.md mirrors the changelog page", () => {
  const markdown = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8");
  assert.ok(changelog.length >= 1);
  for (const entry of changelog) {
    assert.equal(markdown.includes(entry.version), true, entry.version);
    assert.equal(markdown.includes(entry.date), true, entry.date);
    for (const note of entry.notes) {
      assert.equal(markdown.includes(note), true, note);
    }
  }
});
