import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { HeaderMenu, MenuChevron } from "./HeaderMenu";
import { ProfileMenu } from "./ProfileMenu";
import { siteFacts } from "../lib/siteFacts";

const LEARN = "https://learn.project-42.dev";
const GUIDE = "https://guide.project-42.dev";
const supportHref = `${siteFacts.repositories.site}/blob/main/SUPPORT.md`;

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
          <a href={LEARN}>Learn</a>
          <a href={GUIDE}>Field Guide</a>
          <a href={`${GUIDE}/diagrams`}>Visual guides</a>
          <HeaderMenu
            label={
              <>
                About
                <MenuChevron />
              </>
            }
          >
            <ul className="header-menu-list">
              <li>
                <Link href="/about">About Project 42</Link>
              </li>
              <li>
                <Link href="/platform">Open-source platform &amp; docs</Link>
              </li>
              <li>
                <a href="https://gallery.project-42.dev" target="_blank" rel="noopener noreferrer">Theme Gallery &amp; Studio</a>
              </li>
              <li>
                <Link href="/releases">Release notes</Link>
              </li>
              <li>
                <Link href="/roadmap">Roadmap</Link>
              </li>
              <li>
                <Link href="/support">Support &amp; Content Requests</Link>
              </li>
              <li>
                <Link href="/legal-transparency">Legal and transparency</Link>
              </li>
            </ul>
          </HeaderMenu>
        </nav>
        <div className="header-actions">
          <a className="header-action" href={LEARN}>
            Start learning
          </a>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
