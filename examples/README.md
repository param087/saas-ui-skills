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

Want to see another skill as a runnable example? [Open a request.](https://github.com/param087/saas-ui-skills/issues/new?template=skill_request.md)
