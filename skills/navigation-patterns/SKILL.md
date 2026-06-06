---
name: navigation-patterns
description: Use when building app navigation — sidebar nav with active states, a command palette (cmdk), tabs, and breadcrumbs. Covers accessible markup, active-route detection, and keyboard-first navigation.
---

# Navigation Patterns

## Overview

Navigation is how users build a mental map of your SaaS app. The core set: a **sidebar** for primary sections, **tabs** for views within a page, **breadcrumbs** for depth, and a **command palette** for power users. Mark up each with semantic landmarks and correct active state so both mouse and keyboard users stay oriented.

## When to use

- Building the primary sidebar or in-page tabs.
- Adding ⌘K quick navigation/search.
- Users get lost or can't tell where they are.

## Sidebar with active state

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1 p-3">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
```

`aria-current="page"` tells screen readers which item is active — color alone isn't enough. Match the active route with `startsWith` so nested pages keep their parent highlighted.

## Command palette (⌘K)

```tsx
import { CommandDialog, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/invoices")}>Invoices</CommandItem>
          <CommandItem onSelect={() => go("/settings")}>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

cmdk (under shadcn `Command`) gives fuzzy search, arrow-key nav, and focus management for free.

## Tabs & breadcrumbs

- **Tabs** for switching views of the *same* resource (Overview / Activity / Settings). Use shadcn `Tabs`; sync the active tab to `?tab=` for deep links.
- **Breadcrumbs** for hierarchy (`Workspace › Project › Settings`); wrap in `<nav aria-label="Breadcrumb">` and mark the last crumb `aria-current="page"`.

## Pitfalls

- **Active state by color only** — add `aria-current` and ideally weight/indicator.
- **Exact-match active route** breaks on nested pages — use `startsWith`.
- **Command palette without focus trap/Esc** — use the `Command` dialog primitive.
- **Tabs that lose state on refresh** — persist to the URL.
- **No `aria-label` on multiple `<nav>`s** — screen readers can't distinguish them.

## Hand-off

Wayfinding that sits inside the `responsive-layout` shell; deep flows route into `settings-pages`, `billing-and-pricing`, and `dashboard-layout`.
