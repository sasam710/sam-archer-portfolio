import assert from "node:assert/strict";
import test from "node:test";
import { DEBUG_SCENARIOS, patternRows } from "./debug-model.ts";

test("three sample scenarios cover resolve and escalate", () => {
  assert.equal(DEBUG_SCENARIOS.length, 3);
  assert.deepEqual(
    DEBUG_SCENARIOS.map((scenario) => scenario.decision),
    ["resolve", "resolve", "escalate"],
  );
  assert.deepEqual(
    DEBUG_SCENARIOS.map((scenario) => scenario.hypothesis),
    ["customer", "customer", "platform"],
  );
});

test("every log mixes context with a real pattern", () => {
  const statuses = new Set<number>();
  for (const scenario of DEBUG_SCENARIOS) {
    assert.ok(scenario.logs.some((row) => row.status === 200), scenario.id);
    const pattern = patternRows(scenario);
    assert.ok(pattern.length >= 3, scenario.id);
    for (const row of scenario.logs) {
      statuses.add(row.status);
      assert.equal(scenario.logs.filter((item) => item.id === row.id).length, 1, row.id);
    }
  }
  assert.deepEqual([...statuses].sort((a, b) => a - b), [200, 401, 429, 500]);
});

test("the pattern matches the failure mode", () => {
  const [rotated, limited, deploy] = DEBUG_SCENARIOS;
  assert.ok(patternRows(rotated).every((row) => row.status === 401));
  assert.ok(patternRows(limited).every((row) => row.status === 429));
  assert.ok(patternRows(deploy).every((row) => row.status === 500));
  assert.ok(patternRows(deploy).every((row) => row.message.includes("2026.11.24.1")));
  assert.equal(rotated.reply.includes("req_8c21"), true);
  assert.equal(limited.reply.includes("Retry-After"), true);
  assert.equal(deploy.repro.some((line) => line.value.includes("req_b110")), true);
  assert.equal(deploy.repro.some((line) => line.value.includes("Jira or Linear")), true);
});
