import type { Metadata } from "next";
import { CaseStudies } from "@/components/CaseStudies";
import { DebugSection } from "@/components/DebugSection";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { InboxSection } from "@/components/InboxSection";
import { OpenWork } from "@/components/OpenWork";
import { Playbook } from "@/components/Playbook";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main id="content" tabIndex={-1}>
      <Hero />
      <Experience />
      <CaseStudies />
      <InboxSection />
      <DebugSection />
      <Playbook />
      <OpenWork />
    </main>
  );
}
