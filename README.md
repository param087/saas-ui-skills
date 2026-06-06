# saas-ui-skills

**Production-grade SaaS UI skills for AI coding agents — React, Tailwind CSS & shadcn/ui.**

[![CI](https://github.com/param087/saas-ui-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/param087/saas-ui-skills/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
![Skills](https://img.shields.io/badge/skills-15-success)
![Node](https://img.shields.io/badge/node-%3E%3D18-43853d)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

Coding agents are great generalists but make the same **UI mistakes over and over**: inaccessible `<div>` dropdowns, forms with no validation or error states, data tables that break on empty/loading, modals that trap nothing, hard-coded colors that shatter in dark mode. `saas-ui-skills` is a curated pack of **15 battle-tested skills** that teach your agent to build SaaS interfaces like a senior product engineer — so it stops shipping janky UI.

Works with **Codex, Claude Code, Cursor, and OpenCode**.

---

## Quick start

Install all skills into your agent with one command — **no install, no dependencies**:

```bash
# Codex
npx saas-ui-skills install --target codex

# Claude Code
npx saas-ui-skills install --target claude

# Cursor
npx saas-ui-skills install --target cursor --scope project

# OpenCode
npx saas-ui-skills install --target opencode

# Everything, everywhere
npx saas-ui-skills install --target all
```

Browse what's inside first:

```bash
npx saas-ui-skills list
```

Then restart your agent (or start a new session) and it will pick the right skill up automatically when your task matches.

---

## What's a "skill"?

A skill is a single Markdown file with YAML frontmatter telling the agent **when** to use it and **how** to do the task well:

```markdown
---
name: forms-and-validation
description: Use when building forms with react-hook-form + zod and shadcn/ui Form...
---

# Forms & Validation
...workflow, code patterns, pitfalls, hand-off...
```

Agents that support skills load the `description` up front and pull in the full body only when the task matches — so you get expert guidance **without bloating every prompt**.

---

## The skills

### Foundations & design system
| Skill | Use when… |
|---|---|
| **design-tokens-theming** | Setting up color/typography/spacing scales, CSS variables, the shadcn theme + dark mode. |
| **responsive-layout** | Building the app shell, sidebar, Tailwind breakpoints, container queries. |
| **accessible-components** | Interactive UI must meet WCAG AA — focus, ARIA, keyboard nav, visible focus. |
| **component-architecture** | Composing shadcn/ui, `cva` variants, compound components, when to abstract. |

### Core SaaS components
| Skill | Use when… |
|---|---|
| **forms-and-validation** | Forms with react-hook-form + zod + shadcn `Form`, inline errors, async submit. |
| **data-tables** | Sortable/filterable/paginated tables (TanStack Table + shadcn), bulk actions. |
| **navigation-patterns** | Sidebar nav, command palette (cmdk), tabs, breadcrumbs. |
| **modals-and-dialogs** | Dialog/sheet/drawer, focus trap, destructive-action confirm flows. |

### SaaS product flows
| Skill | Use when… |
|---|---|
| **auth-screens** | Login/signup/forgot/reset, OAuth buttons, security-conscious UX. |
| **billing-and-pricing** | Pricing tables, plan cards, paywalls, usage meters, upgrade prompts. |
| **onboarding-flows** | Multi-step wizards, setup checklists, progressive disclosure. |
| **settings-pages** | Account/team/workspace settings, sectioned forms, danger zone. |

### UX polish & states
| Skill | Use when… |
|---|---|
| **empty-and-loading-states** | Skeletons, empty states with a CTA, error+retry, optimistic UI. |
| **notifications-and-toasts** | Toasts (sonner), inline alerts, a notification center. |
| **dashboard-layout** | KPI/stat cards with deltas, chart placement, overview grids. |

---

## Examples

See the skills applied. The [`examples/`](./examples) folder has real generated components — the kind of output an agent produces when it follows a skill:

| Example | From skill |
|---|---|
| [`SignInForm.tsx`](./examples/forms-and-validation) | forms-and-validation |
| [`InvoicesTable.tsx`](./examples/data-tables) | data-tables |
| [`PricingTable.tsx`](./examples/billing-and-pricing) | billing-and-pricing |
| [`SignInScreen.tsx`](./examples/auth-screens) | auth-screens |
| [`DashboardOverview.tsx`](./examples/dashboard-layout) | dashboard-layout |
| [`States.tsx`](./examples/empty-and-loading-states) | empty-and-loading-states |

Plus a set of **modern, archetype-flavored** examples — Analytics bento, CRM pipeline, Kanban board, AI chat thread, API usage meter, and a ⌘K command palette — in [`examples/`](./examples#modern-examples-by-saas-archetype).

---

## Usage

```
npx saas-ui-skills <command> [options]

Commands
  list                       List available skills
  install                    Install skills into an agent

Options
  -t, --target <name>        codex | claude | opencode | cursor | all
      --scope <scope>        global (default) | project
      --skills <a,b,c>       comma-separated subset (default: all)
      --dir <path>           install into a custom directory (overrides target)
  -f, --force                overwrite existing skills
  -h, --help                 show this help
```

**Examples**

```bash
# Just the form + table skills, into the current project
npx saas-ui-skills install --target claude --skills forms-and-validation,data-tables --scope project

# Into a custom agent directory
npx saas-ui-skills install --dir ./my-agent/skills

# Re-install and overwrite
npx saas-ui-skills install --target codex --force
```

### Where skills get installed

| Target | Global | Project |
|---|---|---|
| Codex | `~/.codex/skills` | `.codex/skills` |
| Claude Code | `~/.claude/skills` | `.claude/skills` |
| OpenCode | `~/.config/opencode/skills` | `.opencode/skills` |
| Cursor | — | `.cursor/rules` (flat `.md` rules) |

---

## Design principles

- **Accessible by default.** Every component skill targets WCAG AA — focus, ARIA, keyboard.
- **Concrete over abstract.** Real React + Tailwind + shadcn/ui code, not vague advice.
- **Pitfalls included.** Each skill ends with the mistakes agents actually make.
- **Composable.** Skills hand off to each other (tokens → layout → components → flows → polish).
- **Zero-dependency installer.** Pure Node, nothing to install, nothing to trust.

> Built for the shadcn/ui ecosystem, but the patterns (validation, states, a11y, hierarchy) apply to any React + Tailwind stack.

---

## Contributing

New skills and improvements are very welcome — see **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Every skill is validated in CI:

```bash
node scripts/validate-skills.mjs
```

Open a [skill request](https://github.com/param087/saas-ui-skills/issues/new?template=skill_request.md) if there's a SaaS UI pattern you want your agent to master.

---

## Author

Built by **[Param Bhavsar](https://github.com/param087)** — Google Summer of Code '19 @ TensorFlow, ex-HSBC. If this saves you from shipping janky UI, a ⭐ helps others find it.

Part of a family of agent-skill packs: **[saas-starter-skills](https://github.com/param087/saas-starter-skills)** (full-stack: Next.js + Drizzle + Stripe) · **[agent-ml-skills](https://github.com/param087/agent-ml-skills)** (ML/DS/MLOps).

## License

[MIT](./LICENSE)
