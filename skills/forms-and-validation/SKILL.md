---
name: forms-and-validation
description: Use when building forms with react-hook-form + zod and shadcn/ui Form — schema validation, inline errors, accessible fields, async submit with loading and server errors, and avoiding uncontrolled-input bugs.
---

# Forms & Validation

## Overview

The reliable SaaS form stack is **react-hook-form** (state + performance) + **zod** (schema validation) + **shadcn/ui `Form`** (accessible field wiring). Define the schema once, infer the TypeScript type from it, and let the form derive validation, errors, and types from a single source of truth.

## When to use

- Any form: auth, settings, create/edit dialogs, checkout.
- Inputs need validation, inline errors, or async submission.
- You're manually wiring `useState` per field (stop — use RHF).

## The pattern

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type Values = z.infer<typeof schema>;

export function SignInForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    const res = await signIn(values);
    if (!res.ok) {
      form.setError("password", { message: "Invalid email or password" });
      return;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" autoComplete="email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" autoComplete="current-password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
```

`shadcn/ui Form` auto-wires `id`, `aria-invalid`, `aria-describedby`, and `<FormMessage>` to each field — accessible errors with no manual plumbing.

## Why this stack

- **One schema → types + validation.** `z.infer` keeps TS and runtime in sync.
- **Reuse on the server.** Run the same zod schema in your API/action; never trust the client.
- **Performance.** RHF uses uncontrolled inputs + refs, so typing doesn't re-render the whole form.

## Submission UX

- Disable submit + show a spinner label while `isSubmitting`.
- Map server/field errors with `form.setError(name, …)`; show form-level errors in an `Alert`.
- On success: toast, then redirect or reset (`form.reset()`).

## Pitfalls

- **`useState` per field** — re-renders, more code, manual error wiring.
- **Always provide `defaultValues`** — omitting them makes inputs uncontrolled and React warns/loses data.
- **Validating only on the client** — re-run the zod schema server-side.
- **No submitting state** — users double-submit; disable the button.
- **Missing `autoComplete`/`type`** — hurts autofill and mobile keyboards.
- **`type="submit"` missing** — Enter won't submit the form.

## Hand-off

A validated, accessible form that `auth-screens`, `settings-pages`, and `onboarding-flows` reuse; pair errors with `notifications-and-toasts` for success feedback.
