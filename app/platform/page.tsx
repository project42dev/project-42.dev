import Link from "next/link";
import { siteFacts } from "../lib/siteFacts";

const platformPillars = [
  {
    index: "01",
    title: "Turnkey Self-Hosting",
    description:
      "Run the entire Project 42 stack in a single container or Kubernetes cluster with Keycloak OIDC, Postgres/D1 persistence, and rate-limiting.",
  },
  {
    index: "02",
    title: "Theme & Layout Engine",
    description:
      "Use declarative organization branding and layout configuration with automated JSON validation.",
  },
  {
    index: "03",
    title: "Cryptographic Transcripts",
    description:
      "Keep learner progress, assessment evidence, and milestone badges in durable, tamper-evident records.",
  },
] as const;

const documentationLinks = [
  {
    href: "https://github.com/project42dev/project42-gallery/blob/main/docs/THEME_AUTHORING_GUIDE.md",
    title: "Theme Authoring Guide ↗",
    description:
      "Rules, guidelines, and token definitions for creating custom organization themes.",
    external: true,
  },
  {
    href: "https://github.com/project42dev/project42-gallery/blob/main/docs/THEME_SCHEMA.md",
    title: "Theme JSON Schema ↗",
    description: "Strict schema specification for validating theme manifest files.",
    external: true,
  },
  {
    href: "/legal-transparency",
    title: "Legal & Transparency",
    description:
      "Open licenses, data privacy commitments, and provider-neutral governance policies.",
    external: false,
  },
  {
    href: "/roadmap",
    title: "Public Roadmap",
    description: "Now, Next, and Later milestones across the platform and curriculum.",
    external: false,
  },
] as const;

export default function OpenSourcePlatformPage() {
  return (
    <main className="page-shell shell platform-page">
      <header className="platform-hero">
        <p className="platform-kicker">
          Open Source Platform · Apache-2.0 &amp; CC-BY-4.0
        </p>
        <h1>The Open-Source Platform &amp; Documentation</h1>
        <p className="platform-lede">
          Project 42 is provider-neutral AI learning infrastructure designed for
          self-hosting, enterprise deployment, and verifiable learner credentials.
          Built with AI, for humans learning AI.
        </p>
        <div className="button-row platform-actions">
          <a
            className="button button-primary"
            href={siteFacts.repositories.platform}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub Repository ↗
          </a>
          <a
            className="button button-secondary"
            href="https://gallery.project-42.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            Theme Gallery &amp; Studio ↗
          </a>
        </div>
      </header>

      <section className="platform-pillar-grid" aria-label="Platform capabilities">
        {platformPillars.map((pillar) => (
          <article className="platform-card" key={pillar.title}>
            <span className="platform-card-index">{pillar.index}</span>
            <h2>{pillar.title}</h2>
            <p>{pillar.description}</p>
          </article>
        ))}
      </section>

      <section className="platform-quickstart" aria-labelledby="quickstart-title">
        <h2 id="quickstart-title">Quickstart Guide</h2>
        <p>
          Run Project 42 locally or deploy it to private infrastructure using the
          official platform package <code>@project42/platform</code>:
        </p>
        <pre aria-label="Self-hosting quickstart commands" tabIndex={0}>
          <code>{`# 1. Clone the Open-Source Platform
git clone https://github.com/project42dev/project42-platform.git
cd project42-platform

# 2. Install dependencies & build
npm install
npm run build

# 3. Launch Self-Host Server
npm run self-host`}</code>
        </pre>
      </section>

      <section className="platform-documentation" aria-labelledby="documentation-title">
        <h2 id="documentation-title">Public Documentation &amp; Specifications</h2>
        <div className="platform-documentation-grid">
          {documentationLinks.map((item) =>
            item.external ? (
              <a
                className="platform-documentation-card"
                href={item.href}
                key={item.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </a>
            ) : (
              <Link
                className="platform-documentation-card"
                href={item.href}
                key={item.href}
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </Link>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
