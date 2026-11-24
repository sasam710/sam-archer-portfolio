const HABITS = [
  {
    title: "Escalations to engineering",
    body: "I write the bug the way I would want to read it. What the customer tried, what should have happened, who is affected, whether there is a workaround, and the earliest time we saw it. I link the tickets that are really one fault, so engineering is not reconstructing the story from five partial threads.",
  },
  {
    title: "Writing help docs",
    body: "I start from the tickets, not from the settings screen. If specialists keep pasting the same paragraph, that paragraph is a draft article. A useful doc says what to do, what it will not fix, and when to contact support. It should be short enough to use while someone is waiting.",
  },
  {
    title: "Handling an outage",
    body: "Detect, scope, communicate, escalate, follow up. Then do it again when the facts change. A fast escalation with the wrong scope wastes the people who can fix it. A perfect internal note with no customer update wastes the people who are waiting.",
  },
] as const;

const STEPS = [
  {
    title: "Detect",
    body: "Several tickets land close together and say the same thing: Gmail sync has stopped, or drafts come back empty. One report is a bug to reproduce. Three reports that share a start time are an incident. I mark the queue that way before I write a long answer to the first person.",
  },
  {
    title: "Scope",
    body: "I separate the questions that change the response. Which inbox: Gmail, Outlook, or both. One account or a whole workspace. Drafts failing on their own, or only because sync is empty. When it started. Whether a reconnect changed anything. A single seat that is a few hours behind stays out of the incident group until we know it is the same fault.",
  },
  {
    title: "Communicate",
    body: "The customer hears what we know, what we do not know, and when the next update will come. I would rather write that Gmail sync has been stalled for some workspaces since 8:00am CT and drafts are blank, and that I will update the thread, than a vague note that we are looking into it. The same facts go into an internal note so the next specialist does not ask the customer to start again.",
  },
  {
    title: "Escalate",
    body: "Engineering gets one note, not a paste of every ticket. Symptom, start time, scope, what was already tried, who is blocked, and the ticket ids. A board meeting and a support desk waiting on their own customers both belong in that note. I stay on the customer thread and translate in both directions.",
  },
  {
    title: "Follow up",
    body: "When there is a fix or a real workaround, I confirm it with the people who wrote in. If the answer will come up again, I turn it into a help doc or a macro. If it was a one-off, I still close the loop. Silence after an incident feels like the outage never ended.",
  },
] as const;

export function Playbook() {
  return (
    <section className="section" id="playbook" aria-labelledby="playbook-title">
      <div className="wrap">
        <h2 id="playbook-title">How I work</h2>
        <p className="lede">
          Escalations, help docs, and outages sit next to the ticket. The inbox demo above runs a
          small version of detect and scope on sample tickets. This is the longer habit.
        </p>
        <div className="habit-grid">
          {HABITS.map((habit) => (
            <article className="habit" key={habit.title}>
              <h3>{habit.title}</h3>
              <p>{habit.body}</p>
            </article>
          ))}
        </div>
        <article className="example">
          <p className="eyebrow">Worked example</p>
          <h3>A Gmail sync and drafts regression</h3>
          <p className="example-note">
            A scenario for this page. It is not a write-up of a specific day at Fyxer or Klaviyo.
          </p>
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.title}>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
