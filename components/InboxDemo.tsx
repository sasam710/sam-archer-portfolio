"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  PRIORITIES,
  PRIORITY_META,
  RULE_BOOK,
  SAMPLE_TICKETS,
  buildQueue,
  fillMacro,
  formatWait,
  macroById,
  type Cluster,
  type Priority,
  type QueueItem,
} from "@/lib/inbox-model";

const QUEUE = buildQueue(SAMPLE_TICKETS);

type SortMode = "priority" | "wait" | "score";

function sortItems(items: readonly QueueItem[], sort: SortMode): QueueItem[] {
  const copy = items.slice();
  copy.sort((a, b) => {
    if (sort === "wait") {
      return b.ticket.waitingMinutes - a.ticket.waitingMinutes || b.triage.score - a.triage.score;
    }
    if (sort === "score") {
      return b.triage.score - a.triage.score || b.ticket.waitingMinutes - a.ticket.waitingMinutes;
    }
    const rank = PRIORITIES.indexOf(a.triage.priority) - PRIORITIES.indexOf(b.triage.priority);
    if (rank !== 0) return rank;
    return b.triage.score - a.triage.score || b.ticket.waitingMinutes - a.ticket.waitingMinutes;
  });
  return copy;
}

function TicketButton({
  item,
  current,
  onSelect,
}: {
  item: QueueItem;
  current: boolean;
  onSelect: (id: string) => void;
}) {
  const { ticket, triage } = item;
  return (
    <button
      type="button"
      id={`ticket-${ticket.id}`}
      className="ticket-button"
      aria-current={current ? "true" : undefined}
      onClick={() => onSelect(ticket.id)}
    >
      <span className="priority" data-priority={triage.priority}>
        {triage.priority}
        <span className="visually-hidden"> {PRIORITY_META[triage.priority].label}</span>
      </span>
      <span className="ticket-copy">
        <span className="ticket-subject">{ticket.subject}</span>
        <span className="ticket-meta">
          {ticket.id} · {ticket.company} · score {triage.score}
          {triage.clusterId ? " · incident" : ""}
        </span>
      </span>
      <span className="ticket-wait">{formatWait(ticket.waitingMinutes)}</span>
    </button>
  );
}

