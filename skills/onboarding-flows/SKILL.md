---
name: onboarding-flows
description: Use when building onboarding — multi-step wizards, setup checklists, progressive disclosure, and first-run empty states. Covers step state, progress indication, skip/resume, and getting users to first value fast.
---

# Onboarding Flows

## Overview

Onboarding's only job is **time to first value** — get the user to the "aha" moment with the least friction. Two workhorse patterns: a **stepper wizard** for required setup, and a **checklist** for optional-but-guided tasks. Always allow skip/resume; never trap users behind a wall of forms.

## When to use

- First-run setup after signup (workspace, profile, invite team).
- A guided checklist on an otherwise empty dashboard.
- Any multi-step task that benefits from chunking.

## Stepper wizard

Keep step state explicit and show progress so users know how much is left:

```tsx
const steps = ["Workspace", "Invite team", "Connect data"] as const;
const [step, setStep] = React.useState(0);
const progress = ((step + 1) / steps.length) * 100;

<div className="mx-auto max-w-lg">
  <div className="mb-6">
    <div className="mb-2 flex justify-between text-sm text-muted-foreground">
      <span>Step {step + 1} of {steps.length}</span>
      <span>{steps[step]}</span>
    </div>
    <Progress value={progress} />
  </div>

  {step === 0 && <WorkspaceStep onNext={() => setStep(1)} />}
  {step === 1 && <InviteStep onNext={() => setStep(2)} onBack={() => setStep(0)} />}
  {step === 2 && <ConnectStep onFinish={complete} onBack={() => setStep(1)} />}

  <div className="mt-6 flex justify-between">
    <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
    <Button variant="link" onClick={skipOnboarding}>Skip for now</Button>
  </div>
</div>
```

Persist progress server-side (or in the URL) so a refresh or return visit resumes where they left off.

## Setup checklist (progressive)

Great on an empty dashboard — shows value and a clear path, dismissible once done:

```tsx
<Card>
  <CardHeader><CardTitle>Get started</CardTitle>
    <CardDescription>{done}/{total} complete</CardDescription>
    <Progress value={(done / total) * 100} className="mt-2" />
  </CardHeader>
  <CardContent className="space-y-2">
    {tasks.map((t) => (
      <a key={t.id} href={t.href} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50">
        <CheckCircle className={cn("h-5 w-5", t.done ? "text-emerald-500" : "text-muted-foreground/40")} aria-hidden />
        <span className={cn("text-sm", t.done && "text-muted-foreground line-through")}>{t.label}</span>
        {!t.done && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />}
      </a>
    ))}
  </CardContent>
</Card>
```

## Principles

- **Progressive disclosure.** Ask for the minimum now; defer the rest to settings.
- **Show progress.** A `Progress` bar or "Step x of n" reduces drop-off.
- **Always skippable.** Forced onboarding inflates churn; let users explore.
- **Prefill smart defaults.** Don't ask what you can infer (timezone, name from email).
- **Celebrate completion.** A success state + a clear next action.

## Pitfalls

- **Too many required steps** before any value — cut to the essentials.
- **No skip/resume** — refresh loses progress and frustrates.
- **Progress not persisted** — returning users restart from zero.
- **A 12-field form labeled "Quick setup."**
- **Dead end at the end** — always point to the next meaningful action.

## Hand-off

First-run guidance built from `forms-and-validation` steps and `empty-and-loading-states`; completion lands users in `dashboard-layout`.
