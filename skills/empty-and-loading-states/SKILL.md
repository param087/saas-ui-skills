---
name: empty-and-loading-states
description: Use when handling the non-happy UI states — skeleton loaders, empty states with a clear CTA, error states with retry, and optimistic updates. Covers the states agents forget that make an app feel broken or polished.
---

# Empty & Loading States

## Overview

The difference between a prototype and a product is the **non-happy states**. Every data view has at least four: loading, empty, error, and success. Agents ship the success state and leave the rest blank — which reads as broken. Design all four, every time.

## When to use

- Any component that fetches data.
- A list/table/dashboard that can be empty.
- Mutations that should feel instant (optimistic UI).

## The four states

```tsx
if (isLoading) return <ListSkeleton />;
if (error)     return <ErrorState onRetry={refetch} />;
if (data.length === 0) return <EmptyState />;
return <List items={data} />;
```

## Skeletons that match the layout

Mirror the real content's shape so the page doesn't jump when data arrives:

```tsx
function ListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

Prefer skeletons over spinners for content regions — they reduce perceived wait and layout shift. A spinner is fine for buttons and small inline actions.

## Empty state = an opportunity

A blank screen should orient and prompt action — icon, one-line explanation, and a primary CTA:

```tsx
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
      <h3 className="mt-4 text-sm font-semibold">No invoices yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first invoice and it’ll show up here.
      </p>
      <Button className="mt-4"><Plus className="mr-2 h-4 w-4" /> New invoice</Button>
    </div>
  );
}
```

Distinguish **first-use empty** ("Create your first…") from **no-results empty** ("No matches for 'foo' — clear filters").

## Error state with retry

```tsx
<div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 p-8 text-center">
  <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
  <p className="text-sm">Couldn’t load invoices.</p>
  <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>
</div>
```

## Optimistic updates

Apply the change immediately, roll back on failure so the UI feels instant:

```tsx
async function toggleStar(id: string) {
  setItems((prev) => prev.map((i) => i.id === id ? { ...i, starred: !i.starred } : i)); // optimistic
  try { await api.toggleStar(id); }
  catch { setItems(prev); toast.error("Couldn’t update — reverted"); } // rollback
}
```

## Pitfalls

- **Only the success state** — blank loading/empty/error reads as broken.
- **Full-page spinner** for partial loads — skeleton the region instead.
- **Layout shift** when data replaces the loader — match skeleton dimensions.
- **Generic empty state** — first-use vs no-results need different copy/CTAs.
- **Error with no retry** — dead end; always offer a way forward.
- **Optimistic update with no rollback** — UI lies when the request fails.

## Hand-off

The polish layer for `data-tables`, `dashboard-layout`, and any fetched view; failures surface through `notifications-and-toasts`.
