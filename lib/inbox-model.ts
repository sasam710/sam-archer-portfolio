/**
 * Client-side triage for the portfolio demo.
 * Sample tickets only. Postroom is a fictional AI email assistant.
 * Point values live in POINTS so the rule book and the scorer stay aligned.
 */

export const PRODUCT = "Postroom";

export const POINTS = {
  base: 8,
  multiUser: 30,
  core: 24,
  singleCore: 14,
  trust: 16,
  access: 14,
  blocked: 12,
  billing: 6,
  admin: 6,
  howTo: 3,
  feature: 2,
  waitHour: 6,
  waitHalfHour: 3,
  cluster: 12,
} as const;

export const BANDS = {
  p1: 70,
  p2: 45,
  p3: 22,
} as const;

export const PRIORITIES = ["P1", "P2", "P3", "P4"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_META: Record<Priority, { label: string; meaning: string }> = {
  P1: {
    label: "Urgent",
    meaning: "A broken core workflow for more than one person, or a grouped incident.",
  },
  P2: {
    label: "High",
    meaning: "One person is blocked, or a draft puts trust at risk. Answer today.",
  },
  P3: {
    label: "Normal",
    meaning: "Needs a correct answer. The product is still usable.",
  },
  P4: {
    label: "Low",
    meaning: "A how-to or a feature idea. Helpful, and not a fire.",
  },
};

const TAGS = [
  "multi-user",
  "single-user",
  "core-sync",
  "core-drafts",
  "trust",
  "access",
  "billing",
  "feature",
  "how-to",
  "blocked",
  "admin",
] as const;

export type Tag = (typeof TAGS)[number];

type EvidenceKey =
  | "multiUser"
  | "singleUser"
  | "core"
  | "trust"
  | "access"
  | "billing"
  | "feature"
  | "howTo"
  | "blocked"
  | "admin";

export interface Ticket {
  id: string;
  firstName: string;
  name: string;
  role: string;
  company: string;
  subject: string;
  body: string;
  channel: "Email" | "Chat";
  plan: "Free" | "Pro" | "Business";
  waitingMinutes: number;
  tags: readonly Tag[];
  evidence: Partial<Record<EvidenceKey, string>>;
}

export interface Macro {
  id: string;
  title: string;
  useWhen: string;
  body: string;
}

export interface ScoreLine {
  id: string;
  label: string;
  detail: string;
  points: number;
}

export interface Triage {
  ticketId: string;
  score: number;
  band: Priority;
  priority: Priority;
  lines: ScoreLine[];
  notes: string[];
  macroId: string;
  macroReason: string;
  clusterId: string | null;
}

export interface Cluster {
  id: "gmail-sync-drafts";
  title: string;
  summary: string;
  ticketIds: string[];
}

export interface QueueItem {
  ticket: Ticket;
  triage: Triage;
}

export interface BuiltQueue {
  items: QueueItem[];
  cluster: Cluster | null;
}

const RANK: Record<Priority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };

function quote(text: string | undefined): string {
  if (!text) return "The ticket is tagged for this rule.";
  return `"${text}"`;
}

function bandFor(score: number): Priority {
  if (score >= BANDS.p1) return "P1";
  if (score >= BANDS.p2) return "P2";
  if (score >= BANDS.p3) return "P3";
  return "P4";
}

function moreUrgent(current: Priority, floor: Priority): Priority {
  return RANK[current] <= RANK[floor] ? current : floor;
}

function lessUrgent(current: Priority, cap: Priority): Priority {
  return RANK[current] >= RANK[cap] ? current : cap;
}

export function isIncidentCandidate(ticket: Ticket): boolean {
  const core = ticket.tags.includes("core-sync") || ticket.tags.includes("core-drafts");
  return core && ticket.tags.includes("multi-user");
}

export function hasCoreFailure(ticket: Ticket): boolean {
  return ticket.tags.includes("core-sync") || ticket.tags.includes("core-drafts");
}

