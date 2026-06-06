---
name: data-tables
description: Use when building data tables — sorting, filtering, pagination, row selection and bulk actions with TanStack Table + shadcn/ui, plus the loading, empty, and error states tables almost always forget.
---

# Data Tables

## Overview

Tables are where SaaS apps live (users, invoices, logs). Build them with **TanStack Table** (headless logic: sorting, filtering, pagination, selection) rendered through **shadcn/ui `Table`** primitives. Separate column *definitions* from the table *shell* so every table in the app behaves consistently.

## When to use

- Displaying lists of records with sort/filter/paginate.
- Bulk actions on selected rows.
- A `<table>` is being hand-built with manual sort state.

## Column definitions

```tsx
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type Invoice = { id: string; customer: string; status: "paid" | "open" | "void"; amount: number };

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant={row.original.status === "paid" ? "success" : "secondary"}>{row.original.status}</Badge>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <div className="text-right tabular-nums">${(row.original.amount / 100).toFixed(2)}</div>,
  },
];
```

## The reusable shell

```tsx
const table = useReactTable({
  data, columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: { sorting, rowSelection, globalFilter },
  onSortingChange: setSorting,
  onRowSelectionChange: setRowSelection,
});
```

Render header/body from `table.getHeaderGroups()` / `table.getRowModel().rows`. **Always handle the three non-happy states:**

```tsx
{isLoading ? (
  <TableRow><TableCell colSpan={columns.length}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
) : rows.length === 0 ? (
  <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">No results.</TableCell></TableRow>
) : (
  rows.map((row) => <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>…</TableRow>
)}
```

## Bulk actions

When `table.getSelectedRowModel().rows.length > 0`, show an action bar:

```tsx
{selectedCount > 0 && (
  <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
    <span>{selectedCount} selected</span>
    <Button size="sm" variant="destructive" onClick={deleteSelected}>Delete</Button>
  </div>
)}
```

## Server-side at scale

For large datasets, set `manualPagination`/`manualSorting`/`manualFiltering: true` and pass state to your API. Keep filter/sort/page in the URL (`searchParams`) so views are shareable and survive refresh.

## Pitfalls

- **No loading/empty/error states** — the #1 omission; a blank table looks broken.
- **Right-align numbers + `tabular-nums`** — left-aligned currency is hard to scan.
- **Client-paginating 50k rows** — move to server-side; don't ship it all.
- **Selection lost on page change** unless you key it by row id.
- **Non-accessible sort headers** — make them `<button>`s with `aria-sort`.
- **Filter/sort only in component state** — put it in the URL for shareable views.

## Hand-off

A consistent table that pairs with `empty-and-loading-states` (skeletons), `modals-and-dialogs` (row edit/confirm), and `notifications-and-toasts` (bulk-action feedback).
