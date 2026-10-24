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

const REPOSITORY = "https://github.com/squirrelscan/skills";

const SEMVER = /^\d+\.\d+\.\d+$/;

function squirrelscanSkillVersion(): string {
  const src = readFileSync(join(root, "squirrelscan", "SKILL.md"), "utf8");
  const block = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = block ? (Bun.YAML.parse(block[1] ?? "") as { metadata?: { version?: unknown } } | null) : null;
  return String(fm?.metadata?.version ?? "");
}

// Plugin manifests need semver (claude plugin validate --strict, OpenAI
// listing). The skill uses "major.minor": pad it with ".0". A bump of the skill
// is a bump of the plugin, so installs update exactly when we bump it.
function expectedPluginVersion(skillVersion: string): string {
  return /^\d+\.\d+$/.test(skillVersion) ? `${skillVersion}.0` : skillVersion;
}

// This repo is the only home of the squirrelscan agent plugins, so a broken
// manifest here breaks every install of that plugin.
function checkPlugins(): string[] {
  const MCP_URL = "https://mcp.squirrelscan.com/mcp";
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
  const skillMetaVersion = squirrelscanSkillVersion();
  const expectedVersion = expectedPluginVersion(skillMetaVersion);
  for (const [rel, m] of Object.entries({ ...manifests, ".claude-plugin/marketplace.json#squirrelscan": entry ?? {} })) {
    // The version lives in the three manifests only, never in a marketplace
    // entry (two sources drift). It must equal the squirrelscan skill's
    // metadata.version, see expectedPluginVersion().
    if (rel.startsWith(".claude-plugin/marketplace.json")) {
      if ("version" in m) problems.push(`${rel}: drop \`version\`; plugin.json is the only source`);
    } else if (m.version !== expectedVersion) {
      problems.push(`${rel}: version must be "${expectedVersion}" (squirrelscan skill metadata.version ${skillMetaVersion}), got ${JSON.stringify(m.version)}`);
    }
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
  problems.push(...checkOpenAi(agent, repo));
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
  problems.push(...checkChannelPlugin(read));
  return problems;
}

// The channel is a separate, opt-in plugin. It must never leak into the main
// plugin's MCP configs: every install of that would spawn a polling process,
// and it breaks on CLI versions that have no `squirrel channel` command.
function checkChannelPlugin(read: (rel: string) => Record<string, any>): string[] {
  const problems: string[] = [];
  const dir = "plugins/squirrelscan-channel";
  const marketplace = read(".claude-plugin/marketplace.json");
  const entry = marketplace.plugins?.find((p: { name?: string }) => p.name === "squirrelscan-channel");
  if (!entry) return [".claude-plugin/marketplace.json: no `squirrelscan-channel` plugin entry"];
  if (entry.source !== `./${dir}`) problems.push(`.claude-plugin/marketplace.json: squirrelscan-channel source must be "./${dir}"`);
  if ("version" in entry) problems.push(".claude-plugin/marketplace.json#squirrelscan-channel: drop `version`; plugin.json is the only source");

  const manifest = read(`${dir}/.claude-plugin/plugin.json`);
  if (manifest.name !== "squirrelscan-channel") problems.push(`${dir}/.claude-plugin/plugin.json: name must be "squirrelscan-channel"`);
  // Versioned on its own: bump it when the channel plugin changes.
  if (!SEMVER.test(String(manifest.version))) problems.push(`${dir}/.claude-plugin/plugin.json: version must be semver, got ${JSON.stringify(manifest.version)}`);
  if (manifest.repository !== REPOSITORY) problems.push(`${dir}/.claude-plugin/plugin.json: repository must be ${REPOSITORY}`);
  const channel = manifest.channels?.[0];
  if (manifest.channels?.length !== 1 || channel?.server !== "squirrelscan") {
    problems.push(`${dir}/.claude-plugin/plugin.json: channels must be one entry bound to the \`squirrelscan\` MCP server`);
  }

  const server = read(`${dir}/.mcp.json`).mcpServers?.squirrelscan ?? {};
  if (server.command !== "squirrel" || JSON.stringify(server.args) !== JSON.stringify(["channel"])) {
    problems.push(`${dir}/.mcp.json: squirrelscan must run \`squirrel channel\``);
  }

  for (const rel of ["mcp.json", ".mcp.json", ".cursor-plugin/mcp.json"]) {
    const servers = read(rel).mcpServers ?? {};
    for (const [name, s] of Object.entries<Record<string, any>>(servers)) {
      if (s.command === "squirrel" && s.args?.includes("channel")) problems.push(`${rel}: \`${name}\` runs \`squirrel channel\`; keep it in ${dir} only`);
    }
  }
  return problems;
}

// OpenAI listing (extensions.com.openai.interface): limits from
// https://developers.openai.com/plugins/deploy/submission
function checkOpenAi(agent: Record<string, any>, dir: string): string[] {
  const problems: string[] = [];
  const ui = agent.extensions?.["com.openai"]?.interface;
  if (!ui) return ["plugin.json: extensions.com.openai.interface is missing"];
  const max: Record<string, number> = { displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 80 };
  for (const [k, n] of Object.entries(max)) {
    if (typeof ui[k] !== "string" || !ui[k] || ui[k].length > n) problems.push(`plugin.json: interface.${k} must be a string of 1-${n} chars`);
  }
  if (typeof ui.category !== "string" || !ui.category) problems.push("plugin.json: interface.category is required");
  for (const k of ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"]) {
    if (typeof ui[k] !== "string" || !ui[k].startsWith("https://") || ui[k].length > 1024) problems.push(`plugin.json: interface.${k} must be an https URL`);
  }
  for (const k of ["logo", "composerIcon"]) {
    const v = ui[k];
    if (typeof v !== "string" || !v.startsWith("./") || !existsSync(join(dir, v))) problems.push(`plugin.json: interface.${k} must be a ./ path to a file that exists`);
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
