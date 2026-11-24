import { InboxDemo } from "@/components/InboxDemo";

export function InboxSection() {
  return (
    <section className="section" id="demo" aria-labelledby="demo-title">
      <div className="wrap">
        <p className="eyebrow">Live demo</p>
        <h2 id="demo-title">A queue, triaged in the browser.</h2>
        <p className="lede">
          This inbox is fake on purpose. Ten sample tickets for Postroom, a fictional AI email
          assistant. Nothing here is a Fyxer customer, and nothing is sent anywhere. Your browser
          scores urgency from P1 to P4, groups the suspected incident, and suggests a reply you
          can copy. It does not call a server.
        </p>
        <InboxDemo />
      </div>
    </section>
  );
}
