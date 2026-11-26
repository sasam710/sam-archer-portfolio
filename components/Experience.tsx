const TOOLS = ["Zendesk", "Plain", "Jira", "Linear", "Slack", "Claude", "Sidekick", "Parahelp", "Loom"] as const;

export function Experience() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <h2 id="work-title">Work</h2>
        <p className="lede">
          Currently at Fyxer. The results below are from my four years at Klaviyo, where I can show the numbers.
        </p>
        <ol className="roles">
          <li>
            <p className="when">October 2026 to present</p>
            <h3>Lead Product Support Specialist</h3>
            <p className="where">Fyxer, AI email assistant</p>
            <ul className="role-points">
              <li>Own cases end to end in Plain.</li>
              <li>
                Look up and track bugs in GitHub and Linear with Engineering, and stay with cases
                until the fix lands.
              </li>
              <li>Based in Austin, working Central time.</li>
            </ul>
          </li>
          <li>
            <p className="when">February 2024 to October 2026</p>
            <h3>Senior Product Expert</h3>
            <p className="where">Klaviyo, support pod lead</p>
            <ul className="role-points">
              <li>Led a support pod.</li>
              <li>Coached new specialists in the Dublin pod.</li>
              <li>
                Helped bring the queue down from hour-long waits to around 10 tickets a day. CSAT
                stayed above 90%, about 97% excluding cases closed after the customer stopped
                responding.
              </li>
              <li>Built a last-reply timer Chrome extension for the support team.</li>
              <li>Supported the live rollout of Klaviyo&apos;s Customer Data Platform.</li>
            </ul>
          </li>
          <li>
            <p className="when">July 2022 to February 2024</p>
            <h3>Product Expert</h3>
            <p className="where">Klaviyo</p>
            <ul className="role-points">
              <li>Selected for the Development Pod within 8 months, for the hardest technical cases.</li>
              <li>
                Reproduced API issues in Postman and compared the request and response with the
                calls the app was making, to find whether the fault was customer setup (auth,
                payload, rate limits) or the platform side.
              </li>
              <li>
                Worked integration error codes across Shopify, WooCommerce, Magento, and Facebook.
              </li>
              <li>Diagnosed onsite HTML, CSS, and JavaScript issues affecting customers.</li>
            </ul>
          </li>
          <li>
            <p className="when">April 2018 to July 2022</p>
            <h3>Management Accountant and Systems Lead</h3>
            <p className="where">Pho Trading Ltd, London</p>
            <ul className="role-points">
              <li>Led payroll, EPOS, and procurement system rollouts across 45 sites.</li>
              <li>Owned SOPs and manager training.</li>
              <li>Managed two people.</li>
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