export function formatWait(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days >= 1 && hours === 0 && mins === 0) {
    return days === 1 ? "1 day" : `${days} days`;
  }
  if (days >= 1) {
    const dayLabel = days === 1 ? "1 day" : `${days} days`;
    if (hours === 0) return dayLabel;
    const hourLabel = hours === 1 ? "1 hr" : `${hours} hr`;
    return `${dayLabel} ${hourLabel}`;
  }
  if (mins === 0) return hours === 1 ? "1 hr" : `${hours} hr`;
  const hourLabel = hours === 1 ? "1 hr" : `${hours} hr`;
  return `${hourLabel} ${mins} min`;
}

export function fillMacro(body: string, ticket: Ticket): string {
  return body
    .replaceAll("{{first_name}}", ticket.firstName)
    .replaceAll("{{company}}", ticket.company);
}

export const MACROS: Record<string, Macro> = {
  "incident-ack": {
    id: "incident-ack",
    title: "Incident acknowledgement",
    useWhen: "Several people lost Gmail sync or draft generation in the same window.",
    body: `Hello {{first_name}},

I am sorry the inbox is stalled. I am treating this as one incident, not a stack of separate bugs.

What we know: Gmail sync is stuck, or drafts are coming back empty, for more than one person at {{company}}, starting this morning. Gmail on the web can still look normal while ${PRODUCT} is behind.

What I am doing: grouping the matching tickets and escalating a single note to engineering with the start time, the workspace, and the deadline you mentioned.

I will update this thread when we have a cause or a workaround that is worth your time. If you already tried reconnecting one seat, you do not need to reconnect everyone.

Sam Archer
Product support`,
  },
  "sync-one-seat": {
    id: "sync-one-seat",
    title: "One account behind on sync",
    useWhen: "A single seat is behind and the rest of the workspace looks current.",
    body: `Hello {{first_name}},

Thanks for the detail, and for already trying a reconnect. I am keeping this separate from the wider sync reports because your teammates look current and this is one account.

A reasonable next step, if you have not done it since the reconnect, is to wait 15 minutes and open the missing thread once in Gmail on the web. That tells us whether ${PRODUCT} catches up on its own.

If it is still behind after that, reply here. I will escalate this account on its own, with the 6:40am timestamp, and I will not fold it into the wider incident unless the pattern starts to match.

Sam Archer
Product support`,
  },
  "billing-double-charge": {
    id: "billing-double-charge",
    title: "Duplicate annual charge",
    useWhen: "Two invoices posted for the same plan and the product still works.",
    body: `Hello {{first_name}},

Two invoices for the same annual plan, on the same morning, should not both stand. You also have a month-close date, so I am picking this up now.

I am looking up 4412 and 4418 on the {{company}} workspace. If they are a duplicate, we will reverse one and confirm the reversal in this thread. The product staying up does not make this a low priority. It does mean I can solve it with billing, without calling it an outage.

If finance needs one sentence for the books today: we have the duplicate report, and we will reverse the extra invoice if the ledger matches what you see.

Sam Archer
Product support`,
  },
  "feature-calendar": {
    id: "feature-calendar",
    title: "Log a feature idea",
    useWhen: "The customer wants a change and says nothing is broken.",
    body: `Hello {{first_name}},

Thanks for the idea, and for saying nothing is broken. That helps me route it the right way.

Calendar context in drafts is a product request. I am logging it with your example: a meeting ten minutes away, and a draft that still sounds generic. I am not marking this as an incident, and the age of the note does not change that.

If you want to add a second example, reply here and I will attach it to the same request.

Sam Archer
Product support`,
  },
  "outlook-loop": {
    id: "outlook-loop",
    title: "Outlook reconnect loop",
    useWhen: "OAuth closes and drops the person back on the connect screen.",
    body: `Hello {{first_name}},

A reconnect loop blocks the morning, so I am treating this as high priority even though Gmail on the same login works. That split is useful: the account is fine, and the Outlook connection is not.

Please stop approving the Microsoft window. Another retry will not help, and it makes the log noisier. I am escalating the loop with two facts: the window closes and lands you back on the connect screen, and Gmail on this login still works.

I will come back with either a working reconnect path or a clear bug note.

Sam Archer
Product support`,
  },
  "draft-quality": {
    id: "draft-quality",
    title: "Draft invented a policy",
    useWhen: "A draft offered a promise the company does not make, even if it was not sent.",
    body: `Hello {{first_name}},

You were right to catch that, and right to worry about the next person on your team. A draft that offers a 20% refund you do not give is a trust problem, even though it was not sent.

I am writing this up as a quality bug: the assistant invented a policy that was not in the thread. Until it is fixed, keep send in human hands, which you already do. If it would help, I can draft a short line your team can paste whenever a reply mentions a refund, credit, or legal promise you do not offer.

I am also asking product to treat an invented commercial promise as a defect, not a tone preference.

Sam Archer
Product support`,
  },
  "howto-weekend-pause": {
    id: "howto-weekend-pause",
    title: "Pause drafts on weekends",
    useWhen: "They are looking for a setting and the product is not down.",
    body: `Hello {{first_name}},

You can pause weekend drafts in ${PRODUCT} under Settings, then Assistant, then Quiet hours. Turn on Saturday and Sunday and save. The assistant should stay quiet on those days. A real sync failure can still notify you. Quiet hours only hold the drafts.

If you do not see Quiet hours, tell me whether you are in a browser or the desktop app and which plan the workspace is on. I will check whether the control is hidden there. This is a how-to, so I am not escalating it as an outage.

Sam Archer
Product support`,
  },
  "saml-rollout": {
    id: "saml-rollout",
    title: "SAML rollout steps",
    useWhen: "An admin has a go-live date and needs setup steps, not an incident bridge.",
    body: `Hello {{first_name}},

Monday is a real date, so I am keeping this on a normal priority and answering it as an implementation. It is not an outage.

SAML for ${PRODUCT}, in short:
1. In the admin console, open Security, then SAML.
2. Paste the metadata URL from your identity provider, or upload the XML.
3. Map email to the NameID. We match on the work email. We do not create a second user if that email already exists.
4. Test with one staff account at {{company}} before you assign the other 119.

If the metadata does not match, reply on this thread. I will stay on it through Monday. Send the error string, not a screenshot of a password.

Sam Archer
Product support`,
  },
};

