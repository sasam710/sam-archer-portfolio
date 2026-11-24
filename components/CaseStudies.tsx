const CASES = [
  {
    index: "01",
    where: "Klaviyo, support pod",
    title: "From hour-long waits to a queue you can finish",
    problem:
      "Customers were sitting in hour-long waits. At that length, people write back to ask if anyone is there, and the pod spends the next reply explaining the delay.",
    did: "I led the pod and treated the queue as the thing to fix. Aging had to be visible. Tickets that were really one issue had to sit together. A first reply had to move the problem forward. I kept CSAT in view while the wait came down, so speed did not come from rushing people off a thread.",
    result:
      "The queue came down from hour-long waits to around 10 tickets a day. CSAT stayed above 90%, about 97% excluding cases closed after the customer stopped responding.",
  },
  {
    index: "02",
    where: "Klaviyo, support team",
    title: "A clock for threads that go quiet",
    problem:
      "In a fast queue the newest ticket is the loud one. A thread that has gone quiet is easy to lose, and the customer experiences that as being ignored.",
    did: "I built a last-reply timer Chrome extension for the support team. It showed how long it had been since the last reply, so a quiet thread stayed visible next to the new mail. People could still use their judgment. The wait was no longer something they had to hold in their head.",
    result:
      "The support team could see time since the last reply, so a quiet thread stayed on the board while new mail came in.",
  },
  {
    index: "03",
    where: "Klaviyo, Dublin pod",
    title: "Coaching the Dublin pod",
    problem:
      "New specialists in the Dublin pod were learning the product on live tickets. Without a shared standard, a reply either wanders or gets escalated before it needs to be.",
    did: "I coached them on the work itself. Real threads, a shared idea of what a good reply has to settle, and notes on the writing while the ticket was still open. The goal was one standard, practiced in the queue, not a separate training track.",
    result:
      "New specialists in the Dublin pod got that coaching from the pod lead, on live tickets.",
  },
] as const;

export function CaseStudies() {
  return (
    <section className="section" id="case-studies" aria-labelledby="cases-title">
      <div className="wrap">
        <h2 id="cases-title">Case studies</h2>
        <p className="lede">
          Three pieces of work from Klaviyo, with the results they delivered. Where I describe the
          approach, it is the shape of the work, in plain terms.
        </p>
        <div className="case-list">
          {CASES.map((item) => (
            <article className="case" key={item.index}>
              <header className="case-head">
                <p className="case-index">{item.index}</p>
                <div>
                  <p className="eyebrow">{item.where}</p>
                  <h3>{item.title}</h3>
                </div>
              </header>
              <div className="case-grid">
                <section>
                  <h4>Problem</h4>
                  <p>{item.problem}</p>
                </section>
                <section>
                  <h4>What I did</h4>
                  <p>{item.did}</p>
                </section>
                <section className="case-result">
                  <h4>Result</h4>
                  <p>{item.result}</p>
                </section>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
