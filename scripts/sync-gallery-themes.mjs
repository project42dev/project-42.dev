import { createHash } from "node:crypto";
import { access, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const themesRoot = path.join(root, "public", "themes");
const lockPath = path.join(root, "config", "theme-bundles.lock.json");
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const sourceArg = args.indexOf("--source");
const sourceRoot = path.resolve(
  sourceArg >= 0 ? args[sourceArg + 1] : path.join(root, "..", "project42-gallery"),
);
const config = JSON.parse(await readFile(path.join(root, "project42.config.json"), "utf8"));
const themeIds = [...config.availableThemes].sort();

function assertSafeId(id) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Unsafe theme id: ${id}`);
}

function assertInside(parent, target) {
  const relative = path.relative(parent, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe theme target: ${target}`);
  }
}

async function filesUnder(directory, prefix = "") {
  const output = [];
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink()) throw new Error(`Theme bundles may not contain symlinks: ${entry.name}`);
    const relative = path.posix.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesUnder(absolute, relative));
    else if (entry.isFile()) output.push({ relative, absolute });
  }
  return output;
}

async function hashFile(file) {
  const bytes = await readFile(file);
  const extension = path.extname(file).toLowerCase();
  const content = [".css", ".json", ".svg"].includes(extension)
    ? bytes.toString("utf8").replace(/^\uFEFF/, "").replaceAll("\r\n", "\n")
    : bytes;
  return createHash("sha256").update(content).digest("hex");
}

async function inventoryTheme(id, directory) {
  const manifest = JSON.parse(await readFile(path.join(directory, "theme.json"), "utf8"));
  if (manifest.id !== id) throw new Error(`${id}: theme.json id mismatch`);
  const required = [
    manifest.assets?.tokens,
    manifest.assets?.components,
    manifest.assets?.mark,
    manifest.assets?.hero,
    ...Object.values(manifest.assets?.badges || {}),
  ];
  for (const relative of required) {
    if (typeof relative !== "string" || path.isAbsolute(relative) || relative.includes("..")) {
      throw new Error(`${id}: unsafe or missing asset reference`);
    }
    await access(path.join(directory, relative));
  }
  const files = {};
  for (const file of await filesUnder(directory)) files[file.relative] = await hashFile(file.absolute);
  return files;
}

if (checkOnly) {
  const lock = JSON.parse(await readFile(lockPath, "utf8"));
  if (lock.selectedTheme !== config.theme) throw new Error("Selected theme differs from theme lock");
  if (JSON.stringify(Object.keys(lock.themes).sort()) !== JSON.stringify(themeIds)) {
    throw new Error("Configured themes differ from theme lock");
  }
  for (const id of themeIds) {
    assertSafeId(id);
    const actual = await inventoryTheme(id, path.join(themesRoot, id));
    if (JSON.stringify(actual) !== JSON.stringify(lock.themes[id].files)) {
      throw new Error(`${id}: installed bundle differs from lock`);
    }
  }
  console.log(`Verified ${themeIds.length} locked Gallery theme bundles at ${lock.gallery.commit}.`);
  process.exit(0);
}

const sourceThemes = path.join(sourceRoot, "themes");
const galleryCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRoot, encoding: "utf8" }).trim();
const lock = {
  schemaVersion: 1,
  source: "https://github.com/project42dev/project42-gallery",
  gallery: { commit: galleryCommit },
  selectedTheme: config.theme,
  themes: {},
};

await mkdir(themesRoot, { recursive: true });
for (const id of themeIds) {
  assertSafeId(id);
  const source = path.join(sourceThemes, id);
  const target = path.join(themesRoot, id);
  assertInside(sourceThemes, source);
  assertInside(themesRoot, target);
  await inventoryTheme(id, source);
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true, errorOnExist: true });
  lock.themes[id] = { files: await inventoryTheme(id, target) };
}

await mkdir(path.dirname(lockPath), { recursive: true });
await writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
console.log(`Installed ${themeIds.length} Gallery bundles from ${galleryCommit}.`);
