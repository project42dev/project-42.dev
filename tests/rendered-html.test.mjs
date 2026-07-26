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
  assert.match(html, /https:\/\/learn\.project-42\.dev/);
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
