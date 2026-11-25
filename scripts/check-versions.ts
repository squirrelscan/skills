// Fail when a file under skills/<name>/ changed against the base without that
// skill's metadata.version going up, and when a skill's version is not semver.
//
//   bun scripts/check-versions.ts            # working tree vs the base
//   bun scripts/check-versions.ts --staged   # the index vs the base (pre-commit hook)
//
// The base is the merge base of HEAD and origin/main (override: SKILLS_BASE_REF).
// Where there is no such ref (a shallow CI checkout) the check is skipped with a
// note: it is a contributor gate, `make hooks` runs it on every commit.
import { join } from "node:path";

import { compare, readVersion, SEMVER } from "./versions";

const repo = join(import.meta.dir, "..");

function git(args: string[], allowFail = false): string {
  const out = Bun.spawnSync(["git", ...args], { cwd: repo, stdout: "pipe", stderr: "pipe" });
  if (out.exitCode !== 0) {
    if (allowFail) return "";
    throw new Error(`git ${args.join(" ")}: ${out.stderr.toString().trim()}`);
  }
  return out.stdout.toString();
}

function baseRef(): string | undefined {
  const named = process.env.SKILLS_BASE_REF;
  const candidates = named ? [named] : ["origin/main"];
  for (const ref of candidates) {
    const base = git(["merge-base", "HEAD", ref], true).trim();
    if (base) return base;
  }
  return undefined;
}

/** Problems with skill versions against the base; empty when fine or skipped. */
export async function versionProblems(staged = false): Promise<{ problems: string[]; note?: string }> {
  const problems: string[] = [];
  const base = baseRef();
  if (!base) return { problems, note: "versions: no base ref (origin/main), gate skipped" };

  // Files changed under skills/ against the base, plus new untracked ones.
  const changed = new Set<string>();
  const diff = staged
    ? git(["diff", "--cached", "--name-only", "-z", base, "--", "skills/"])
    : git(["diff", "--name-only", "-z", base, "--", "skills/"]);
  for (const f of diff.split("\0").filter(Boolean)) changed.add(f);
  if (!staged) {
    for (const f of git(["ls-files", "-z", "--others", "--exclude-standard", "--", "skills/"]).split("\0").filter(Boolean)) {
      changed.add(f);
    }
  }
  const skills = new Set([...changed].map((f) => f.split("/")[1]).filter((n): n is string => !!n));

  for (const name of [...skills].sort()) {
    const path = `skills/${name}/SKILL.md`;
    const current = staged
      ? git(["show", `:${path}`], true)
      : (await Bun.file(join(repo, path)).exists())
        ? await Bun.file(join(repo, path)).text()
        : "";
    if (!current) continue; // the skill was removed: nothing to version
    const version = readVersion(current);
    if (!version || !SEMVER.test(version)) {
      problems.push(`${path}: metadata.version must be MAJOR.MINOR.PATCH, got ${JSON.stringify(version)}`);
      continue;
    }
    const before = readVersion(git(["show", `${base}:${path}`], true));
    if (before === undefined) continue; // a new skill: any semver is a first version
    if (compare(version, before) <= 0) {
      problems.push(
        `${path}: files under skills/${name}/ changed but metadata.version is still ${version} (base ${before}): run make bump SKILL=${name} PART=patch|minor|major`,
      );
    }
  }
  return { problems };
}

if (import.meta.main) {
  const { problems, note } = await versionProblems(process.argv.includes("--staged"));
  if (note) console.log(note);
  for (const p of problems) console.error(p);
  if (problems.length > 0) process.exit(1);
  if (!note) console.log("skill versions: ok");
}
