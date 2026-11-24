/**
 * Sample integration logs for the debug demo.
 * Fictional customer. The exercise runs entirely in the browser.
 */

export type HttpStatus = 200 | 401 | 429 | 500;
export type Hypothesis = "customer" | "platform";
export type Decision = "resolve" | "escalate";

export interface LogRow {
  id: string;
  time: string;
  method: "GET" | "POST";
  endpoint: string;
  status: HttpStatus;
  requestId: string;
  latencyMs: number;
  message: string;
  pattern: boolean;
}

export interface ReproLine {
  label: string;
  value: string;
}

export interface DebugScenario {
  id: string;
  title: string;
  from: string;
  company: string;
  subject: string;
  body: string;
  logs: readonly LogRow[];
  patternSummary: string;
  hypothesis: Hypothesis;
  hypothesisWhy: string;
  hypothesisWrong: string;
  decision: Decision;
  decisionWhy: string;
  decisionWrong: string;
  reply: string;
  repro: readonly ReproLine[];
}

export const HYPOTHESIS_LABEL: Record<Hypothesis, string> = {
  customer: "Customer configuration",
  platform: "Platform side",
};

export const DECISION_LABEL: Record<Decision, string> = {
  resolve: "Resolve with the customer",
  escalate: "Escalate to engineering",
};

