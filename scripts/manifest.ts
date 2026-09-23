// Generate manifest.json: every skill under skills/, its version (SKILL.md
// `metadata.version`) and every file in it with its sha256 and size.
//
// The squirrel CLI installs and updates the skills from this manifest. It
// downloads only the files whose hash changed and verifies each one before
// writing, so the manifest must always describe exactly the files in skills/:
// check-skills.ts fails CI when it doesn't.
//
//   bun run scripts/manifest.ts          # write manifest.json
//   bun run scripts/manifest.ts --check  # exit 1 when manifest.json is stale
import { join } from "node:path";

export interface ManifestFile {
  /** Relative to the skill's directory, "/"-separated. */
  path: string;
  sha256: string;
  size: number;
}

export interface ManifestSkill {
  name: string;
  version: string;
  files: ManifestFile[];
}

export interface Manifest {
  schema: 1;
  repository: string;
  skills: ManifestSkill[];
}

const repo = join(import.meta.dir, "..");
export const MANIFEST = join(repo, "manifest.json");

function git(args: string[]): string {
  const out = Bun.spawnSync(["git", ...args], { cwd: repo, stdout: "pipe", stderr: "pipe" });
  if (out.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${out.stderr.toString().trim()}`);
  return out.stdout.toString();
}

// Byte order, not locale order: the CLI and this script must agree on it.
const byteOrder = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

function skillVersion(name: string, skillMd: string): string {
  const block = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = block ? (Bun.YAML.parse(block[1] ?? "") as { metadata?: { version?: unknown } } | null) : null;
  const version = fm?.metadata?.version;
  if (typeof version !== "string" || !version) {
    throw new Error(`skills/${name}/SKILL.md: metadata.version must be a non-empty string`);
  }
  return version;
}

export async function buildManifest(): Promise<Manifest> {
  // Tracked files plus new ones not yet added, minus anything .gitignore
  // drops: what a clean checkout of this commit will hold, once committed.
  const listed = git(["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", "skills/"])
    .split("\0")
    .filter(Boolean);
  const bySkill = new Map<string, string[]>();
  for (const file of listed) {
    const [, name, ...rest] = file.split("/");
    if (!name || !rest.length) continue;
    // A deleted-but-still-tracked file is listed too; the manifest describes disk.
    if (!(await Bun.file(join(repo, file)).exists())) continue;
    bySkill.set(name, [...(bySkill.get(name) ?? []), rest.join("/")]);
  }

  const skills: ManifestSkill[] = [];
  for (const name of [...bySkill.keys()].sort(byteOrder)) {
    const paths = bySkill.get(name)!.sort(byteOrder);
    if (!paths.includes("SKILL.md")) continue; // not a skill directory
    const files: ManifestFile[] = [];
    for (const path of paths) {
      const bytes = new Uint8Array(await Bun.file(join(repo, "skills", name, path)).arrayBuffer());
      files.push({
        path,
        sha256: new Bun.CryptoHasher("sha256").update(bytes).digest("hex"),
        size: bytes.byteLength,
      });
    }
    const skillMd = await Bun.file(join(repo, "skills", name, "SKILL.md")).text();
    skills.push({ name, version: skillVersion(name, skillMd), files });
  }
  return { schema: 1, repository: "squirrelscan/skills", skills };
}

export const serialize = (manifest: Manifest) => JSON.stringify(manifest, null, 2) + "\n";

/** Problems with the committed manifest.json; empty when it is current. */
export async function manifestProblems(): Promise<string[]> {
  const expected = serialize(await buildManifest());
  const file = Bun.file(MANIFEST);
  if (!(await file.exists())) return ["manifest.json is missing: run bun run scripts/manifest.ts"];
  if ((await file.text()) !== expected) {
    return ["manifest.json does not match skills/: run bun run scripts/manifest.ts and commit it"];
  }
  return [];
}

if (import.meta.main) {
  if (process.argv.includes("--check")) {
    const problems = await manifestProblems();
    for (const p of problems) console.error(p);
    if (problems.length) process.exit(1);
    console.log("manifest.json: ok");
  } else {
    const manifest = await buildManifest();
    await Bun.write(MANIFEST, serialize(manifest));
    console.log(
      `Wrote manifest.json: ${manifest.skills.map((s) => `${s.name} ${s.version} (${s.files.length} files)`).join(", ")}`,
    );
  }
}
