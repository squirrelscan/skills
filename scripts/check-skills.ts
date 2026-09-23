// Fail when any skills/*/SKILL.md would be skipped by a skill installer:
// frontmatter must parse as YAML and carry string `name` (matching its
// directory) and `description` fields.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..", "skills");
let failed = 0;

for (const dir of readdirSync(root)) {
  const file = join(root, dir, "SKILL.md");
  try {
    if (!statSync(file).isFile()) continue;
  } catch {
    continue;
  }
  const src = readFileSync(file, "utf8");
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const problems: string[] = [];
  if (!match) {
    problems.push("no frontmatter block");
  } else {
    try {
      const fm = Bun.YAML.parse(match[1]) as Record<string, unknown> | null;
      if (typeof fm?.name !== "string") problems.push("`name` is not a string");
      else if (fm.name !== dir) problems.push(`\`name\` "${fm.name}" does not match directory "${dir}"`);
      if (typeof fm?.description !== "string") problems.push("`description` is not a string");
    } catch (e) {
      problems.push(`frontmatter is not valid YAML: ${(e as Error).message}`);
    }
  }
  if (problems.length > 0) {
    failed++;
    for (const p of problems) console.error(`skills/${dir}/SKILL.md: ${p}`);
  } else {
    console.log(`skills/${dir}/SKILL.md: ok`);
  }
}

if (failed > 0) process.exit(1);