export function macroById(id: string): Macro {
  const macro = MACROS[id];
  if (!macro) {
    throw new Error(`Unknown macro: ${id}`);
  }
  return macro;
}

function suggestMacro(ticket: Ticket, inCluster: boolean): { id: string; reason: string } {
  if (inCluster) {
    return {
      id: "incident-ack",
      reason: "Grouped with other sync or draft failures, so the first reply should acknowledge one incident.",
    };
  }
  if (ticket.tags.includes("trust")) {
    return {
      id: "draft-quality",
      reason: "The draft invented a policy. The reply should treat that as a defect and name a workaround.",
    };
  }
  if (ticket.tags.includes("billing")) {
    return {
      id: "billing-double-charge",
      reason: "This is a duplicate charge with a close date, and the product is still working.",
    };
  }
  if (ticket.tags.includes("feature")) {
    return {
      id: "feature-calendar",
      reason: "Nothing is broken. Log the idea and say it is not an incident.",
    };
  }
  if (ticket.tags.includes("access")) {
    return {
      id: "outlook-loop",
      reason: "Outlook is stuck in a connect loop. Tell them to stop retrying, then escalate that loop.",
    };
  }
  if (ticket.tags.includes("how-to")) {
    return {
      id: "howto-weekend-pause",
      reason: "They are looking for a control. Answer the path, and do not call it an outage.",
    };
  }
  if (ticket.tags.includes("admin")) {
    return {
      id: "saml-rollout",
      reason: "This is a dated rollout. Give the steps and stay on the thread.",
    };
  }
  if (ticket.tags.includes("single-user") && ticket.tags.includes("core-sync")) {
    return {
      id: "sync-one-seat",
      reason: "One account is behind. Keep it out of the incident group and give one next step.",
    };
  }
  return {
    id: "sync-one-seat",
    reason: "No closer template matched. Use the single-account sync reply and edit it.",
  };
}

