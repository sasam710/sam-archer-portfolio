const TOOLS = ["Zendesk", "Intercom", "Plain", "Jira", "Slack"] as const;

export function Experience() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <h2 id="work-title">Work</h2>
        <p className="lede">
          I am at Fyxer now. The Klaviyo notes are the results I will put a number on.
        </p>
        <ol className="roles">
          <li>
            <p className="when">October 2026 to present</p>
            <h3>Product Support Specialist</h3>
            <p className="where">Fyxer, AI email assistant</p>
            <p>I am on the product support team. I am based in Austin and I work Central time.</p>
          </li>
          <li>
            <p className="when">July 2022 to October 2026</p>
            <h3>Senior Product Expert and support pod lead</h3>
            <p className="where">Klaviyo</p>
            <ul className="role-points">
              <li>Led a support pod.</li>
              <li>Coached new specialists in the Dublin pod.</li>
              <li>
                Helped bring the queue down from hour-long waits to around 10 tickets a day. CSAT
                stayed above 90%, about 97% excluding cases closed after the customer stopped
                responding.
              </li>
              <li>Built a last-reply timer plugin for the support team.</li>
            </ul>
          </li>
        </ol>
        <h3 className="tools-heading">Tools I use</h3>
        <ul className="tools" aria-label="Tools">
          {TOOLS.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
