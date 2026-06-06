---
name: dashboard-layout
description: Use when building a dashboard or overview page — stat/KPI cards, chart placement, responsive grids, and a scannable hierarchy. Covers metric cards with deltas, where charts go, and loading/empty states for data.
---

# Dashboard Layout

## Overview

A dashboard answers "how are things?" at a glance. Lead with a row of **KPI cards**, follow with charts and recent activity, and let the grid reflow responsively. Prioritize scannability: the most important number should be the largest, top-left, where eyes land first.

## When to use

- Building an app's home/overview page.
- Showing KPIs, trends, and recent activity together.
- A dashboard feels cluttered or has no clear hierarchy.

## KPI cards with deltas

A metric is more useful with a trend. Show the value big, the change small and colored, and never rely on color alone — pair it with an arrow/sign:

```tsx
function StatCard({ label, value, delta }: { label: string; value: string; delta: number }) {
  const up = delta >= 0;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("flex items-center gap-1 text-xs", up ? "text-emerald-600" : "text-destructive")}>
          {up ? <ArrowUp className="h-3 w-3" aria-hidden /> : <ArrowDown className="h-3 w-3" aria-hidden />}
          {Math.abs(delta)}% <span className="text-muted-foreground">vs last month</span>
        </p>
      </CardContent>
    </Card>
  );
}
```

## Responsive grid

```tsx
<div className="space-y-6">
  {/* KPI row: 1 → 2 → 4 columns */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard label="MRR" value="$24,580" delta={12.5} />
    <StatCard label="Active users" value="1,429" delta={4.2} />
    <StatCard label="Churn" value="2.1%" delta={-0.4} />
    <StatCard label="Signups" value="312" delta={18.0} />
  </div>

  {/* Main chart + side panel */}
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <Card className="lg:col-span-2"><CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
      <CardContent className="h-72"><RevenueChart /></CardContent>
    </Card>
    <Card><CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
      <CardContent><ActivityFeed /></CardContent>
    </Card>
  </div>
</div>
```

## Charts

- Use a React chart lib (Recharts, or shadcn's `Chart` wrapper) — give the container a fixed height (`h-72`) so it doesn't collapse.
- Pull series colors from theme tokens (`hsl(var(--primary))`) so charts match light/dark.
- Label axes; format numbers/currency; keep it to one idea per chart.
- Provide a loading skeleton sized to the chart and an empty state ("No data for this range").

## Hierarchy & scannability

- Most important metric: largest, top-left.
- Group related cards; use whitespace, not borders, to separate sections.
- Add a time-range selector that drives all widgets.
- Keep it to what's actionable — a dashboard is not a data dump.

## Pitfalls

- **Bare numbers, no trend/context** — a KPI without a delta or comparison.
- **Color-only deltas** — add an arrow/sign for colorblind users.
- **Charts with no fixed height** — they collapse or jump on load.
- **No loading/empty states** — see `empty-and-loading-states`.
- **Everything the same size** — no hierarchy means nothing stands out.
- **Hard-coded chart colors** that break in dark mode — use tokens.

## Hand-off

The overview that sits in `responsive-layout`, reuses `empty-and-loading-states` for data, links to `data-tables` for detail and `billing-and-pricing` for usage/upgrade.
