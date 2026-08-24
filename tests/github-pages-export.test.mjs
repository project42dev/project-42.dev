import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { starterCatalog } from "@project42/platform";
import diagramConfig from "../node_modules/@project42/platform/content/diagrams/catalogue.json" with { type: "json" };
import { buildRouteInventory } from "../scripts/link-integrity.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(projectRoot, "dist", "pages");

test("exports only canonical landing routes as governed pages", async () => {
  const inventory = buildRouteInventory();
  const manifest = JSON.parse(
    await readFile(path.join(outputRoot, "pages-manifest.json"), "utf8"),
  );

  assert.equal(manifest.canonicalDomain, "project-42.dev");
  assert.deepEqual(manifest.htmlRoutes, inventory.htmlRoutes);
  assert.deepEqual(inventory.htmlRoutes, [
    "/",
    "/about",
    "/admin",
    "/admin/logs",
    "/admin/settings",
    "/legal-transparency",
    "/platform",
    "/releases",
    "/roadmap",
    "/support",
    "/transfer-progress",
  ]);
  for (const route of inventory.htmlRoutes) {
    const relative = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    await access(path.join(outputRoot, relative));
  }
});

test("exports complete Learn and Field Guide legacy redirects", async () => {
  const manifest = JSON.parse(
    await readFile(path.join(outputRoot, "pages-manifest.json"), "utf8"),
  );
  const expectedRedirectCount =
    6 +
    starterCatalog.paths.length +
    starterCatalog.modules.length +
    starterCatalog.resources.length +
    diagramConfig.diagrams.length;
  assert.equal(Object.keys(manifest.legacyRedirects).length, expectedRedirectCount);
  assert.equal(manifest.legacyRedirects["/learn"], "https://learn.project-42.dev/");
  assert.equal(
    manifest.legacyRedirects["/resources"],
    "https://guide.project-42.dev/",
  );
  assert.equal(
    manifest.legacyRedirects["/profile"],
    "https://learn.project-42.dev/profile",
  );

  const [legacyLearning, legacyResource] = await Promise.all([
    readFile(path.join(outputRoot, "learn", "ai-foundations", "index.html"), "utf8"),
    readFile(
      path.join(outputRoot, "resources", "prompt-checklist", "index.html"),
      "utf8",
    ),
  ]);
  assert.match(legacyLearning, /learn\.project-42\.dev\/learn\/ai-foundations/);
  assert.match(legacyResource, /guide\.project-42\.dev\/resources\/prompt-checklist/);
  assert.match(legacyLearning, /window\.location\.replace/);
});

test("publishes current ecosystem facts and Pages controls", async () => {
  const [releaseFacts, application, installedPlatform] = await Promise.all([
    readFile(path.join(outputRoot, "release-facts.json"), "utf8").then(JSON.parse),
    readFile(path.join(projectRoot, "package.json"), "utf8").then(JSON.parse),
    readFile(
      path.join(projectRoot, "node_modules", "@project42", "platform", "package.json"),
      "utf8",
    ).then(JSON.parse),
  ]);
  assert.equal(releaseFacts.siteVersion, application.version);
  assert.equal(releaseFacts.platformVersion, installedPlatform.version);
  assert.equal(
    await readFile(path.join(outputRoot, "CNAME"), "utf8"),
    "project-42.dev\n",
  );
  await access(path.join(outputRoot, ".nojekyll"));
  await access(path.join(outputRoot, "404.html"));
  await assert.rejects(access(path.join(outputRoot, ".openai")));
  await assert.rejects(access(path.join(outputRoot, "server")));
});
