---
name: notifications-and-toasts
description: Use when giving users feedback — toasts (sonner), inline alerts, and a notification center. Covers when to use which, accessible announcements, promise/loading toasts, and not overusing notifications.
---

# Notifications & Toasts

## Overview

Feedback tells users their action worked (or didn't). Pick the right channel for the message's importance and persistence: **toasts** for transient confirmations, **inline alerts** for contextual or blocking info, and a **notification center** for a history of async events. Overusing toasts trains users to ignore them.

## When to use

- Confirming an action (saved, deleted, copied).
- Surfacing a recoverable error or important context.
- Async/background events users should be able to review later.

## Pick the channel

| Channel | For | Persistence |
|---|---|---|
| **Toast** (sonner) | Transient success/error of a user action | Auto-dismiss (~4s) |
| **Inline `Alert`** | Contextual, blocking, or persistent info | Stays until resolved |
| **Notification center** | Async events, history | Until read/cleared |

## Toasts with sonner

```tsx
// app root
import { Toaster } from "@/components/ui/sonner";
<Toaster richColors closeButton />

// anywhere
import { toast } from "sonner";
toast.success("Invoice sent");
toast.error("Couldn’t send invoice", { description: "Check the email and try again." });
```

**Promise toast** for async work — one call covers loading → success/error:

```tsx
toast.promise(saveSettings(values), {
  loading: "Saving…",
  success: "Settings saved",
  error: (e) => e.message ?? "Save failed",
});
```

Add an **undo action** instead of a confirm dialog for reversible actions:

```tsx
toast("Invoice deleted", { action: { label: "Undo", onClick: () => restore(id) } });
```

## Inline alerts for context

When the message belongs to a place on the page (a failed section, a plan limit), use an `Alert`, not a toast — it stays visible and doesn't disappear before it's read:

```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>Update your card to keep your subscription active.</AlertDescription>
</Alert>
```

## Accessibility

- Toasts must live in an `aria-live` region so screen readers announce them — sonner/shadcn do this; don't roll your own silent toast.
- Use `assertive` for errors, `polite` for success.
- Never convey status by **color only** — include an icon and text.

## Don't over-notify

- Don't toast on every keystroke or trivial state change.
- One toast per action; collapse bulk results ("3 invoices sent").
- Critical/irreversible decisions need a dialog (`modals-and-dialogs`), not a toast.
- Errors the user must fix belong **inline** next to the cause, not in a toast that vanishes.

## Pitfalls

- **Toast for everything** — noise users learn to ignore.
- **Errors-only-as-toasts** that auto-dismiss before being read — use inline `Alert`.
- **Non-accessible custom toasts** with no live region.
- **Color-only status** (green/red with no icon/text).
- **No undo** for reversible destructive actions — friendlier than a confirm modal.
- **Stacking dozens of toasts** — throttle/dedupe.

## Hand-off

The feedback layer for `forms-and-validation`, `data-tables` bulk actions, and `settings-pages`; escalate critical decisions to `modals-and-dialogs`.
