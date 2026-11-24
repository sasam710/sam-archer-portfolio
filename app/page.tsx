import type { Metadata } from "next";
import { CaseStudies } from "@/components/CaseStudies";
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
      <Playbook />
      <OpenWork />
    </main>
  );
}
