// Bump one skill's metadata.version and regenerate manifest.json.
//
//   bun scripts/bump.ts <skill> patch|minor|major
//   make bump SKILL=audit-website PART=minor
//
// patch: wording and fixes. minor: a new capability or section. major: a
// breaking change to how the skill is invoked. The `squirrelscan` skill's
// version is also the plugin version, so its three plugin manifests move too.
import { existsSync } from "node:fs";
import { join } from "node:path";

import { buildManifest, MANIFEST, serialize } from "./manifest";
import { bump, type Part, readVersion, writeVersion } from "./versions";

const repo = join(import.meta.dir, "..");
const PLUGIN_MANIFESTS = [".claude-plugin/plugin.json", ".cursor-plugin/plugin.json", "plugin.json"];

const [name, part] = process.argv.slice(2);
if (!name || !["patch", "minor", "major"].includes(part ?? "")) {
  console.error("usage: bun scripts/bump.ts <skill> patch|minor|major");
  process.exit(1);
}
const file = join(repo, "skills", name, "SKILL.md");
if (!existsSync(file)) {
  console.error(`no such skill: skills/${name}/SKILL.md`);
  process.exit(1);
}

const src = await Bun.file(file).text();
const before = readVersion(src);
if (!before) {
  console.error(`skills/${name}/SKILL.md has no metadata.version`);
  process.exit(1);
}
const after = bump(before, part as Part);
await Bun.write(file, writeVersion(src, after));

if (name === "squirrelscan") {
  for (const rel of PLUGIN_MANIFESTS) {
    const path = join(repo, rel);
    const text = await Bun.file(path).text();
    await Bun.write(path, text.replace(/("version":\s*")[^"]+(")/, `$1${after}$2`));
  }
}

await Bun.write(MANIFEST, serialize(await buildManifest()));
console.log(`${name}: ${before} -> ${after} (manifest.json regenerated)`);
