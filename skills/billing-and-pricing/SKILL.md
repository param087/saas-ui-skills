---
name: billing-and-pricing
description: Use when building pricing tables, plan cards, paywalls, and upgrade prompts. Covers monthly/annual toggles, highlighting the recommended plan, usage limits, feature gating UI, and clear upgrade CTAs.
---

# Billing & Pricing

## Overview

Pricing UI converts — clarity beats cleverness. Show plans side by side, make the recommended one obvious, let users toggle billing period, and put honest upgrade prompts at the moments users hit a limit. The UI is presentation only; entitlements and prices are enforced server-side.

## When to use

- Building a pricing page or plan-selection step.
- Adding paywalls, usage meters, or "upgrade" prompts.
- Gating features behind a plan in the UI.

## Pricing cards with billing toggle

```tsx
const [annual, setAnnual] = React.useState(true);

<div className="mb-8 flex items-center justify-center gap-3">
  <span className={cn("text-sm", !annual && "font-medium")}>Monthly</span>
  <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
  <span className={cn("text-sm", annual && "font-medium")}>
    Annual <Badge variant="success" className="ml-1">Save 20%</Badge>
  </span>
</div>

<div className="grid gap-6 md:grid-cols-3">
  {plans.map((plan) => (
    <Card key={plan.id} className={cn("relative flex flex-col", plan.recommended && "border-primary shadow-md")}>
      {plan.recommended && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.tagline}</CardDescription>
        <div className="mt-2">
          <span className="text-4xl font-bold tabular-nums">
            ${annual ? plan.annual : plan.monthly}
          </span>
          <span className="text-muted-foreground">/mo</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2 text-sm">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-emerald-500" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={plan.recommended ? "default" : "outline"}>
          {plan.cta ?? "Choose plan"}
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

## Highlight one plan

Anchor choice with a single "Most popular" plan — stronger border, a badge, and a filled CTA while others use `outline`. One emphasized option reduces decision paralysis.

## Usage meters & soft limits

Warn before users hit a wall, not after:

```tsx
<div className="space-y-1">
  <div className="flex justify-between text-sm">
    <span>Seats</span><span className="tabular-nums">{used} / {limit}</span>
  </div>
  <Progress value={(used / limit) * 100} />
  {used / limit > 0.8 && (
    <p className="text-xs text-amber-600">You're approaching your seat limit. <a className="underline" href="/billing">Upgrade</a></p>
  )}
</div>
```

## Paywalls & upgrade prompts

- Gate the *action*, not the whole UI — show the feature, then an upgrade CTA on use.
- Contextual prompt: name the benefit ("Upgrade to Pro for unlimited projects"), not just "Upgrade."
- Current plan shows "Current plan" disabled; others show upgrade/downgrade.

## Pitfalls

- **No annual/monthly toggle** — or not showing the savings.
- **Every plan visually equal** — highlight one to guide choice.
- **Hard paywall with no preview** — show what they're missing.
- **Limits only enforced client-side** — the server owns entitlements; UI just reflects them.
- **Vague CTAs** ("Submit") instead of "Start free trial" / "Upgrade to Pro."
- **Prices not `tabular-nums`** — misaligned digits look sloppy.

## Hand-off

Conversion surfaces that link from `dashboard-layout` usage meters and `settings-pages` billing; gate flows pair with `modals-and-dialogs` and `notifications-and-toasts`.