function applyLimit(
  current: Priority,
  cap: Priority,
  sentence: string,
  notes: string[],
): Priority {
  const next = lessUrgent(current, cap);
  if (next === current) {
    notes.push(`${sentence} No change. It was already ${current}.`);
  } else {
    notes.push(`${sentence} The band was ${current}, so the final priority is ${next}.`);
  }
  return next;
}

function applyMinimum(
  current: Priority,
  floor: Priority,
  sentence: string,
  notes: string[],
): Priority {
  const next = moreUrgent(current, floor);
  if (next === current) {
    notes.push(`${sentence} No change. It was already ${current}.`);
  } else {
    notes.push(`${sentence} The band was ${current}, so this raises it to ${next}.`);
  }
  return next;
}

export function detectCluster(tickets: readonly Ticket[]): Cluster | null {
  const members = tickets.filter(isIncidentCandidate);
  if (members.length < 2) return null;
  return {
    id: "gmail-sync-drafts",
    title: "Suspected incident: Gmail sync and drafts",
    summary: `${members.length} tickets describe Gmail sync stalling or drafts coming back empty, for more than one person. They are scored as one incident.`,
    ticketIds: members.map((ticket) => ticket.id),
  };
}

export function triageTicket(ticket: Ticket, cluster: Cluster | null): Triage {
  const lines: ScoreLine[] = [];
  let score = 0;
  const inCluster = cluster?.ticketIds.includes(ticket.id) ?? false;

  const add = (id: string, label: string, detail: string, points: number) => {
    lines.push({ id, label, detail, points });
    score += points;
  };

  add("base", "Base", "Every ticket starts on the board.", POINTS.base);

  if (ticket.tags.includes("multi-user")) {
    add(
      "multi-user",
      "More than one person",
      quote(ticket.evidence.multiUser),
      POINTS.multiUser,
    );
  }

  if (hasCoreFailure(ticket)) {
    add(
      "core",
      "Core workflow failing",
      `${quote(ticket.evidence.core)} Sync or draft generation is broken. This is counted once, even if both are failing.`,
      POINTS.core,
    );
  }

  if (ticket.tags.includes("single-user") && hasCoreFailure(ticket)) {
    add(
      "single-core",
      "One account, core failure",
      quote(ticket.evidence.singleUser),
      POINTS.singleCore,
    );
  }

  if (ticket.tags.includes("trust")) {
    add("trust", "Trust risk", quote(ticket.evidence.trust), POINTS.trust);
  }

  if (ticket.tags.includes("access")) {
    add("access", "Connect loop", quote(ticket.evidence.access), POINTS.access);
  }

  if (ticket.tags.includes("blocked")) {
    add(
      "blocked",
      "Deadline or people waiting",
      quote(ticket.evidence.blocked),
      POINTS.blocked,
    );
  }

  if (ticket.tags.includes("billing")) {
    add("billing", "Billing question", quote(ticket.evidence.billing), POINTS.billing);
  }

  if (ticket.tags.includes("admin")) {
    add("admin", "Admin rollout", quote(ticket.evidence.admin), POINTS.admin);
  }

  if (ticket.tags.includes("how-to")) {
    add("how-to", "How-to", quote(ticket.evidence.howTo), POINTS.howTo);
  }

  if (ticket.tags.includes("feature")) {
    add("feature", "Feature idea", quote(ticket.evidence.feature), POINTS.feature);
  }

  if (ticket.waitingMinutes >= 60) {
    add(
      "wait",
      "Waiting an hour or more",
      `They have been waiting ${formatWait(ticket.waitingMinutes)}. Age adds at most ${POINTS.waitHour} points, so an old note cannot outrank a broken inbox on wait alone.`,
      POINTS.waitHour,
    );
  } else if (ticket.waitingMinutes >= 30) {
    add(
      "wait",
      "Waiting at least 30 minutes",
      `They have been waiting ${formatWait(ticket.waitingMinutes)}.`,
      POINTS.waitHalfHour,
    );
  }

  if (inCluster && cluster) {
    add(
      "cluster",
      "Grouped incident",
      `Matches ${cluster.ticketIds.length} tickets with the same pattern: multi-person Gmail sync or draft failure.`,
      POINTS.cluster,
    );
  }

  const band = bandFor(score);
  let priority = band;
  const notes: string[] = [];

  if (ticket.tags.includes("feature")) {
    priority = applyLimit(priority, "P4", "Limit: a feature idea stays P4.", notes);
  }

  if (ticket.tags.includes("how-to") && !ticket.tags.includes("blocked")) {
    priority = applyLimit(
      priority,
      "P4",
      "Limit: a how-to with no deadline stays P4.",
      notes,
    );
  }

  if (ticket.tags.includes("billing") && !hasCoreFailure(ticket)) {
    priority = applyLimit(
      priority,
      "P3",
      "Limit: billing stays at most P3 while sync and drafts are not the issue.",
      notes,
    );
  }

  if (ticket.tags.includes("access")) {
    priority = applyMinimum(priority, "P2", "Minimum: a connect loop is at least P2.", notes);
  }

  if (ticket.tags.includes("trust")) {
    priority = applyMinimum(
      priority,
      "P2",
      "Minimum: a draft that invents a promise is at least P2.",
      notes,
    );
  }

  if (ticket.tags.includes("single-user") && hasCoreFailure(ticket)) {
    priority = applyMinimum(
      priority,
      "P2",
      "Minimum: a single-account core failure is at least P2.",
      notes,
    );
  }

  if (inCluster) {
    priority = applyMinimum(priority, "P1", "Minimum: a grouped incident is P1.", notes);
  }

  if (!inCluster && hasCoreFailure(ticket) && ticket.tags.includes("single-user") && cluster) {
    notes.push(
      "This ticket stays out of the incident group. The symptom family matches, and only one account is affected.",
    );
  }

  const macro = suggestMacro(ticket, inCluster);

  return {
    ticketId: ticket.id,
    score,
    band,
    priority,
    lines,
    notes,
    macroId: macro.id,
    macroReason: macro.reason,
    clusterId: inCluster ? cluster?.id ?? null : null,
  };
}

