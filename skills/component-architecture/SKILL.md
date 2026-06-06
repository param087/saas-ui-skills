---
name: component-architecture
description: Use when structuring React components in a SaaS app — composing shadcn/ui, cva variants, compound components, controlled vs uncontrolled state, and knowing when to abstract versus inline.
---

# Component Architecture

## Overview

shadcn/ui gives you **owned** components (copied into your repo, not imported from a package). That means architecture is your job: build a thin layer of app-specific components on top of the primitives, use `cva` for variants, and resist abstracting until a pattern repeats. Good structure keeps a SaaS UI consistent without a maze of props.

## When to use

- Deciding how to structure or compose UI components.
- A component has grown a dozen boolean props.
- You're copy-pasting the same markup across pages.

## Variants with `cva`, not boolean soup

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-emerald-500/15 text-emerald-600",
        destructive: "border-transparent bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}
```

One `variant` prop scales better than `isSuccess`, `isError`, `isMuted` booleans that can contradict each other.

## Compound components for related parts

Expose structure, not a config object, when parts vary:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Usage</CardTitle>
    <CardDescription>This billing period</CardDescription>
  </CardHeader>
  <CardContent>{children}</CardContent>
  <CardFooter><Button>Upgrade</Button></CardFooter>
</Card>
```

This beats `<Card title="…" description="…" footer={<Button/>} />` — consumers compose freely.

## `asChild` to compose without wrapper soup

Radix's `asChild` merges props onto your element instead of rendering an extra node — great for making a link look like a button:

```tsx
<Button asChild>
  <Link href="/billing">Manage plan</Link>
</Button>
```

## Controlled vs uncontrolled

- **Uncontrolled** (component owns state) by default — simpler, less re-render.
- **Controlled** only when the parent needs the value (e.g. a filter that syncs to the URL). Support both like Radix: optional `value` + `onValueChange`, with internal fallback state.

## When to abstract

Follow the **rule of three**: inline the markup the first two times; extract a component on the third repetition, when the shared shape is clear. Premature abstractions calcify the wrong API.

## File structure

```
components/
  ui/         # shadcn primitives (owned)
  <feature>/  # app components grouped by feature
lib/utils.ts  # cn() + helpers
```

## Pitfalls

- **Boolean prop explosion** instead of a `variant` enum.
- **Mega-components** taking a `config` object — prefer composition/children.
- **Abstracting too early** — one usage is not a pattern.
- **Editing shadcn primitives in place** for app logic — wrap them instead, keep `ui/` upgradeable.
- **`cn()` not used** — conditional class strings collide instead of merging.

## Hand-off

A clean component layer that `forms-and-validation`, `data-tables`, and the SaaS-flow skills build their screens from.
