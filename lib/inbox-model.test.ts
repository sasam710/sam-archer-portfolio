import assert from "node:assert/strict";
import test from "node:test";
import {
  BANDS,
  MACROS,
  POINTS,
  RULE_BOOK,
  SAMPLE_TICKETS,
  buildQueue,
  fillMacro,
  formatWait,
  isIncidentCandidate,
  macroById,
} from "./inbox-model.ts";

const expectedPriority = {
  "T-1042": "P1",
  "T-1048": "P1",
  "T-1055": "P1",
  "T-1033": "P2",
  "T-1051": "P2",
  "T-0988": "P2",
  "T-1019": "P3",
  "T-1007": "P3",
  "T-1022": "P4",
  "T-0994": "P4",
} as const;

const expectedMacro = {
  "T-1042": "incident-ack",
  "T-1048": "incident-ack",
  "T-1055": "incident-ack",
  "T-1033": "sync-one-seat",
  "T-1051": "outlook-loop",
  "T-0988": "draft-quality",
  "T-1019": "billing-double-charge",
  "T-1007": "saml-rollout",
  "T-1022": "howto-weekend-pause",
  "T-0994": "feature-calendar",
} as const;

test("sample queue has 10 tickets and one incident group", () => {
  assert.equal(SAMPLE_TICKETS.length, 10);
  const queue = buildQueue(SAMPLE_TICKETS);
  assert.ok(queue.cluster);
  assert.deepEqual(queue.cluster?.ticketIds, ["T-1042", "T-1048", "T-1055"]);
  assert.equal(queue.cluster?.summary.includes("3 tickets"), true);
});

test("priorities, macros, and score lines stay explainable", () => {
  const queue = buildQueue(SAMPLE_TICKETS);
  assert.equal(queue.items.length, SAMPLE_TICKETS.length);

  for (const item of queue.items) {
    const id = item.ticket.id as keyof typeof expectedPriority;
    assert.equal(item.triage.priority, expectedPriority[id], id);
    assert.equal(item.triage.macroId, expectedMacro[id], id);
    assert.ok(MACROS[item.triage.macroId], item.triage.macroId);
    assert.equal(
      item.triage.lines.reduce((sum, line) => sum + line.points, 0),
      item.triage.score,
      id,
    );
    assert.ok(item.triage.lines.length >= 1);
    assert.equal(item.triage.lines[0]?.id, "base");

    const filled = fillMacro(macroById(item.triage.macroId).body, item.ticket);
    assert.equal(filled.includes("{{"), false, id);
    assert.equal(filled.includes(item.ticket.firstName), true, id);
  }
});

test("the single-seat sync issue stays out of the incident", () => {
  const queue = buildQueue(SAMPLE_TICKETS);
  const priya = queue.items.find((item) => item.ticket.id === "T-1033");
  assert.ok(priya);
  assert.equal(priya.triage.clusterId, null);
  assert.equal(isIncidentCandidate(priya.ticket), false);
  assert.equal(
    priya.triage.notes.some((note) => note.includes("stays out of the incident group")),
    true,
  );
});

test("evidence quotes are copied from the ticket text", () => {
  for (const ticket of SAMPLE_TICKETS) {
    const haystack = `${ticket.subject}\n${ticket.body}`;
    for (const snippet of Object.values(ticket.evidence)) {
      assert.equal(haystack.includes(snippet), true, `${ticket.id}: ${snippet}`);
    }
    const spread = ticket.tags.includes("multi-user");
    const single = ticket.tags.includes("single-user");
    assert.equal(spread && single, false, ticket.id);
  }
});

test("rule book quotes the live point values", () => {
  const text = RULE_BOOK.map((rule) => rule.text).join(" ");
  for (const value of [POINTS.base, POINTS.multiUser, POINTS.core, POINTS.cluster, BANDS.p1]) {
    assert.equal(text.includes(String(value)), true, String(value));
  }
});

test("wait labels stay plain", () => {
  assert.equal(formatWait(9), "9 min");
  assert.equal(formatWait(46), "46 min");
  assert.equal(formatWait(74), "1 hr 14 min");
  assert.equal(formatWait(95), "1 hr 35 min");
  assert.equal(formatWait(60), "1 hr");
  assert.equal(formatWait(2880), "2 days");
});
