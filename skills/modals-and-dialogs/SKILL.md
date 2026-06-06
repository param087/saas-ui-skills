---
name: modals-and-dialogs
description: Use when building modals, sheets, drawers, or confirmation flows — choosing Dialog vs Sheet vs Drawer vs AlertDialog, focus trapping, destructive-action confirms, and forms inside overlays without losing data.
---

# Modals & Dialogs

## Overview

Overlays interrupt — use them sparingly and correctly. shadcn/ui (on Radix) gives you four primitives with built-in focus trap, `Esc` to close, scroll lock, and `aria-modal`. Your job is choosing the right one and handling the edge cases: destructive confirms, forms with unsaved input, and not stacking overlays.

## When to use

- A focused task or confirmation needs to block the page.
- Building a side panel for details/filters/quick-edit.
- A `<div>` overlay is being hand-rolled (you'll miss focus trap + keyboard).

## Pick the right primitive

| Use | Primitive | When |
|---|---|---|
| Centered modal | `Dialog` | Short forms, focused tasks |
| Side panel | `Sheet` | Details, filters, edit alongside context |
| Bottom drawer | `Drawer` (vaul) | Mobile-friendly, touch dismiss |
| Confirm/destruct | `AlertDialog` | Yes/no decisions; **no** dismiss-on-outside-click |

## Destructive confirmation

`AlertDialog` (not `Dialog`) for irreversible actions — it requires an explicit choice and won't close on outside click or Esc accidentally losing the decision:

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete project</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>
        This permanently deletes the project and all its data. This can’t be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={deleteProject}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

For high-risk deletes, require typing the resource name to enable the button.

## Forms inside dialogs

Control `open` so you can keep the dialog open on validation error and close only on success:

```tsx
const [open, setOpen] = React.useState(false);
async function onSubmit(values) {
  await save(values);     // throws → dialog stays open, error shows
  setOpen(false);         // success → close
  toast.success("Saved");
}
<Dialog open={open} onOpenChange={setOpen}>…</Dialog>
```

Warn before discarding unsaved changes: intercept `onOpenChange` and confirm if the form `isDirty`.

## Accessibility (mostly handled, don't break it)

- Always include `DialogTitle` (+ `DialogDescription`) — they back `aria-labelledby`/`describedby`. Visually hide the title with `sr-only` if needed, but keep it.
- Focus moves into the dialog on open and **returns to the trigger** on close — don't disable this.
- Don't stack modals. Replace content or use a multi-step flow instead.

## Pitfalls

- **`Dialog` for destructive actions** — outside-click dismiss can skip the decision; use `AlertDialog`.
- **Closing on submit before the request resolves** — close on success only.
- **No unsaved-changes guard** — users lose form input on accidental dismiss.
- **Missing `DialogTitle`** — breaks the accessible name; Radix will warn.
- **Modal-on-modal stacking** — confusing focus; redesign the flow.
- **Putting huge content in a modal** — use a `Sheet` or a full page instead.

## Hand-off

Overlays that host `forms-and-validation`, confirm `data-tables` row actions, and pair with `notifications-and-toasts` for post-action feedback.
