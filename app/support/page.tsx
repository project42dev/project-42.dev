import type { Metadata } from "next";
import Link from "next/link";
import { siteFacts } from "../lib/siteFacts";

export const metadata: Metadata = {
  title: "Support & Content Requests — Project 42",
  description:
    "Get assistance with Project 42, request curriculum, report issues, and explore community support resources.",
};

const supportOptions = [
  {
    index: "01",
    title: "Request new content",
    description:
      "Propose an AI topic, orchestration pattern, or interactive exercise for the learning paths and field guide.",
    href: "https://github.com/project42dev/project42-platform/issues/new?title=Content+Request%3A+&labels=content%2Cenhancement",
    label: "Submit content request",
    external: true,
  },
  {
    index: "02",
    title: "Self-hosting and docs",
    description:
      "Review deployment, identity, learner-data, configuration, and theming guidance for the reusable platform.",
    href: "/platform",
    label: "View platform docs",
    external: false,
  },
  {
    index: "03",
    title: "Report a defect",
    description:
      "Tell us about a broken link, visual flaw, accessibility problem, or runtime error with clear reproduction steps.",
    href: "https://github.com/project42dev/project-42.dev/issues/new",
    label: "Open bug report",
    external: true,
  },
] as const;

export default function SupportPage() {
  return (
    <main className="page-shell shell support-page">
      <header className="page-hero">
        <p className="eyebrow">Help, community, and contributions</p>
        <h1>Support &amp; content requests</h1>
        <p>
          Project 42 is a community-driven, open-source AI learning platform. Get
          technical help, propose curriculum, or report a defect through the route
          that reaches the right maintainers.
        </p>
      </header>

      <div className="support-grid">
        {supportOptions.map((option) => (
          <article className="support-card" key={option.index}>
            <span className="support-index" aria-hidden="true">{option.index}</span>
            <div>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
            </div>
            {option.external ? (
              <a className="button button-secondary" href={option.href} rel="noopener noreferrer" target="_blank">
                {option.label} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link className="button button-secondary" href={option.href}>{option.label}</Link>
            )}
          </article>
        ))}
      </div>

      <section className="support-policy" aria-labelledby="support-policy-title">
        <div>
          <p className="eyebrow">Community support policy</p>
          <h2 id="support-policy-title">Open source, without a commercial SLA.</h2>
          <p>
            Project 42 is provided under {siteFacts.licenses.software.spdx} and{" "}
            {siteFacts.licenses.curriculum.spdx} licenses. Issues, enhancements, and
            roadmap priorities are tracked publicly; community support does not
            include guaranteed uptime or response times.
          </p>
        </div>
        <nav aria-label="Support policies">
          <Link className="text-link" href="/legal-transparency">Legal &amp; transparency</Link>
          <Link className="text-link" href="/roadmap">Public roadmap</Link>
          <Link className="text-link" href="/releases">Release notes</Link>
        </nav>
      </section>
    </main>
  );
}
