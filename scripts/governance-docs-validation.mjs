import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const requiredDocuments = {
  "CONTRIBUTING.md": {
    headings: [
      "# Contributing to the Project 42 gateway",
      "## Before opening a change",
      "## Develop and verify",
      "## Pull requests",
      "## Content and licensing",
    ],
    phrases: [
    "npm run verify",
    "SECURITY.md",
    "SUPPORT.md",
    ],
    links: {
      "SECURITY.md": "SECURITY.md",
      "SUPPORT.md": "SUPPORT.md",
    },
  },
  "SECURITY.md": {
    headings: [
      "# Security policy",
      "## Report a vulnerability privately",
      "## Supported boundary",
      "## Dependency and disclosure handling",
    ],
    phrases: ["private vulnerability reporting", "SUPPORT.md"],
    links: {
      "GitHub private vulnerability reporting":
        "https://github.com/project42dev/project-42.dev/security/advisories/new",
      "SUPPORT.md": "SUPPORT.md",
    },
  },
  "SUPPORT.md": {
    headings: [
      "# Support, compatibility, and deprecation",
      "## Supported surface",
      "## Compatibility boundary",
      "## Deprecation policy",
    ],
    phrases: ["SECURITY.md"],
    links: {
      "SECURITY.md": "SECURITY.md",
    },
  },
};

const unsafePatterns = [
  {
    name: "private Azure DevOps URL",
    pattern: /https:\/\/dev\.azure\.com\//i,
  },
  {
    name: "credential assignment",
    pattern:
      /\b(?:client[_-]?secret|password|account[_-]?key|access[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9+/=_-]{12,}/i,
  },
  {
    name: "signed query credential",
    pattern: /[?&](?:sig|token|code)=[A-Za-z0-9%+/=_-]{12,}/i,
  },
  {
    name: "email address",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  {
    name: "private operations repository URL",
    pattern:
      /https:\/\/github\.com\/project42dev\/project42dev-ops(?:[/?#]|$)/i,
  },
  {
    name: "bearer credential",
    pattern: /\bbearer\s+[A-Za-z0-9._~+/-]{12,}/i,
  },
  {
    name: "Azure resource identifier",
    pattern:
      /\/subscriptions\/[0-9a-f-]{36}\/resourcegroups\/[^/\s]+\/providers\//i,
  },
];

function structuralMarkdown(value) {
  const withoutComments = value.replace(/<!--[\s\S]*?-->/g, "");
  const lines = withoutComments.replace(/\r\n/g, "\n").split("\n");
  const visible = [];
  let fence = null;

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      if (!fence) {
        fence = fenceMatch[1][0];
      } else if (fenceMatch[1][0] === fence) {
        fence = null;
      }
      continue;
    }
    if (!fence) visible.push(line);
  }

  return visible.join("\n");
}

export function validateGovernanceDocuments({ documents, readme }) {
  const errors = [];

  for (const [name, requirements] of Object.entries(requiredDocuments)) {
    const value = documents[name];
    if (typeof value !== "string") {
      errors.push(`${name}: missing required governance document.`);
      continue;
    }
    if (value.trim().length < 400) {
      errors.push(`${name}: document is empty or not substantive.`);
      continue;
    }
    const structuralValue = structuralMarkdown(value);
    const headings = new Set(
      structuralValue
        .split("\n")
        .filter((line) => /^#{1,6} /.test(line))
        .map((line) => line.trim().toLowerCase()),
    );
    for (const heading of requirements.headings) {
      if (!headings.has(heading.toLowerCase())) {
        errors.push(`${name}: missing required heading "${heading}".`);
      }
    }
    for (const phrase of requirements.phrases) {
      if (!value.toLowerCase().includes(phrase.toLowerCase())) {
        errors.push(`${name}: missing required content "${phrase}".`);
      }
    }
    for (const [label, destination] of Object.entries(requirements.links)) {
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const escapedDestination = destination.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const markdownLink = new RegExp(
        String.raw`\[${escapedLabel}\]\(${escapedDestination}\)`,
        "i",
      );
      if (!markdownLink.test(structuralValue)) {
        errors.push(
          `${name}: missing required link "${label}" to ${destination}.`,
        );
      }
    }
    for (const unsafe of unsafePatterns) {
      if (unsafe.pattern.test(value)) {
        errors.push(`${name}: contains ${unsafe.name}.`);
      }
    }
  }

  const structuralReadme = structuralMarkdown(readme);
  for (const name of Object.keys(requiredDocuments)) {
    const markdownLink = new RegExp(
      String.raw`\[[^\]]+\]\(${name.replace(".", String.raw`\.`)}\)`,
      "i",
    );
    if (!markdownLink.test(structuralReadme)) {
      errors.push(`README.md: does not link ${name}.`);
    }
  }

  return errors;
}

export async function validateGovernanceFiles(repositoryRoot) {
  const documents = {};
  for (const name of Object.keys(requiredDocuments)) {
    try {
      documents[name] = await readFile(path.join(repositoryRoot, name), "utf8");
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  const readme = await readFile(path.join(repositoryRoot, "README.md"), "utf8");
  return validateGovernanceDocuments({ documents, readme });
}

async function run() {
  const repositoryRoot = path.resolve(
    process.argv[2] ??
      fileURLToPath(new URL("..", import.meta.url)),
  );
  const errors = await validateGovernanceFiles(repositoryRoot);
  if (errors.length > 0) {
    console.error("Repository governance validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    "Repository governance documents passed: required headings, canonical links, and prohibited-pattern checks.",
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await run();
}
