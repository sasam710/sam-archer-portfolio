"use client";

import { useRef, useState } from "react";
import {
  DEBUG_SCENARIOS,
  DECISION_LABEL,
  HYPOTHESIS_LABEL,
  patternRows,
  type Decision,
  type DebugScenario,
  type Hypothesis,
} from "@/lib/debug-model";

type Step = "pattern" | "hypothesis" | "decision";

const STEPS: readonly { id: Step; label: string }[] = [
  { id: "pattern", label: "1. Spot the pattern" },
  { id: "hypothesis", label: "2. Form a hypothesis" },
  { id: "decision", label: "3. Decide" },
];

function LogTable({ scenario, showPattern }: { scenario: DebugScenario; showPattern: boolean }) {
  return (
    <div className="log-scroll" tabIndex={0} aria-label="Sample request log">
      <table className="log-table">
        <caption>Sample request log. {patternRows(scenario).length} rows are the pattern.</caption>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Status</th>
            <th scope="col">Method</th>
            <th scope="col">Endpoint</th>
            <th scope="col">Request ID</th>
            <th scope="col">Latency</th>
            <th scope="col">Message</th>
          </tr>
        </thead>
        <tbody>
          {scenario.logs.map((row) => {
            const marked = showPattern && row.pattern;
            return (
              <tr key={row.id} className={marked ? "log-pattern" : undefined}>
                <td>
                  {marked ? <span className="pattern-tag">Pattern</span> : null}
                  {row.time}
                </td>
                <td>
                  <span className="status-pill" data-status={row.status}>
                    {row.status}
                  </span>
                </td>
                <td>{row.method}</td>
                <td>
                  <code>{row.endpoint}</code>
                </td>
                <td>{row.requestId}</td>
                <td>{row.latencyMs} ms</td>
                <td>{row.message}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Choice({
  name,
  value,
  checked,
  label,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export function DebugDemo() {
  const [scenarioId, setScenarioId] = useState(DEBUG_SCENARIOS[0].id);
  const [step, setStep] = useState<Step>("pattern");
  const [showPattern, setShowPattern] = useState(false);
  const [hypothesis, setHypothesis] = useState<Hypothesis | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);

  const scenario = DEBUG_SCENARIOS.find((item) => item.id === scenarioId) ?? DEBUG_SCENARIOS[0];

  function selectScenario(id: string) {
    setScenarioId(id);
    setStep("pattern");
    setShowPattern(false);
    setHypothesis(null);
    setDecision(null);
  }

  function go(next: Step) {
    setStep(next);
    requestAnimationFrame(() => stepHeading.current?.focus());
  }

  const hypothesisRight = hypothesis === scenario.hypothesis;
  const decisionRight = decision === scenario.decision;

  return (
    <div className="demo-frame">
      <p className="demo-banner">Demo. Sample logs for a fictional customer. Not a live account.</p>
      <div className="chips" role="group" aria-label="Choose a sample scenario">
        {DEBUG_SCENARIOS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={item.id === scenario.id}
            onClick={() => selectScenario(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="debug-body">
        <p className="eyebrow">
          {scenario.company} · sample ticket
        </p>
        <h3>{scenario.subject}</h3>
        <p className="muted">
          {scenario.from}, {scenario.company}
        </p>
        <p className="ticket-body">{scenario.body}</p>
        <div className="chips" role="group" aria-label="Debug steps">
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip chip-on-light"
              aria-current={step === item.id ? "step" : undefined}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <h4 id="debug-step-title" ref={stepHeading} tabIndex={-1}>
          {STEPS.find((item) => item.id === step)?.label}
        </h4>
        {step === "pattern" ? (
          <div>
            <p>
              Read the log before you name a cause. The useful rows share a time, an endpoint, and
              a message. The other rows are there so a single odd status does not decide it.
            </p>
            <button
              type="button"
              className="button button-primary"
              aria-pressed={showPattern}
              onClick={() => setShowPattern((current) => !current)}
            >
              {showPattern ? "Hide the pattern" : "Highlight the pattern"}
            </button>
            <p className="copy-status" aria-live="polite">
              {showPattern ? scenario.patternSummary : "Pattern rows are unmarked."}
            </p>
            <LogTable scenario={scenario} showPattern={showPattern} />
          </div>
        ) : null}
        {step === "hypothesis" ? (
          <div>
            <fieldset className="choice-set">
              <legend>Where does the evidence point?</legend>
              <Choice
                name={`hypothesis-${scenario.id}`}
                value="customer"
                checked={hypothesis === "customer"}
                label={HYPOTHESIS_LABEL.customer}
                onChange={() => setHypothesis("customer")}
              />
              <Choice
                name={`hypothesis-${scenario.id}`}
                value="platform"
                checked={hypothesis === "platform"}
                label={HYPOTHESIS_LABEL.platform}
                onChange={() => setHypothesis("platform")}
              />
            </fieldset>
            {hypothesis ? (
              <p className="verdict" data-right={hypothesisRight ? "true" : "false"} aria-live="polite">
                <strong>{hypothesisRight ? "That matches the log." : "Look again."}</strong>{" "}
                {hypothesisRight ? scenario.hypothesisWhy : scenario.hypothesisWrong}
              </p>
            ) : (
              <p className="muted">Customer configuration means their key, receiver, or limit. Platform side means our release or our delivery path.</p>
            )}
          </div>
        ) : null}
        {step === "decision" ? (
          <div>
            <fieldset className="choice-set">
              <legend>What do you do with it?</legend>
              <Choice
                name={`decision-${scenario.id}`}
                value="resolve"
                checked={decision === "resolve"}
                label={DECISION_LABEL.resolve}
                onChange={() => setDecision("resolve")}
              />
              <Choice
                name={`decision-${scenario.id}`}
                value="escalate"
                checked={decision === "escalate"}
                label={DECISION_LABEL.escalate}
                onChange={() => setDecision("escalate")}
              />
            </fieldset>
            {decision ? (
              <div>
                <p className="verdict" data-right={decisionRight ? "true" : "false"} aria-live="polite">
                  <strong>{decisionRight ? "That is the call." : "That is the weaker call."}</strong>{" "}
                  {decisionRight ? scenario.decisionWhy : scenario.decisionWrong}
                </p>
                {scenario.decision === "resolve" ? (
                  <div className="macro">
                    <h4>Reply to the customer</h4>
                    <p className="muted">Sample reply. Nothing is sent.</p>
                    <div className="macro-body">{scenario.reply}</div>
                  </div>
                ) : (
                  <div className="macro">
                    <h4>Repro package for engineering</h4>
                    <p className="muted">
                      One note, not a paste of the whole log. The customer reply is below it so the
                      thread is not left quiet.
                    </p>
                    <dl className="repro">
                      {scenario.repro.map((line) => (
                        <div key={line.label}>
                          <dt>{line.label}</dt>
                          <dd>{line.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <h4>Reply to the customer</h4>
                    <div className="macro-body">{scenario.reply}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="muted">
                Resolve when the customer can change a key, a receiver, or a rate. Escalate when the
                log says the platform started failing.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
