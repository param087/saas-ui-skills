#!/usr/bin/env node
/**
 * Validates every skill in skills/ has a well-formed SKILL.md.
 *
 * Checks per skill:
 *   - skills/<name>/SKILL.md exists
 *   - has a YAML frontmatter block (--- ... ---)
 *   - frontmatter has non-empty `name` and `description`
 *   - frontmatter `name` matches the directory name
 *   - `description` is a reasonable length and starts with "Use when"
 *   - body has at least one heading
 *
 * Exit code 0 = all good, 1 = one or more failures.
 * Zero dependencies. Node >= 18.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m",
};
const ok = (s) => `${C.green}✓${C.reset} ${s}`;
const bad = (s) => `${C.red}✗${C.reset} ${s}`;

const MIN_DESC = 30;
const MAX_DESC = 500;

function parseFrontmatter(text) {
  const m = text.match(/^---\s*[\r\n]([\s\S]*?)[\r\n]---/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    const fm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (fm) fields[fm[1]] = fm[2].trim();
  }
  return fields;
}

function validateSkill(name) {
  const errors = [];
  const dir = path.join(SKILLS_DIR, name);
  const file = path.join(dir, "SKILL.md");

  if (!fs.existsSync(file)) {
    return [`missing SKILL.md`];
  }

  const text = fs.readFileSync(file, "utf8");
  const fm = parseFrontmatter(text);
  if (!fm) {
    errors.push("missing or malformed YAML frontmatter (--- ... ---)");
    return errors;
  }

  if (!fm.name) errors.push("frontmatter missing `name`");
  else if (fm.name !== name) errors.push(`frontmatter name "${fm.name}" != directory "${name}"`);

  if (!fm.description) {
    errors.push("frontmatter missing `description`");
  } else {
    if (fm.description.length < MIN_DESC) errors.push(`description too short (<${MIN_DESC} chars)`);
    if (fm.description.length > MAX_DESC) errors.push(`description too long (>${MAX_DESC} chars)`);
    if (!/^use when/i.test(fm.description)) errors.push('description should start with "Use when"');
  }

  const body = text.replace(/^---[\s\S]*?---/, "").trim();
  if (!/^#\s|\n#{1,6}\s/.test(body)) errors.push("body has no markdown heading");
  if (body.length < 200) errors.push("body looks too thin (<200 chars)");

  return errors;
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(bad(`skills/ directory not found at ${SKILLS_DIR}`));
    process.exit(1);
  }

  const names = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (names.length === 0) {
    console.error(bad("no skills found in skills/"));
    process.exit(1);
  }

  console.log(`\n${C.bold}Validating ${names.length} skill(s)${C.reset}\n`);

  let failed = 0;
  for (const name of names) {
    const errors = validateSkill(name);
    if (errors.length === 0) {
      console.log("  " + ok(name));
    } else {
      failed++;
      console.log("  " + bad(`${C.bold}${name}${C.reset}`));
      for (const e of errors) console.log(`      ${C.yellow}- ${e}${C.reset}`);
    }
  }

  console.log("");
  if (failed > 0) {
    console.error(bad(`${failed} skill(s) failed validation.`));
    process.exit(1);
  }
  console.log(ok(`${C.bold}All ${names.length} skills valid.${C.reset}\n`));
}

main();
