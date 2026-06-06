# Contributing to saas-ui-skills

Thanks for helping make AI agents better at building SaaS UIs! Contributions of new skills, examples, fixes, and improvements are all welcome.

## Ways to contribute

- **Add a new skill** for a SaaS UI pattern agents get wrong.
- **Improve an existing skill** — better patterns, clearer pitfalls, updated APIs.
- **Add an example** — a generated component that demonstrates a skill.
- **Fix the installer or tooling.**
- **Report bugs or request skills** via [issues](https://github.com/param087/saas-ui-skills/issues).

## Anatomy of a skill

Each skill lives in `skills/<skill-name>/SKILL.md`, where `<skill-name>` is short and `kebab-case`. The file has two parts:

```markdown
---
name: command-palette
description: Use when adding a ⌘K command palette. Covers cmdk setup, fuzzy search, keyboard shortcuts, grouped results, and accessible focus management.
---

# Command Palette

## Overview
One paragraph: what this is and the single most important idea.

## When to use
- Bullet trigger conditions.

## Workflow / patterns
Concrete React + Tailwind + shadcn/ui code. Show the *right* way.

## Pitfalls
The mistakes agents actually make.

## Hand-off
What the agent should produce, and which skill comes next.
```

### Frontmatter rules (enforced by CI)

- `name` **must** match the directory name exactly.
- `description` **must** start with `Use when` and be **30–500 characters**.
- The `description` is the trigger the agent reads — make it specific about *when*, not *what*.

### Writing guidelines

- **Be concrete.** Prefer a real shadcn/ui + Tailwind snippet over a paragraph of prose.
- **Accessible by default.** Use semantic elements and Radix/shadcn primitives; cover focus, ARIA, and keyboard.
- **Handle the non-happy states.** Loading, empty, and error — not just the success path.
- **Always include a Pitfalls section.** This is the highest-value part.
- **Keep it focused.** One pattern per skill; hand off to others rather than sprawling.
- **No secrets, no proprietary code, no copy-pasted licensed text.**

## Adding an example

Examples live in `examples/<skill-name>/`. A good example is a single, self-contained `.tsx` component that reads like real agent output: typed, accessible, with the states the skill emphasizes. Reference shadcn/ui components via the usual `@/components/ui/*` import paths (examples don't need to compile in this repo — they illustrate the pattern).

## Local development

```bash
# Validate every skill (runs in CI)
node scripts/validate-skills.mjs

# See your skill in the catalog
node install.mjs list

# Try installing into a throwaway dir
node install.mjs install --dir /tmp/skills-test
```

Requires **Node >= 18**. There are no dependencies to install.

## Submitting a PR

1. Fork and create a branch: `git checkout -b add-command-palette`.
2. Add or edit your skill under `skills/` (and optionally an example under `examples/`).
3. Run `node scripts/validate-skills.mjs` until it passes.
4. Commit with a clear message: `add command-palette skill`.
5. Open a PR and fill out the checklist. CI must be green to merge.

## Code of conduct

Be respectful and constructive. We're here to build something genuinely useful for the SaaS + agents community.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