export function buildQueue(tickets: readonly Ticket[]): BuiltQueue {
  const cluster = detectCluster(tickets);
  return {
    cluster,
    items: tickets.map((ticket) => ({
      ticket,
      triage: triageTicket(ticket, cluster),
    })),
  };
}

export const RULE_BOOK: readonly { title: string; text: string }[] = [
  {
    title: "Base",
    text: `Every ticket starts at ${POINTS.base} points so nothing is invisible.`,
  },
  {
    title: "More than one person",
    text: `Add ${POINTS.multiUser} if the note describes a team, a workspace, or coworkers, not a single seat.`,
  },
  {
    title: "Core workflow",
    text: `Add ${POINTS.core} if Gmail sync or draft generation is failing. Count it once even when both are failing.`,
  },
  {
    title: "One account",
    text: `Add ${POINTS.singleCore} more when that core failure is a single account. Widespread failures take the multi-person score instead, not both.`,
  },
  {
    title: "Trust",
    text: `Add ${POINTS.trust} if a draft invented a policy or a promise, even when the customer caught it before send.`,
  },
  {
    title: "Connect loop",
    text: `Add ${POINTS.access} if someone is stuck in a reconnect loop.`,
  },
  {
    title: "Deadline",
    text: `Add ${POINTS.blocked} if they named a deadline or said other people are waiting on them today.`,
  },
  {
    title: "Billing and rollouts",
    text: `Add ${POINTS.billing} for a billing question. Add ${POINTS.admin} for an admin rollout that is not an outage.`,
  },
  {
    title: "How-to and ideas",
    text: `Add ${POINTS.howTo} for a how-to. Add ${POINTS.feature} for a feature idea.`,
  },
  {
    title: "Waiting",
    text: `Add ${POINTS.waitHour} if they have waited an hour or longer. Add ${POINTS.waitHalfHour} if they have waited at least 30 minutes and less than an hour. Wait never adds more than ${POINTS.waitHour}, so an old idea cannot outrank a broken inbox on age alone.`,
  },
  {
    title: "Group the incident",
    text: `If two or more tickets are multi-person sync or draft failures, group them and add ${POINTS.cluster} to each. A single account with the same symptom stays out of the group.`,
  },
  {
    title: "Bands, then judgment",
    text: `${BANDS.p1} or more is P1. ${BANDS.p2} to ${BANDS.p1 - 1} is P2. ${BANDS.p3} to ${BANDS.p2 - 1} is P3. Under ${BANDS.p3} is P4. Limits can only make a ticket less urgent. Minimums can only make it more urgent. If they ever disagree, the minimum wins.`,
  },
  {
    title: "Limits",
    text: "A feature idea stays P4. A how-to with no deadline stays P4. Billing stays at most P3 while sync and drafts are working.",
  },
  {
    title: "Minimums",
    text: "A connect loop, a trust risk, or a single-account core failure is at least P2. A grouped incident is P1.",
  },
];

