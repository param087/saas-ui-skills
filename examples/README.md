# Examples

Real components that demonstrate the skills in action — the kind of output an agent
produces **when it follows a skill** from this pack. Each one is typed, accessible, and
handles the states the corresponding skill emphasizes (loading, empty, error, submitting).

> These files illustrate patterns; they import shadcn/ui components from the usual
> `@/components/ui/*` paths and aren't wired to build in this repo. Drop them into a
> Next.js + Tailwind + shadcn/ui app to run them.

| Example | Skill | Shows |
|---|---|---|
| [`forms-and-validation/SignInForm.tsx`](./forms-and-validation/SignInForm.tsx) | **forms-and-validation** | react-hook-form + zod, accessible fields, async submit, server errors |
| [`data-tables/InvoicesTable.tsx`](./data-tables/InvoicesTable.tsx) | **data-tables** | TanStack Table, sorting, row selection, bulk actions, loading/empty states |
| [`billing-and-pricing/PricingTable.tsx`](./billing-and-pricing/PricingTable.tsx) | **billing-and-pricing** | monthly/annual toggle, highlighted plan, feature lists |
| [`auth-screens/SignInScreen.tsx`](./auth-screens/SignInScreen.tsx) | **auth-screens** | shared auth shell, OAuth + divider, no user enumeration |
| [`dashboard-layout/DashboardOverview.tsx`](./dashboard-layout/DashboardOverview.tsx) | **dashboard-layout** | KPI cards with deltas, responsive grid, chart + activity panel |
| [`empty-and-loading-states/States.tsx`](./empty-and-loading-states/States.tsx) | **empty-and-loading-states** | skeleton, empty, and error states for one data view |

## Modern examples, by SaaS archetype

The same skills applied to different product types — a more contemporary look (bento
grids, gradient surfaces, status pills, ⌘K), to show the range these patterns cover.

| Example | Archetype | Skill | Shows |
|---|---|---|---|
| [`dashboard-layout/AnalyticsBento.tsx`](./dashboard-layout/AnalyticsBento.tsx) | Analytics | **dashboard-layout** | responsive bento grid, gradient hero metric, KPI deltas, channel bars |
| [`data-tables/CrmPipeline.tsx`](./data-tables/CrmPipeline.tsx) | CRM | **data-tables** | deal table with stage badges, avatars, weighted pipeline total, sticky header |
| [`component-architecture/KanbanBoard.tsx`](./component-architecture/KanbanBoard.tsx) | Project mgmt | **component-architecture** | compound `Board`/`Column`/`Card` API, status columns, label pills |
| [`empty-and-loading-states/AiChatThread.tsx`](./empty-and-loading-states/AiChatThread.tsx) | AI app | **empty-and-loading-states** | empty prompt-starters, animated "typing" with `aria-live`, message bubbles |
| [`billing-and-pricing/UsageMeter.tsx`](./billing-and-pricing/UsageMeter.tsx) | Dev tool / API | **billing-and-pricing** | metered usage bars (amber→red near cap), overage callout, upgrade CTA |
| [`navigation-patterns/CommandPalette.tsx`](./navigation-patterns/CommandPalette.tsx) | Any SaaS | **navigation-patterns** | ⌘K cmdk palette, grouped results, shortcut hints, accessible empty state |

Want to see another skill as a runnable example? [Open a request.](https://github.com/param087/saas-ui-skills/issues/new?template=skill_request.md)
