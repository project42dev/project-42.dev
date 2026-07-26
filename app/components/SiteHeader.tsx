import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Project 42 home">
          <BrandMark />
          <span>
            Project <strong>42</strong>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          <a href="https://learn.project-42.dev">Learn</a>
          <a href="https://guide.project-42.dev">Field Guide</a>
          <a href="https://guide.project-42.dev/diagrams">Visual guides</a>
          <a href="https://learn.project-42.dev/profile">My progress</a>
          <Link href="/about">About</Link>
        </nav>
        <a className="header-action" href="https://learn.project-42.dev/learn/ai-foundations">
          Start learning
        </a>
      </div>
    </header>
  );
}