export const SAMPLE_TICKETS: readonly Ticket[] = [
  {
    id: "T-1042",
    firstName: "Maya",
    name: "Maya Chen",
    role: "Head of operations",
    company: "Kindling Studio",
    subject: "Gmail stopped syncing for the whole team",
    body: "Since about 8:00am CT none of the 40 seats on our workspace are pulling new Gmail. The draft button returns a blank. We have a board meeting at 2pm and people are copying threads by hand. Reconnecting one account did not change it.",
    channel: "Email",
    plan: "Business",
    waitingMinutes: 22,
    tags: ["multi-user", "core-sync", "core-drafts", "blocked"],
    evidence: {
      multiUser: "none of the 40 seats on our workspace are pulling new Gmail",
      core: "The draft button returns a blank",
      blocked: "board meeting at 2pm",
    },
  },
  {
    id: "T-1048",
    firstName: "Luis",
    name: "Luis Ortega",
    role: "Account executive",
    company: "Kindling Studio",
    subject: "Drafts not generating after the update notice",
    body: "The sync icon looks connected, but Generate draft spins and comes back empty. It started right after the in-app note about an update. Two coworkers on my team see the same thing. I need replies out before a customer call at 11:30.",
    channel: "Email",
    plan: "Business",
    waitingMinutes: 16,
    tags: ["multi-user", "core-drafts", "blocked"],
    evidence: {
      multiUser: "Two coworkers on my team see the same thing",
      core: "Generate draft spins and comes back empty",
      blocked: "before a customer call at 11:30",
    },
  },
  {
    id: "T-1055",
    firstName: "Ruth",
    name: "Ruth Keller",
    role: "Support manager",
    company: "Kindling Studio",
    subject: "Is mail down? Nothing new since 7:40am",
    body: "Three of us in the support pod see the same stall. Gmail on the web is fine. Postroom shows no new mail since 7:40am CT, and drafts are empty. Our customers are waiting on us while we wait on the tool.",
    channel: "Email",
    plan: "Business",
    waitingMinutes: 9,
    tags: ["multi-user", "core-sync", "core-drafts", "blocked"],
    evidence: {
      multiUser: "Three of us in the support pod see the same stall",
      core: "drafts are empty",
      blocked: "Our customers are waiting on us",
    },
  },
  {
    id: "T-1033",
    firstName: "Priya",
    name: "Priya Shah",
    role: "Founder",
    company: "Smallgoods",
    subject: "My Gmail sync is a few hours behind",
    body: "Last sync on my account shows 6:40am. Teammates on the same workspace look current. I disconnected and reconnected Gmail once. It is still behind. This is not an outage for the company, but I am missing a vendor thread.",
    channel: "Chat",
    plan: "Pro",
    waitingMinutes: 74,
    tags: ["single-user", "core-sync"],
    evidence: {
      singleUser: "Teammates on the same workspace look current",
      core: "Last sync on my account shows 6:40am",
    },
  },
  {
    id: "T-1051",
    firstName: "Chris",
    name: "Chris Adeyemi",
    role: "Consultant",
    company: "Adeyemi Independent",
    subject: "Outlook reconnects in a loop",
    body: "The Microsoft window opens, I approve access, it closes, and I land back on the connect screen. Gmail on this same login works. I cannot get through my morning replies until Outlook is connected.",
    channel: "Email",
    plan: "Pro",
    waitingMinutes: 31,
    tags: ["access", "blocked"],
    evidence: {
      access: "I land back on the connect screen",
      blocked: "I cannot get through my morning replies",
    },
  },
  {
    id: "T-0988",
    firstName: "Hannah",
    name: "Hannah Berg",
    role: "Support lead",
    company: "Copperlane",
    subject: "A draft promised a refund we do not offer",
    body: "I asked for a reply to an angry customer. The draft offered a 20% refund. We do not give refunds. I caught it before send. How do I stop the assistant from inventing a policy? I worry the next person on my team will not catch it.",
    channel: "Chat",
    plan: "Business",
    waitingMinutes: 58,
    tags: ["trust"],
    evidence: {
      trust: "The draft offered a 20% refund",
    },
  },
  {
    id: "T-1019",
    firstName: "Jonah",
    name: "Jonah Blake",
    role: "Finance manager",
    company: "Fieldnote",
    subject: "Charged twice for the annual plan",
    body: "Two invoices posted this morning, 4412 and 4418, both for the annual Pro plan on the same workspace. Please reverse one before our month close on Friday. The product itself is working.",
    channel: "Email",
    plan: "Pro",
    waitingMinutes: 46,
    tags: ["billing", "blocked"],
    evidence: {
      billing: "Two invoices posted this morning, 4412 and 4418",
      blocked: "month close on Friday",
    },
  },
  {
    id: "T-1007",
    firstName: "Derek",
    name: "Derek Holm",
    role: "IT admin",
    company: "Westbridge Clinics",
    subject: "SAML steps for 120 seats, go-live Monday",
    body: "We are turning Postroom on for 120 clinical staff next Monday. I need the SAML setup steps and a person to contact if our metadata does not match. This is not an outage. It is a date we cannot miss.",
    channel: "Email",
    plan: "Business",
    waitingMinutes: 95,
    tags: ["admin", "blocked"],
    evidence: {
      admin: "I need the SAML setup steps",
      blocked: "next Monday",
    },
  },
  {
    id: "T-1022",
    firstName: "Samira",
    name: "Samira Ndlovu",
    role: "Recruiter",
    company: "Cinder Search",
    subject: "How do I pause drafts on weekends?",
    body: "I want the assistant quiet on Saturday and Sunday. I looked through Settings and Notifications and I cannot find a pause. Can you point me to the right control?",
    channel: "Email",
    plan: "Free",
    waitingMinutes: 12,
    tags: ["how-to"],
    evidence: {
      howTo: "Can you point me to the right control?",
    },
  },
  {
    id: "T-0994",
    firstName: "Elena",
    name: "Elena Voss",
    role: "Chief of staff",
    company: "Halden",
    subject: "Idea: use calendar context in drafts",
    body: "Drafts are useful, and they miss that I have a meeting in ten minutes. A line of calendar context would make them less generic. I am happy to talk about it. Nothing is broken.",
    channel: "Email",
    plan: "Business",
    waitingMinutes: 2880,
    tags: ["feature"],
    evidence: {
      feature: "Nothing is broken",
    },
  },
];