export const DEBUG_SCENARIOS: readonly DebugScenario[] = [
  {
    id: "rotated-key",
    title: "Webhooks stopped after a key change",
    from: "Mina Patel, engineer",
    company: "Kindling Studio",
    subject: "Our webhooks stopped syncing since this morning",
    body: "The subscription still shows active in the dashboard. Events stopped reaching our receiver around 8:10am CT. We rotated an API key last night. Nothing else on our side was supposed to change.",
    logs: [
      {
        id: "rk-1",
        time: "02:14:08 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 429,
        requestId: "req_7a02",
        latencyMs: 118,
        message: "Rate limit. Retry-After 30s. One overnight burst, then deliveries recovered.",
        pattern: false,
      },
      {
        id: "rk-2",
        time: "07:40:11 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 200,
        requestId: "req_8b70",
        latencyMs: 48,
        message: "Delivered to receiver.kindling.example.",
        pattern: false,
      },
      {
        id: "rk-3",
        time: "08:04:02 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 200,
        requestId: "req_8c02",
        latencyMs: 51,
        message: "Delivered to receiver.kindling.example.",
        pattern: false,
      },
      {
        id: "rk-4",
        time: "08:12:19 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 401,
        requestId: "req_8c21",
        latencyMs: 36,
        message: "Signing key rejected. Receiver still has the previous secret.",
        pattern: true,
      },
      {
        id: "rk-5",
        time: "08:13:01 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 401,
        requestId: "req_8c44",
        latencyMs: 34,
        message: "Signing key rejected. Same receiver, same subscription.",
        pattern: true,
      },
      {
        id: "rk-6",
        time: "08:20:44 CT",
        method: "GET",
        endpoint: "/v1/subscriptions/sub_91",
        status: 200,
        requestId: "req_8c70",
        latencyMs: 40,
        message: "Subscription active. Dashboard state matches this read.",
        pattern: false,
      },
      {
        id: "rk-7",
        time: "08:41:27 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 401,
        requestId: "req_8d02",
        latencyMs: 38,
        message: "Signing key rejected again. No other workspace in this window.",
        pattern: true,
      },
      {
        id: "rk-8",
        time: "Yesterday 19:12 CT",
        method: "GET",
        endpoint: "/v1/health",
        status: 500,
        requestId: "req_6aa1",
        latencyMs: 2204,
        message: "Upstream timeout on a health check. Isolated, and not this morning.",
        pattern: false,
      },
    ],
    patternSummary:
      "Deliveries were 200 until 08:12 CT, then every POST to /v1/webhooks/deliver is 401 with the signing key rejected. The subscription read is still 200. The overnight 429 recovered, and the 500 was yesterday on a different endpoint.",
    hypothesis: "customer",
    hypothesisWhy:
      "The message names the signing key, the failure starts after they rotated a secret, and only this receiver is affected. The platform can still read the subscription.",
    hypothesisWrong:
      "A platform fault usually shows up on more than one workspace, and it does not say the signing key was rejected. The subscription read is still 200.",
    decision: "resolve",
    decisionWhy:
      "Engineering cannot update a secret on the customer receiver. The reply should name the 401s, the request IDs, and the replay once they save the current key.",
    decisionWrong:
      "Escalating this sends engineering a customer configuration change. They will bounce it back, and the events stay stuck.",
    reply: `Hello Mina,

The subscription is still active. Deliveries were succeeding, then at 08:12 CT POST /v1/webhooks/deliver started returning 401. The message is that the signing key was rejected. That matches the key rotation last night.

Save the current signing secret on receiver.kindling.example. Reply here when that is done and I will replay from 08:12. Request IDs on your side: req_8c21, req_8c44, req_8d02.

This is the receiver configuration, so I am not sending it to engineering.

Sam Archer
Product support`,
    repro: [
      { label: "Not filed", value: "A customer key change does not need an engineering package." },
    ],
  },
  {
    id: "rate-limit",
    title: "Sync slowed after a large import",
    from: "Jonah Blake, operations",
    company: "Fieldnote",
    subject: "Event sync fell behind after this morning's import",
    body: "We imported a large list just after 9am CT. The dashboard shows the jobs retrying, and new events are slow to appear. Can you see whether the sync is down?",
    logs: [
      {
        id: "rl-1",
        time: "06:02:18 CT",
        method: "GET",
        endpoint: "/v1/health",
        status: 500,
        requestId: "req_90aa",
        latencyMs: 1804,
        message: "Upstream timeout on health. Hours before the import, and it recovered.",
        pattern: false,
      },
      {
        id: "rl-2",
        time: "08:50:03 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 401,
        requestId: "req_91c0",
        latencyMs: 29,
        message: "Test key rejected. A sandbox key, not the import.",
        pattern: false,
      },
      {
        id: "rl-3",
        time: "09:00:12 CT",
        method: "POST",
        endpoint: "/v1/events",
        status: 200,
        requestId: "req_9a01",
        latencyMs: 62,
        message: "Event accepted for the Fieldnote workspace.",
        pattern: false,
      },
      {
        id: "rl-4",
        time: "09:05:40 CT",
        method: "POST",
        endpoint: "/v1/events",
        status: 200,
        requestId: "req_9a08",
        latencyMs: 70,
        message: "Event accepted. Import rate is climbing.",
        pattern: false,
      },
      {
        id: "rl-5",
        time: "09:11:06 CT",
        method: "POST",
        endpoint: "/v1/events",
        status: 429,
        requestId: "req_9a10",
        latencyMs: 88,
        message: "Rate limit on this key. Retry-After 30s.",
        pattern: true,
      },
      {
        id: "rl-6",
        time: "09:12:11 CT",
        method: "POST",
        endpoint: "/v1/events",
        status: 200,
        requestId: "req_9a14",
        latencyMs: 74,
        message: "A smaller batch was accepted on the same key.",
        pattern: false,
      },
      {
        id: "rl-7",
        time: "09:12:44 CT",
        method: "POST",
        endpoint: "/v1/events",
        status: 429,
        requestId: "req_9a18",
        latencyMs: 91,
        message: "Rate limit. Retry-After 30s. Same import key.",
        pattern: true,
      },
      {
        id: "rl-8",
        time: "09:14:02 CT",
        method: "POST",
        endpoint: "/v1/events",
        status: 429,
        requestId: "req_9a22",
        latencyMs: 96,
        message: "Rate limit. Retry-After 30s. No other workspace in these rows.",
        pattern: true,
      },
    ],
    patternSummary:
      "POST /v1/events starts returning 429 with Retry-After 30s once the import rate jumps. The same key still gets 200s on smaller batches. The 500 and the 401 are earlier, on other calls, and they are not the slowdown.",
    hypothesis: "customer",
    hypothesisWhy:
      "The limit names this key, tells the client how long to wait, and still accepts smaller batches. That is the import running ahead of its allowance, not a platform outage.",
    hypothesisWrong:
      "A platform incident would not keep returning 200s on the same key between 429s, and it would not be confined to one import.",
    decision: "resolve",
    decisionWhy:
      "The customer can slow the batch size or wait out Retry-After. Engineering does not need a ticket for a limit that is behaving as written.",
    decisionWrong:
      "Escalating one import will not change the Retry-After. It pulls engineering onto a limit that is doing what it says.",
    reply: `Hello Jonah,

The sync is not down. POST /v1/events started returning 429 at 09:11 CT, with Retry-After 30s, once the import rate jumped. Smaller batches on the same key are still 200.

Slow the batch size, or wait out the window in Retry-After, and the queue will catch up. Request IDs: req_9a10, req_9a18, req_9a22.

I am not escalating this. The limit is behaving as written for this key.

Sam Archer
Product support`,
    repro: [
      { label: "Not filed", value: "A single key at its rate limit does not need an engineering package." },
    ],
  },
  {
    id: "deploy-500",
    title: "Deliveries failed after the morning release",
    from: "Ruth Keller, support manager",
    company: "Kindling Studio",
    subject: "Webhooks stopped for us and for another workspace",
    body: "Since about 09:40am CT, webhook deliveries are failing for Kindling Studio and for Fieldnote, which we also support. The dashboard shows the failures. We did not rotate keys this morning.",
    logs: [
      {
        id: "dp-1",
        time: "08:50:22 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 401,
        requestId: "req_b040",
        latencyMs: 31,
        message: "Test key rejected. A sandbox subscription, before the release.",
        pattern: false,
      },
      {
        id: "dp-2",
        time: "09:15:47 CT",
        method: "POST",
        endpoint: "/v1/events",
        status: 429,
        requestId: "req_b070",
        latencyMs: 102,
        message: "Rate limit on an unrelated import key. Retry-After 30s. Not the webhook path.",
        pattern: false,
      },
      {
        id: "dp-3",
        time: "09:30:05 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 200,
        requestId: "req_b090",
        latencyMs: 84,
        message: "Delivered for Kindling Studio.",
        pattern: false,
      },
      {
        id: "dp-4",
        time: "09:41:12 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 500,
        requestId: "req_b110",
        latencyMs: 8044,
        message: "Upstream timeout. Release 2026.11.24.1. Workspace Kindling Studio.",
        pattern: true,
      },
      {
        id: "dp-5",
        time: "09:42:03 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 500,
        requestId: "req_b118",
        latencyMs: 8310,
        message: "Upstream timeout. Release 2026.11.24.1. Workspace Fieldnote.",
        pattern: true,
      },
      {
        id: "dp-6",
        time: "09:44:28 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 500,
        requestId: "req_b130",
        latencyMs: 7902,
        message: "Upstream timeout. Release 2026.11.24.1. Kindling Studio again.",
        pattern: true,
      },
      {
        id: "dp-7",
        time: "09:46:51 CT",
        method: "POST",
        endpoint: "/v1/webhooks/deliver",
        status: 500,
        requestId: "req_b141",
        latencyMs: 8220,
        message: "Upstream timeout. Release 2026.11.24.1. Fieldnote again.",
        pattern: true,
      },
      {
        id: "dp-8",
        time: "09:48:16 CT",
        method: "GET",
        endpoint: "/v1/subscriptions/sub_22",
        status: 200,
        requestId: "req_b160",
        latencyMs: 44,
        message: "Subscription read still succeeds. The dashboard can load. Delivery does not.",
        pattern: false,
      },
    ],
    patternSummary:
      "POST /v1/webhooks/deliver was 200 at 09:30 CT. From 09:41 it is a cluster of 500s, about 8 seconds each, on two workspaces, and every failure names release 2026.11.24.1. The 401 and the 429 are different calls and earlier.",
    hypothesis: "platform",
    hypothesisWhy:
      "Two workspaces break on the same endpoint at the same minute, and the message names the release. The customer did not rotate keys. A subscription read still returns 200, so this is the delivery path.",
    hypothesisWrong:
      "A customer configuration problem stays on one receiver. It does not start for two workspaces at the release, and it does not return 500 with an upstream timeout.",
    decision: "escalate",
    decisionWhy:
      "The customer cannot fix an upstream timeout that started at a release. Engineering needs one package: request IDs, the window, the last good call, and who is waiting.",
    decisionWrong:
      "Asking both customers to rotate keys will not clear a 500 that started at the release. That delays the people who can fix it.",
    reply: `Hello Ruth,

I am not going to ask you to rotate keys. Deliveries were 200 at 09:30 CT (req_b090). From 09:41, POST /v1/webhooks/deliver returns 500 for Kindling Studio and for Fieldnote, and the message names release 2026.11.24.1.

I am escalating one note to engineering with those request IDs. I will update this thread when there is a cause or a workaround that is worth your time.

Sam Archer
Product support`,
    repro: [
      {
        label: "Symptom",
        value: "POST /v1/webhooks/deliver returns 500. Message: upstream timeout.",
      },
      {
        label: "Time window",
        value: "09:41 to 09:46 CT on 24 Nov 2026, immediately after release 2026.11.24.1.",
      },
      {
        label: "Request IDs",
        value: "req_b110, req_b118, req_b130, req_b141.",
      },
      {
        label: "Expected",
        value: "200 and a delivery, as at 09:30 CT on req_b090.",
      },
      {
        label: "Actual",
        value: "500, no delivery, latency about 8 seconds.",
      },
      {
        label: "Impact",
        value: "At least two workspaces. Customers are waiting on the events. The dashboard still loads.",
      },
      {
        label: "Steps",
        value: "Open the request IDs above. Compare them with req_b090 from before the release. No key change in these rows.",
      },
      {
        label: "Where it goes",
        value: "One ticket in Jira or Linear, and the same note in Slack so the next person does not ask the customer to start again.",
      },
    ],
  },
];

export function patternRows(scenario: DebugScenario): readonly LogRow[] {
  return scenario.logs.filter((row) => row.pattern);
}
