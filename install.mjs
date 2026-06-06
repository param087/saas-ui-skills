#!/usr/bin/env node
/**
 * saas-ui-skills installer
 *
 * Installs the SaaS UI (React + Tailwind + shadcn/ui) skill pack into your
 * AI coding agent.
 *
 * Usage:
 *   npx saas-ui-skills list
 *   npx saas-ui-skills install --target codex
 *   npx saas-ui-skills install --target all --scope project
 *   npx saas-ui-skills install --target claude --skills forms-and-validation,data-tables
 *   npx saas-ui-skills install --dir ./my-agent/skills
 *
 * Targets: codex | claude | opencode | cursor | all
 * Scope:   global (default) | project
 *
 * Zero dependencies. Node >= 18.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.join(__dirname, "skills");

// target -> install locations. layout "folder" copies <skill>/SKILL.md;
// "flat" copies <skill>.md (for tools that read a flat rules dir).
const TARGETS = {
  codex:    { label: "Codex",       layout: "folder", global: "~/.codex/skills",           project: ".codex/skills" },
  claude:   { label: "Claude Code", layout: "folder", global: "~/.claude/skills",          project: ".claude/skills" },
  opencode: { label: "OpenCode",    layout: "folder", global: "~/.config/opencode/skills", project: ".opencode/skills" },
  cursor:   { label: "Cursor",      layout: "flat",   global: null,                        project: ".cursor/rules" },
};

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  green: "\x1b[32m", cyan: "\x1b[36m", yellow: "\x1b[33m", red: "\x1b[31m",
};
const log = (...a) => console.log(...a);
const ok = (s) => `${C.green}✓${C.reset} ${s}`;
const warn = (s) => `${C.yellow}!${C.reset} ${s}`;
const err = (s) => `${C.red}✗${C.reset} ${s}`;

function expandHome(p) {
  if (!p) return p;
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

function parseArgs(argv) {
  const args = { _: [], scope: "global", target: null, skills: null, dir: null, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "-t": case "--target": args.target = next(); break;
      case "--scope": args.scope = next(); break;
      case "--skills": args.skills = next(); break;
      case "--dir": args.dir = next(); break;
      case "-f": case "--force": args.force = true; break;
      case "-h": case "--help": args.help = true; break;
      default:
        if (a.startsWith("-")) { log(err(`Unknown option: ${a}`)); process.exit(1); }
        args._.push(a);
    }
  }
  return args;
}

function listSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, d.name, "SKILL.md")))
    .map((d) => d.name)
    .sort();
}

function readDescription(name) {
  const file = path.join(SKILLS_DIR, name, "SKILL.md");
  const text = fs.readFileSync(file, "utf8");
  const m = text.match(/^---\s*[\r\n]([\s\S]*?)[\r\n]---/);
  if (!m) return "";
  const dm = m[1].match(/^description:\s*(.+)$/m);
  return dm ? dm[1].trim() : "";
}

function printHelp() {
  log(`${C.bold}saas-ui-skills${C.reset} — SaaS UI (React + Tailwind + shadcn/ui) skills for AI coding agents

${C.bold}Usage${C.reset}
  npx saas-ui-skills <command> [options]

${C.bold}Commands${C.reset}
  list                       List available skills
  install                    Install skills into an agent

${C.bold}Options${C.reset}
  -t, --target <name>        codex | claude | opencode | cursor | all
      --scope <scope>        global (default) | project
      --skills <a,b,c>       comma-separated subset (default: all)
      --dir <path>           install into a custom directory (overrides target)
  -f, --force                overwrite existing skills
  -h, --help                 show this help

${C.bold}Examples${C.reset}
  npx saas-ui-skills list
  npx saas-ui-skills install --target codex
  npx saas-ui-skills install --target all --scope project
  npx saas-ui-skills install --target claude --skills forms-and-validation,data-tables
`);
}

function copySkillFolder(name, destRoot) {
  const src = path.join(SKILLS_DIR, name);
  const dest = path.join(destRoot, name);
  fs.cpSync(src, dest, { recursive: true });
}

function copySkillFlat(name, destRoot) {
  const src = path.join(SKILLS_DIR, name, "SKILL.md");
  const dest = path.join(destRoot, `${name}.md`);
  fs.copyFileSync(src, dest);
}

function resolveDest(target, scope) {
  const t = TARGETS[target];
  const raw = scope === "project" ? t.project : t.global;
  if (!raw) return null;
  return scope === "project" ? path.resolve(process.cwd(), raw) : expandHome(raw);
}

function installInto(destRoot, layout, skills, force, label) {
  fs.mkdirSync(destRoot, { recursive: true });
  let installed = 0, skipped = 0;
  for (const name of skills) {
    const exists = layout === "flat"
      ? fs.existsSync(path.join(destRoot, `${name}.md`))
      : fs.existsSync(path.join(destRoot, name));
    if (exists && !force) { skipped++; continue; }
    if (exists && force) {
      const p = layout === "flat" ? path.join(destRoot, `${name}.md`) : path.join(destRoot, name);
      fs.rmSync(p, { recursive: true, force: true });
    }
    layout === "flat" ? copySkillFlat(name, destRoot) : copySkillFolder(name, destRoot);
    installed++;
  }
  log(ok(`${C.bold}${label}${C.reset} → ${C.cyan}${destRoot}${C.reset}  (${installed} installed${skipped ? `, ${skipped} skipped` : ""})`));
  if (skipped && !force) log(`  ${C.dim}use --force to overwrite the ${skipped} existing skill(s)${C.reset}`);
}

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  const cmd = args._[0] || (args.target || args.dir ? "install" : "help");

  if (args.help || cmd === "help") return printHelp();

  const available = listSkills();
  if (available.length === 0) { log(err("No skills found next to the installer.")); process.exit(1); }

  if (cmd === "list") {
    log(`\n${C.bold}Available skills (${available.length})${C.reset}\n`);
    for (const name of available) {
      const desc = readDescription(name).replace(/^Use when\s*/i, "");
      log(`  ${C.cyan}${name}${C.reset}\n    ${C.dim}${desc.slice(0, 110)}${desc.length > 110 ? "…" : ""}${C.reset}`);
    }
    log(`\nInstall with: ${C.bold}npx saas-ui-skills install --target codex${C.reset}\n`);
    return;
  }

  if (cmd !== "install") { log(err(`Unknown command: ${cmd}`)); printHelp(); process.exit(1); }

  // Resolve which skills
  let skills = available;
  if (args.skills) {
    const want = args.skills.split(",").map((s) => s.trim()).filter(Boolean);
    const bad = want.filter((s) => !available.includes(s));
    if (bad.length) { log(err(`Unknown skill(s): ${bad.join(", ")}`)); log(`Run ${C.bold}npx saas-ui-skills list${C.reset}`); process.exit(1); }
    skills = want;
  }

  log(`\n${C.bold}Installing ${skills.length} skill(s)${C.reset} ${C.dim}(scope: ${args.scope})${C.reset}\n`);

  // Custom dir overrides target
  if (args.dir) {
    installInto(path.resolve(process.cwd(), args.dir), "folder", skills, args.force, "Custom dir");
    log(`\n${ok("Done.")}\n`);
    return;
  }

  const target = (args.target || "").toLowerCase();
  if (!target) { log(err("Specify --target codex|claude|opencode|cursor|all or --dir <path>")); process.exit(1); }

  const targets = target === "all" ? Object.keys(TARGETS) : [target];
  const unknown = targets.filter((t) => !TARGETS[t]);
  if (unknown.length) { log(err(`Unknown target(s): ${unknown.join(", ")}`)); process.exit(1); }

  for (const t of targets) {
    const dest = resolveDest(t, args.scope);
    if (!dest) { log(warn(`${TARGETS[t].label}: no ${args.scope} location (try --scope project).`)); continue; }
    installInto(dest, TARGETS[t].layout, skills, args.force, TARGETS[t].label);
  }

  log(`\n${ok("Done.")} Restart your agent or start a new session to load the skills.\n`);
}

try {
  main();
} catch (e) {
  log(err(e.message || String(e)));
  process.exit(1);
}
