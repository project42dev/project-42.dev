import assert from "node:assert/strict";
import test from "node:test";
import releaseFacts from "../public/release-facts.json" with { type: "json" };

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`https://project-42.dev${pathname}`, {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Project 42 public gateway", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = (await response.text()).replaceAll("<!-- -->", "");

  assert.match(html, /Start curious/);
  assert.match(html, /Learn deeply. Find answers quickly/);
  assert.match(html, /https:\/\/learn\.project-42\.dev/);
  assert.match(html, /https:\/\/guide\.project-42\.dev/);
  assert.match(html, /Move existing progress/);
  assert.ok(html.includes(`Site v${releaseFacts.siteVersion}`));
  assert.ok(html.includes(`Platform v${releaseFacts.platformVersion}`));
});

test("renders the About page as part of the landing site", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /A free place to become fluent in AI/);
  assert.match(html, /Deploy Project 42 for your own people/);
  assert.match(html, /AI learning, created and maintained with AI/);
  assert.match(html, /accountable human approval/);
  assert.match(html, /https:\/\/learn\.project-42\.dev/);
});

test("renders the review-gated Legal & Transparency page from every footer", async () => {
  for (const route of ["/", "/about", "/legal-transparency"]) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), /href="\/legal-transparency"/, route);
  }

  const response = await render("/legal-transparency");
  const html = (await response.text()).replaceAll("<!-- -->", "");
  assert.match(html, /Open on purpose. Honest about the limits/);
  assert.match(html, /not yet effective legal terms/i);
  assert.match(html, /Project 42 was created by Kristopher Turner/);
  assert.match(html, /operated by Hybrid Cloud Solutions LLC/);
  assert.match(html, /AI cannot approve or publish Project 42 content by itself/);
  assert.match(html, /Apache License 2.0/);
  assert.match(html, /Creative Commons Attribution 4.0 International/);
  assert.match(html, /© 2026 Hybrid Cloud Solutions LLC/);
  assert.match(html, /purely AI-generated/);
  assert.match(html, /provided.*as is.*as available/is);
  assert.match(html, /https:\/\/learn\.project-42\.dev\/learner-data/);
  assert.match(html, /0.1-review-draft/);
  assert.match(html, /aria-labelledby="legal-contents-title"/);
  assert.match(html, /href="#legal-review-title"/);
  assert.match(html, /href="#people-title"/);
  assert.match(html, /href="#history-title"/);
});

test("renders the narrowly scoped legacy progress bridge", async () => {
  const response = await render("/transfer-progress");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Transfer your browser-only learning progress/);
  assert.match(html, /never sends data to a server/i);
  assert.match(html, /https:\/\/learn\.project-42\.dev\/import-progress/);
  assert.match(html, /noindex/);
});

test("does not serve Learn or Field Guide application routes", async () => {
  for (const route of ["/learn", "/resources", "/diagrams", "/profile", "/learner-data"]) {
    const response = await render(route);
    assert.equal(response.status, 404, route);
  }
});

test("publishes canonical landing metadata and brand assets", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /https:\/\/project-42\.dev/);
  assert.match(html, /href="\/brand\/project-42-mark\.svg"/);
  assert.match(html, /href="\/favicon\.ico"/);
});
