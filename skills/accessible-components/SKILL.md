---
name: accessible-components
description: Use when building or reviewing interactive UI that must meet WCAG 2.2 AA — focus management, ARIA roles and states, keyboard navigation, labels, and visible focus. Covers the accessibility mistakes agents make most.
---

# Accessible Components

## Overview

Accessibility is not a feature you add later — it's how you build interactive elements from the start. The single best move in a SaaS app is to **use real semantic elements and Radix/shadcn primitives**, which ship correct ARIA and keyboard behavior. Most a11y bugs come from re-inventing a button or dropdown with a `<div>`.

## When to use

- Building any interactive control (menus, dialogs, tabs, toggles).
- Reviewing UI for keyboard and screen-reader support.
- A `<div onClick>` is standing in for a button.

## Rule 1: Use the right element

```tsx
// ✗ Inaccessible: no focus, no Enter/Space, no role
<div onClick={save} className="btn">Save</div>

// ✓ Accessible for free
<button type="button" onClick={save} className="btn">Save</button>
```

A native `<button>` is focusable, fires on Enter/Space, and announces as a button. Same for `<a>` (navigation), `<label>` (form association), `<nav>/<main>/<header>` (landmarks).

## Rule 2: Every input has a label

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// Icon-only buttons need an accessible name:
<Button size="icon" aria-label="Close">
  <X className="h-4 w-4" aria-hidden />
</Button>
```

Decorative icons get `aria-hidden`; the control gets `aria-label`.

## Rule 3: Visible focus, always

Never `outline-none` without a replacement. Use a focus ring on every interactive element:

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

`:focus-visible` shows the ring for keyboard users without flashing it on mouse clicks.

## Rule 4: Keyboard support

- All actions reachable via Tab; logical order (don't fight the DOM with `tabindex` > 0).
- `Esc` closes overlays; `Enter/Space` activate; arrow keys move within menus/tabs/radios.
- Radix/shadcn primitives (`DropdownMenu`, `Dialog`, `Tabs`, `Select`) implement these — prefer them over hand-rolled widgets.

## Rule 5: Announce dynamic changes

Screen readers miss silent DOM updates. Use live regions for async status:

```tsx
<p role="status" aria-live="polite">{saving ? "Saving…" : "All changes saved"}</p>
```

Toasts should render in an `aria-live` region (sonner/shadcn handle this — see notifications-and-toasts).

## Quick checklist

- [ ] Color contrast ≥ 4.5:1 for text (3:1 for large/UI).
- [ ] Every control reachable and operable by keyboard.
- [ ] Visible focus indicator on each control.
- [ ] Inputs have associated labels; icon buttons have `aria-label`.
- [ ] State conveyed beyond color alone (icon/text too).
- [ ] Images have `alt`; decorative ones `alt=""`/`aria-hidden`.

## Pitfalls

- **`<div onClick>`** instead of `<button>` — no keyboard, no role.
- **`outline-none`** with no focus replacement — keyboard users get lost.
- **Placeholder as label** — disappears on input, fails screen readers.
- **Color-only state** (red border, no message) fails colorblind users.
- **Hand-rolled dropdowns/modals** missing focus trap and arrow keys — use primitives.

## Hand-off

The accessibility baseline every other skill assumes — `forms-and-validation`, `modals-and-dialogs`, and `navigation-patterns` all build on these rules.
