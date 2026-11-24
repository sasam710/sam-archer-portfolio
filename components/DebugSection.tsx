import { DebugDemo } from "@/components/DebugDemo";

export function DebugSection() {
  return (
    <section className="section" id="debug" aria-labelledby="debug-title">
      <div className="wrap">
        <p className="eyebrow">Live demo</p>
        <h2 id="debug-title">Debug a broken integration.</h2>
        <p className="lede">
          Sample data for a fictional customer. Nothing here is a live account, and nothing is
          sent. The habit is one I used on Klaviyo integrations work, including a CDP rollout: read
          the log, decide whether it is the customer setup or the platform, then either reply or
          hand engineering a package they can reproduce. Your browser does the whole exercise. It
          does not call a server.
        </p>
        <DebugDemo />
      </div>
    </section>
  );
}
