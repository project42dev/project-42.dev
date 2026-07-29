import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  validateGovernanceDocuments,
  validateGovernanceFiles,
} from "../scripts/governance-docs-validation.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

function validFixture() {
  const filler = "Documented behavior and evidence. ".repeat(20);
  return {
    documents: {
      "CONTRIBUTING.md": [
        "# Contributing to the Project 42 gateway",
        "## Before opening a change",
        "## Develop and verify",
        "npm run verify",
        "## Pull requests",
        "## Content and licensing",
        "[Security](SECURITY.md)",
        "[Support](SUPPORT.md)",
        filler,
      ].join("\n"),
      "SECURITY.md": [
        "# Security policy",
        "## Report a vulnerability privately",
        "Use [GitHub private vulnerability reporting](https://github.com/project42dev/project-42.dev/security/advisories/new).",
        "## Supported boundary",
        "[Support](SUPPORT.md)",
        "## Dependency and disclosure handling",
        filler,
      ].join("\n"),
      "SUPPORT.md": [
        "# Support, compatibility, and deprecation",
        "## Supported surface",
        "[Security](SECURITY.md)",
        "## Compatibility boundary",
        "## Deprecation policy",
        filler,
      ].join("\n"),
    },
    readme: [
      "[Contributing](CONTRIBUTING.md)",
      "[Security](SECURITY.md)",
      "[Support](SUPPORT.md)",
    ].join("\n"),
  };
}

test("the checked-in governance package passes", async () => {
  assert.deepEqual(await validateGovernanceFiles(repositoryRoot), []);
});

test("rejects a missing document", () => {
  const fixture = validFixture();
  delete fixture.documents["SECURITY.md"];
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("missing required governance document"),
    ),
  );
});

test("rejects an empty document", () => {
  const fixture = validFixture();
  fixture.documents["SUPPORT.md"] = "short";
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("empty or not substantive"),
    ),
  );
});

test("rejects an unlinked governance document", () => {
  const fixture = validFixture();
  fixture.readme = fixture.readme.replace(
    "[Security](SECURITY.md)",
    "Security guidance exists.",
  );
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("does not link SECURITY.md"),
    ),
  );
});

test("rejects a private tracker URL", () => {
  const fixture = validFixture();
  fixture.documents["CONTRIBUTING.md"] +=
    "\nhttps://dev." + "azure.com/example/private";
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("private Azure DevOps URL"),
    ),
  );
});

test("rejects credential-like material", () => {
  const fixture = validFixture();
  fixture.documents["SECURITY.md"] +=
    "\nclient_secret=abcdefghijklmnop";
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("credential assignment"),
    ),
  );
});

test("rejects a missing canonical private-reporting link", () => {
  const fixture = validFixture();
  fixture.documents["SECURITY.md"] = fixture.documents["SECURITY.md"].replace(
    "[GitHub private vulnerability reporting](https://github.com/project42dev/project-42.dev/security/advisories/new)",
    "private vulnerability reporting",
  );
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("missing required link"),
    ),
  );
});

test("rejects a private operations repository URL", () => {
  const fixture = validFixture();
  fixture.documents["CONTRIBUTING.md"] +=
    "\nhttps://github.com/project42dev/" + "project42dev-ops";
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("private operations repository URL"),
    ),
  );
});

test("rejects a bearer credential", () => {
  const fixture = validFixture();
  fixture.documents["SECURITY.md"] +=
    "\nAuthorization: Bearer synthetic-secret-value";
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("bearer credential"),
    ),
  );
});

test("rejects an Azure resource identifier", () => {
  const fixture = validFixture();
  fixture.documents["SUPPORT.md"] +=
    "\n/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/private/providers/Microsoft.Storage/storageAccounts/example";
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("Azure resource identifier"),
    ),
  );
});

test("rejects a required heading hidden in an HTML comment", () => {
  const fixture = validFixture();
  fixture.documents["SUPPORT.md"] = fixture.documents["SUPPORT.md"].replace(
    "## Deprecation policy",
    "<!-- ## Deprecation policy -->",
  );
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes('missing required heading "## Deprecation policy"'),
    ),
  );
});

test("rejects a canonical link hidden in a fenced code block", () => {
  const fixture = validFixture();
  fixture.documents["SECURITY.md"] = fixture.documents["SECURITY.md"].replace(
    "[GitHub private vulnerability reporting](https://github.com/project42dev/project-42.dev/security/advisories/new)",
    "```\n[GitHub private vulnerability reporting](https://github.com/project42dev/project-42.dev/security/advisories/new)\n```",
  );
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes("missing required link"),
    ),
  );
});

test("rejects structurally incomplete guidance even when heading text remains", () => {
  const fixture = validFixture();
  fixture.documents["SUPPORT.md"] = fixture.documents["SUPPORT.md"].replace(
    "## Deprecation policy",
    "Deprecation policy",
  );
  assert.ok(
    validateGovernanceDocuments(fixture).some((error) =>
      error.includes('missing required heading "## Deprecation policy"'),
    ),
  );
});
