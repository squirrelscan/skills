// Skill versions: parse, compare and bump `metadata.version` in a SKILL.md.
//
// New and bumped versions are full semver (MAJOR.MINOR.PATCH). Skills published
// before the semver rule carry "major.minor" ("3.3"); the squirrel CLI compares
// versions as dotted numbers with missing parts read as 0, so "3.3" and "3.3.0"
// are equal and "3.4.0" is newer. compare() reads both forms the same way.
export type Part = "major" | "minor" | "patch";

export const SEMVER = /^\d+\.\d+\.\d+$/;
const DOTTED = /^\d+(\.\d+){0,2}$/;

export function parts(version: string): [number, number, number] {
  if (!DOTTED.test(version)) throw new Error(`not a version: ${JSON.stringify(version)}`);
  const [a = 0, b = 0, c = 0] = version.split(".").map(Number);
  return [a, b, c];
}

/** Negative when a < b, 0 when equal, positive when a > b. */
export function compare(a: string, b: string): number {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i]! - y[i]!;
  return 0;
}

export function bump(version: string, part: Part): string {
  const [major, minor, patch] = parts(version);
  if (part === "major") return `${major + 1}.0.0`;
  if (part === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/** The `metadata.version` a SKILL.md declares, or undefined. */
export function readVersion(skillMd: string): string | undefined {
  const block = skillMd.match(FRONTMATTER);
  if (!block) return undefined;
  try {
    const fm = Bun.YAML.parse(block[1] ?? "") as { metadata?: { version?: unknown } } | null;
    const v = fm?.metadata?.version;
    return typeof v === "string" ? v : undefined;
  } catch {
    return undefined;
  }
}

/** Rewrite `version: "..."` inside the frontmatter's `metadata:` block. */
export function writeVersion(skillMd: string, version: string): string {
  const block = skillMd.match(FRONTMATTER);
  if (!block) throw new Error("no frontmatter block");
  const fm = block[1]!;
  const next = fm.replace(/^(\s+version:\s*)["']?[^"'\s]+["']?/m, `$1"${version}"`);
  if (next === fm) throw new Error("no metadata.version line to rewrite");
  return skillMd.replace(fm, next);
}
