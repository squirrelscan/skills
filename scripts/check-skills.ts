// Fail when any skills/*/SKILL.md would be skipped by a skill installer:
// frontmatter must parse as YAML and carry string `name` (matching its
// directory) and `description` fields. Then check the agent plugin manifests
// this repo ships (Claude Code, Cursor, Agent Plugins): see checkPlugins(). Then
// check manifest.json, which the squirrel CLI installs the skills from, still
// describes every file in skills/.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { manifestProblems } from "./manifest";

const repo = join(import.meta.dir, "..");
const root = join(repo, "skills");
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

// This repo is the only home of the squirrelscan agent plugins, so a broken
// manifest here breaks every install of that plugin.
function checkPlugins(): string[] {
  const MCP_URL = "https://mcp.squirrelscan.com/mcp";
  const REPOSITORY = "https://github.com/squirrelscan/skills";
  const problems: string[] = [];
  const read = (rel: string): Record<string, any> => {
    try {
      return JSON.parse(readFileSync(join(repo, rel), "utf8"));
    } catch (e) {
      problems.push(`${rel}: ${(e as Error).message}`);
      return {};
    }
  };

  const marketplace = read(".claude-plugin/marketplace.json");
  const entry = marketplace.plugins?.find((p: { name?: string }) => p.name === "squirrelscan");
  if (!entry) problems.push(".claude-plugin/marketplace.json: no `squirrelscan` plugin entry");
  else if (entry.source !== "./") problems.push(".claude-plugin/marketplace.json: plugin source must be \"./\"");

  const manifests: Record<string, Record<string, any>> = {
    ".claude-plugin/plugin.json": read(".claude-plugin/plugin.json"),
    ".cursor-plugin/plugin.json": read(".cursor-plugin/plugin.json"),
    "plugin.json": read("plugin.json"),
  };
  const description = manifests[".claude-plugin/plugin.json"]?.description;
  for (const [rel, m] of Object.entries({ ...manifests, ".claude-plugin/marketplace.json#squirrelscan": entry ?? {} })) {
    // No version anywhere. A version string pins the plugin: Claude Code only
    // updates an install when it changes. Without one it versions by commit,
    // so every push to main reaches users with nothing to remember to bump.
    if ("version" in m) problems.push(`${rel}: drop \`version\`; the plugin versions by commit`);
    if (m.description !== description) problems.push(`${rel}: description differs from .claude-plugin/plugin.json`);
  }
  for (const [rel, m] of Object.entries(manifests)) {
    if (m.name !== "squirrelscan") problems.push(`${rel}: name must be "squirrelscan"`);
    if (m.repository !== REPOSITORY) problems.push(`${rel}: repository must be ${REPOSITORY}`);
  }

  // Agent Plugins 1.0.0 closes both schemas: an unknown field rejects the plugin.
  const agent = manifests["plugin.json"];
  const agentKeys = ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"];
  if (agent.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") problems.push("plugin.json: wrong $schema");
  for (const key of Object.keys(agent)) if (!agentKeys.includes(key)) problems.push(`plugin.json: unknown field \`${key}\``);
  const mcp = read("mcp.json");
  if (mcp.$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") problems.push("mcp.json: wrong $schema");
  for (const key of Object.keys(mcp)) if (key !== "$schema" && key !== "mcpServers") problems.push(`mcp.json: unknown field \`${key}\``);
  const server = mcp.mcpServers?.squirrelscan ?? {};
  if (server.type !== "streamable-http" || Object.keys(server).some((k) => k !== "type" && k !== "url" && k !== "headers")) {
    problems.push("mcp.json: squirrelscan must be a streamable-http server with only type, url and headers");
  }

  // Three MCP configs, one per plugin format, all for the same hosted server.
  for (const rel of ["mcp.json", ".mcp.json", ".cursor-plugin/mcp.json"]) {
    const url = (rel === "mcp.json" ? mcp : read(rel)).mcpServers?.squirrelscan?.url;
    if (url !== MCP_URL) problems.push(`${rel}: squirrelscan url must be ${MCP_URL}`);
  }
  const cursor = manifests[".cursor-plugin/plugin.json"];
  for (const key of ["skills", "mcpServers"]) {
    if (typeof cursor[key] !== "string" || !existsSync(join(repo, cursor[key]))) {
      problems.push(`.cursor-plugin/plugin.json: \`${key}\` must be a path that exists`);
    }
  }
  return problems;
}

const pluginProblems = checkPlugins();
if (pluginProblems.length > 0) {
  failed++;
  for (const p of pluginProblems) console.error(p);
} else {
  console.log("plugin manifests: ok");
}

const manifestIssues = await manifestProblems();
if (manifestIssues.length > 0) {
  failed++;
  for (const p of manifestIssues) console.error(p);
} else {
  console.log("manifest.json: ok");
}

if (failed > 0) process.exit(1);