function TicketDetail({
  item,
  cluster,
  hidden,
  onSelectSibling,
}: {
  item: QueueItem;
  cluster: Cluster | null;
  hidden: boolean;
  onSelectSibling: (id: string) => void;
}) {
  const { ticket, triage } = item;
  const macro = macroById(triage.macroId);
  const filled = fillMacro(macro.body, ticket);
  const [copyState, setCopyState] = useState<{ id: string; status: "copied" | "failed" } | null>(
    null,
  );
  const status = copyState?.id === ticket.id ? copyState.status : "idle";
  const siblings =
    cluster && triage.clusterId
      ? cluster.ticketIds.filter((id) => id !== ticket.id)
      : [];

  useEffect(() => {
    if (copyState?.status !== "copied") return;
    const handle = window.setTimeout(() => setCopyState(null), 2000);
    return () => window.clearTimeout(handle);
  }, [copyState]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(filled);
      setCopyState({ id: ticket.id, status: "copied" });
    } catch {
      setCopyState({ id: ticket.id, status: "failed" });
    }
  }

  return (
    <article className="detail" aria-labelledby="ticket-title">
      <a className="back-to-queue" href="#queue">
        Back to queue
      </a>
      <p className="eyebrow">
        {ticket.id} · {ticket.channel} · {ticket.plan}
      </p>
      <h3 id="ticket-title">{ticket.subject}</h3>
      {hidden ? (
        <p className="hidden-note">
          This ticket is hidden by the current filter. Clear the filter to see it in the queue.
        </p>
      ) : null}
      <dl className="detail-facts">
        <div>
          <dt>From</dt>
          <dd>
            {ticket.name}, {ticket.role}
          </dd>
        </div>
        <div>
          <dt>Company</dt>
          <dd>{ticket.company}</dd>
        </div>
        <div>
          <dt>Waiting</dt>
          <dd>{formatWait(ticket.waitingMinutes)}</dd>
        </div>
      </dl>
      <p className="ticket-body">{ticket.body}</p>
      <div className="triage-card">
        <p className="priority-readout">
          <span className="priority priority-lg" data-priority={triage.priority}>
            {triage.priority} {PRIORITY_META[triage.priority].label}
          </span>
          <span className="score">
            Score {triage.score}. Band {triage.band}.
          </span>
        </p>
        <p>{PRIORITY_META[triage.priority].meaning}</p>
        <h4>Why this priority</h4>
        <ol className="score-list">
          {triage.lines.map((line) => (
            <li key={line.id}>
              <span>+{line.points}</span>
              <span>
                <strong>{line.label}.</strong> {line.detail}
              </span>
            </li>
          ))}
        </ol>
        {triage.notes.length > 0 ? (
          <ul className="notes">
            {triage.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
        {siblings.length > 0 ? (
          <p className="siblings">
            Also in this group:{" "}
            {siblings.map((id) => (
              <button key={id} type="button" className="text-button" onClick={() => onSelectSibling(id)}>
                {id}
              </button>
            ))}
          </p>
        ) : null}
      </div>
      <div className="macro">
        <h4>Suggested reply</h4>
        <p className="macro-title">{macro.title}</p>
        <p>{triage.macroReason}</p>
        <p className="muted">{macro.useWhen}</p>
        <p className="muted">Sample reply for a fictional product. The name is filled in so you can read it.</p>
        <div className="macro-body">{filled}</div>
        <div className="macro-actions">
          <button type="button" className="button button-primary" onClick={onCopy}>
            {status === "copied" ? "Copied" : "Copy reply"}
          </button>
          <p className="copy-status" aria-live="polite">
            {status === "copied"
              ? "Copied."
              : status === "failed"
                ? "Clipboard blocked. Select the reply and copy it."
                : "Copies the filled sample reply."}
          </p>
        </div>
        <details>
          <summary>Show the template with tokens</summary>
          <div className="macro-body">{macro.body}</div>
        </details>
      </div>
    </article>
  );
}

export function InboxDemo() {
  const [selectedId, setSelectedId] = useState("T-1042");
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [incidentOnly, setIncidentOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("priority");

  const counts: Record<Priority, number> = { P1: 0, P2: 0, P3: 0, P4: 0 };
  for (const item of QUEUE.items) counts[item.triage.priority] += 1;

  const filtered = sortItems(QUEUE.items, sort).filter((item) => {
    if (priorityFilter !== "all" && item.triage.priority !== priorityFilter) return false;
    if (incidentOnly && item.triage.clusterId === null) return false;
    const needle = query.trim().toLowerCase();
    if (needle === "") return true;
    const haystack = [
      item.ticket.id,
      item.ticket.subject,
      item.ticket.body,
      item.ticket.company,
      item.ticket.name,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  const selected =
    QUEUE.items.find((item) => item.ticket.id === selectedId) ?? filtered[0] ?? null;
  const hidden = selected
    ? !filtered.some((item) => item.ticket.id === selected.ticket.id)
    : false;
  const narrowed = query.trim() !== "" || priorityFilter !== "all" || incidentOnly;

  function onQueueKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    if (filtered.length === 0) return;
    const currentIndex = filtered.findIndex((item) => item.ticket.id === selectedId);
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const next = filtered[currentIndex + delta];
    if (!next) return;
    event.preventDefault();
    setSelectedId(next.ticket.id);
    document.getElementById(`ticket-${next.ticket.id}`)?.focus();
  }

  function selectSibling(id: string) {
    setQuery("");
    setPriorityFilter("all");
    setIncidentOnly(false);
    setSelectedId(id);
  }

  let lastPriority: Priority | null = null;

  return (
    <div className="demo-frame">
      <p className="demo-banner">
        Demo. Sample data for a fictional product named Postroom. Not Fyxer, and not real
        customers.
      </p>
      <p className="demo-stats">
        {SAMPLE_TICKETS.length} sample tickets. {counts.P1} at P1, {counts.P2} at P2, {counts.P3}{" "}
        at P3, {counts.P4} at P4.
        {QUEUE.cluster ? ` ${QUEUE.cluster.summary}` : ""}
      </p>
      <div className="demo-toolbar">
        <div className="field field-grow">
          <label htmlFor="ticket-search">Search</label>
          <input
            id="ticket-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Subject, company, or id"
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="queue-sort">Sort</label>
          <select
            id="queue-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
          >
            <option value="priority">Priority groups</option>
            <option value="wait">Longest wait</option>
            <option value="score">Highest score</option>
          </select>
        </div>
      </div>
      <div className="chips" role="group" aria-label="Filter the sample queue">
        <button
          type="button"
          className="chip"
          aria-pressed={priorityFilter === "all"}
          onClick={() => setPriorityFilter("all")}
        >
          All
        </button>
        {PRIORITIES.map((priority) => (
          <button
            key={priority}
            type="button"
            className="chip"
            aria-pressed={priorityFilter === priority}
            onClick={() => setPriorityFilter(priority)}
          >
            {priority} {PRIORITY_META[priority].label}
          </button>
        ))}
        <button
          type="button"
          className="chip"
          aria-pressed={incidentOnly}
          onClick={() => setIncidentOnly((value) => !value)}
        >
          Incident only
        </button>
        {narrowed ? (
          <button
            type="button"
            className="chip"
            onClick={() => {
              setQuery("");
              setPriorityFilter("all");
              setIncidentOnly(false);
            }}
          >
            Clear
          </button>
        ) : null}
      </div>
      <p className="sort-note">
        {sort === "priority"
          ? "Grouped by priority. Inside each group, higher score first, then longer wait."
          : sort === "wait"
            ? "Flat list, longest wait first. Priority badges stay on each ticket."
            : "Flat list, highest score first."}{" "}
        Showing {filtered.length} of {SAMPLE_TICKETS.length}.
      </p>
      <div className="demo-body">
        <div className="queue" id="queue" onKeyDown={onQueueKeyDown}>
          {filtered.length === 0 ? (
            <p className="empty">No sample tickets match. Clear the search or the filter.</p>
          ) : (
            filtered.map((item) => {
              const showGroup = sort === "priority" && item.triage.priority !== lastPriority;
              if (showGroup) lastPriority = item.triage.priority;
              return (
                <div key={item.ticket.id}>
                  {showGroup ? (
                    <p className="group-label">
                      {item.triage.priority} {PRIORITY_META[item.triage.priority].label}
                    </p>
                  ) : null}
                  <TicketButton
                    item={item}
                    current={selected?.ticket.id === item.ticket.id}
                    onSelect={setSelectedId}
                  />
                </div>
              );
            })
          )}
        </div>
        {selected ? (
          <TicketDetail
            item={selected}
            cluster={QUEUE.cluster}
            hidden={hidden}
            onSelectSibling={selectSibling}
          />
        ) : (
          <p className="empty">Nothing to preview.</p>
        )}
      </div>
      <details className="rules">
        <summary>How the triage rules work</summary>
        <ol>
          {RULE_BOOK.map((rule) => (
            <li key={rule.title}>
              <strong>{rule.title}.</strong> {rule.text}
            </li>
          ))}
        </ol>
        <p>
          The numbers live in <code>lib/inbox-model.ts</code>. Change a weight and the queue
          re-scores. There is no model call and no network request.
        </p>
      </details>
    </div>
  );
}
