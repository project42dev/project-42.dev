"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteFacts } from "../lib/siteFacts";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return (
      <footer className="site-footer">
        <div className="shell footer-bottom">
          <span>Project 42 Admin Portal · fixed operational theme</span>
          <span>
            <a href="https://project-42.dev/support">Support</a>
            {" · "}
            <a href="https://project-42.dev/legal-transparency">
              Legal &amp; Transparency
            </a>
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "36px 0 24px", background: "rgba(8, 12, 20, 0.6)" }}>
      <div className="shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "28px", marginBottom: "28px" }}>
        <div style={{ maxWidth: "380px" }}>
          <div className="brand footer-brand" style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
            <BrandMark />
            <span style={{ fontWeight: 800, fontSize: "16px" }}>Project 42</span>
          </div>
          <p style={{ fontSize: "13.5px", color: "#cbd5e1", lineHeight: 1.55 }}>
            Free, open AI learning for curious minds and capable teams — built with AI, for humans mastering AI.
          </p>
        </div>

        <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", fontSize: "13px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <strong style={{ color: "#ffffff", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Explore</strong>
            <Link href="/learn/paths" style={{ color: "#94a3b8", textDecoration: "none" }}>Learning paths</Link>
            <Link href="/guide" style={{ color: "#94a3b8", textDecoration: "none" }}>Field Guide</Link>
            <Link href="/guide/diagrams" style={{ color: "#94a3b8", textDecoration: "none" }}>Visual guides</Link>
            <a href="https://gallery.project-42.dev" style={{ color: "#94a3b8", textDecoration: "none" }}>Theme Gallery</a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <strong style={{ color: "#ffffff", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Project &amp; Docs</strong>
            <Link href="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>About</Link>
            <Link href="/platform" style={{ color: "#94a3b8", textDecoration: "none" }}>Open-source platform &amp; docs</Link>
            <Link href="/releases" style={{ color: "#94a3b8", textDecoration: "none" }}>Release notes</Link>
            <Link href="/roadmap" style={{ color: "#94a3b8", textDecoration: "none" }}>Roadmap</Link>
            <Link href="/legal-transparency" style={{ color: "#94a3b8", textDecoration: "none" }}>Legal &amp; Transparency</Link>
          </div>
        </div>
      </div>

      <div className="shell" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b", flexWrap: "wrap", gap: "12px" }}>
        <span>
          Site v{siteFacts.siteVersion} · Platform v{siteFacts.platformVersion} · Content v{siteFacts.contentVersion}
        </span>
        <span>
          <Link href="/legal-transparency" style={{ color: "inherit", textDecoration: "none" }}>Legal &amp; Transparency</Link>
          {" · "}
          <a href={siteFacts.licenses.software.url} style={{ color: "inherit", textDecoration: "none" }}>Code {siteFacts.licenses.software.spdx}</a>
          {" · "}
          <a href={siteFacts.licenses.curriculum.url} style={{ color: "inherit", textDecoration: "none" }}>Curriculum {siteFacts.licenses.curriculum.spdx}</a>
        </span>
      </div>
    </footer>
  );
}
