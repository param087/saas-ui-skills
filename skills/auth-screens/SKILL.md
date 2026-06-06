---
name: auth-screens
description: Use when building authentication UI — login, signup, forgot/reset password, email verification, and OAuth buttons. Covers layout, validation, security-conscious UX (no user enumeration), and loading/error states.
---

# Auth Screens

## Overview

Auth is the first thing users touch, so it must feel solid and secure. Build the screens on `forms-and-validation` (react-hook-form + zod), keep a shared layout across login/signup/reset, and follow security-UX conventions — the most important being **don't leak whether an account exists**.

## When to use

- Building login, signup, forgot-password, or reset screens.
- Adding OAuth/social sign-in buttons.
- Email verification or magic-link flows.

## Shared auth layout

```tsx
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Logo className="mx-auto h-8 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">{children}</div>
        {footer && <p className="mt-4 text-center text-sm text-muted-foreground">{footer}</p>}
      </div>
    </div>
  );
}
```

## OAuth + divider

```tsx
<div className="grid gap-2">
  <Button variant="outline" onClick={() => signIn("google")}>
    <GoogleIcon className="mr-2 h-4 w-4" /> Continue with Google
  </Button>
</div>
<div className="relative my-4">
  <Separator />
  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
    OR
  </span>
</div>
```

## Security-conscious UX

- **No user enumeration.** Forgot-password and signup should respond the same whether or not the email exists: *"If an account exists for that email, we've sent a reset link."* Never "No user with that email."
- **Generic login error.** "Invalid email or password" — don't reveal which was wrong.
- **Correct autocomplete:** `email`, `current-password` (login), `new-password` (signup/reset). Helps password managers and reduces errors.
- **Password rules shown up front**, validated with zod; consider a strength meter, but length ≥ 8 (ideally ≥ 12) matters most.
- **Rate-limit + loading state** so the submit can't be spammed; disable while pending.

```tsx
const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
```

## States to cover

- Submitting (spinner + disabled button).
- Field errors (inline) and form errors (top `Alert`).
- Success that redirects, or a "check your email" confirmation panel for magic-link/verify/reset.
- Expired/invalid token screen for reset links.

## Pitfalls

- **Leaking account existence** in reset/signup/login messages.
- **Wrong `autocomplete`** — breaks password managers; `new-password` vs `current-password` matters.
- **No loading state** → double submits, double accounts.
- **Password as the only factor with no min length** — enforce ≥ 8 in zod.
- **Storing tokens in `localStorage`** — prefer httpOnly cookies (the UI shouldn't hold the session token).
- **No "check your email" confirmation** — users resubmit thinking it failed.

## Hand-off

Entry screens built on `forms-and-validation` and `design-tokens-theming`; after sign-in, users land in the `responsive-layout` shell and `onboarding-flows`.
