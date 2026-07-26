import type { Metadata } from "next";
import { LegacyProgressBridge } from "../components/LegacyProgressBridge";

export const metadata: Metadata = {
  title: "Transfer learning progress",
  description:
    "A limited bridge for moving browser-only Project 42 progress to Learn.",
  robots: { index: false, follow: false },
};

export default function TransferProgressPage() {
  return (
    <main className="page-shell shell">
      <header className="page-hero">
        <p className="eyebrow">Project 42 site migration</p>
        <h1>Transfer your browser-only learning progress.</h1>
        <p>
          This page responds only to the official Project 42 Learn site and reads
          only the existing Project 42 progress key. It never sends data to a server.
        </p>
      </header>
      <section className="profile-card">
        <LegacyProgressBridge />
        <p>
          Start the transfer from{" "}
          <a href="https://learn.project-42.dev/import-progress">
            Learn’s import page
          </a>
          .
        </p>
      </section>
    </main>
  );
}
