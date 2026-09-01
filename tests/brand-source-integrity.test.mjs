import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  canonicalizeSvgSource,
  sourceSha256,
} from "../scripts/brand-source-integrity.mjs";

const lfSource = [
  '<svg viewBox="0 0 64 64">',
  '  <path fill="#c9f25f" d="M8 8h20v48H8z"/>',
  "</svg>",
  "",
].join("\n");

test("canonical SVG bytes and hashes are identical for LF and CRLF checkouts", () => {
  const crlfSource = lfSource.replaceAll("\n", "\r\n");
  const bomCrlfSource = `\uFEFF${crlfSource}`;
  assert.deepEqual(
    canonicalizeSvgSource(crlfSource),
    canonicalizeSvgSource(lfSource),
  );
  assert.deepEqual(
    canonicalizeSvgSource(bomCrlfSource),
    canonicalizeSvgSource(lfSource),
  );
  assert.equal(sourceSha256(crlfSource), sourceSha256(lfSource));
  assert.equal(sourceSha256(bomCrlfSource), sourceSha256(lfSource));
});

test("canonical SVG hashing still detects substantive source changes", () => {
  const changedSource = lfSource.replace("#c9f25f", "#ffffff");
  assert.notEqual(sourceSha256(changedSource), sourceSha256(lfSource));
});

test("public React surfaces do not embed legacy theme colors", () => {
  const appRoot = path.resolve("app");
  const legacyColors = /#(?:f6f3eb|fffdf7|0b1225|455066|c9f25f|63d7e4|38bdf8|080d2a|39d8ff|754cff)\b/i;
  const violations = [];

  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path.relative(appRoot, absolutePath);
      if (entry.isDirectory()) {
        if (relativePath === "admin") continue;
        visit(absolutePath);
      } else if (entry.name.endsWith(".tsx")) {
        if (legacyColors.test(fs.readFileSync(absolutePath, "utf8"))) {
          violations.push(relativePath);
        }
      }
    }
  }

  visit(appRoot);
  assert.deepEqual(violations, []);
});

test("the configured theme cannot be overridden by stale browser state", () => {
  const publicSources = [
    fs.readFileSync(path.resolve("app/layout.tsx"), "utf8"),
    fs.readFileSync(path.resolve("app/components/ProfilePreferencesProvider.tsx"), "utf8"),
  ].join("\n");

  assert.doesNotMatch(publicSources, /getItem\(["']project42\.theme\.v1["']\)/);
  assert.match(publicSources, /removeItem\(["']project42\.theme\.v1["']\)/);
});

test("favicon provenance follows the declaratively selected theme", () => {
  const config = JSON.parse(fs.readFileSync(path.resolve("project42.config.json"), "utf8"));
  assert.equal(
    config.organization.faviconUrl,
    `/themes/${config.theme}/mark.svg`,
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.resolve("public/brand/asset-manifest.json"), "utf8"),
  );
  const themeMark = fs.readFileSync(
    path.resolve("public", config.organization.faviconUrl.slice(1)),
  );
  assert.equal(manifest.sources.selectedTheme, config.theme);
  assert.equal(manifest.sources.faviconUrl, config.organization.faviconUrl);
  assert.equal(manifest.sources.faviconSha256, sourceSha256(themeMark));
});

test("Galactic removes default landing ornaments and uses its bundled hero", () => {
  const styles = fs.readFileSync(path.resolve("app/globals.css"), "utf8");
  assert.match(
    styles,
    /html\[data-theme="06-galactic-guide"\] \.path-card::after\s*\{\s*content:\s*none;/,
  );
  assert.match(
    styles,
    /html\[data-theme="06-galactic-guide"\] \.hero-map\s*\{[^}]*url\("\/themes\/06-galactic-guide\/hero\.png"\)/s,
  );
  assert.match(
    styles,
    /html\[data-theme="06-galactic-guide"\] \.footer-grid a\s*\{[^}]*min-height:\s*0;[^}]*padding-block:\s*0\.2rem;/s,
  );
});

test("the Galactic compatibility aliases use only its authoritative accents", () => {
  const styles = fs.readFileSync(path.resolve("app/globals.css"), "utf8");
  const galacticBlock = styles.slice(0, styles.indexOf('html[data-theme="00-classic"]'));

  assert.match(galacticBlock, /--cyan:\s*#10b981;/);
  assert.match(galacticBlock, /--violet:\s*#f59e0b;/);
  assert.doesNotMatch(galacticBlock, /#(?:38bdf8|63d7e4|39d8ff|754cff)\b/i);
});
