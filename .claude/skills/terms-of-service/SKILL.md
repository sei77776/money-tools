---
name: terms-of-service
description: Draft or review terms of service / terms of use / EULA for a website, SaaS product, or app. Use when the user says "terms of service", "ToS", "terms and conditions", "EULA", "利用規約", "規約を作って", or is preparing to launch something users sign up for. For the data-handling document, see privacy-policy. For negotiated B2B agreements, see contract-review.
metadata:
  department: legal
  version: 1.0.0
---

# Terms of Service

> **Not legal advice.** Consumer-protection law varies sharply by jurisdiction
> and can void clauses that look fine on paper. A qualified lawyer must review
> before publication. Include this in the deliverable.

## Step 1 — Characterize the service

The right document depends entirely on these answers — get them first:

- **B2C or B2B?** Consumer terms face unfair-terms regimes that void aggressive clauses; B2B terms have more freedom.
- **Paid or free?** Subscription, one-off, usage-based, freemium.
- **User-generated content?** If yes, you need content licensing, moderation, and takedown sections.
- **Jurisdictions served** — and specifically whether EU/UK/Japan consumers are in scope.
- **Downloadable software?** Then a license grant (EULA) belongs in it.
- **Anything regulated** — payments, health, finance, minors.

## Step 2 — Draft the sections

**Formation & eligibility** — acceptance mechanism, minimum age, authority to bind an entity.

**The service** — what is provided, right to modify or discontinue, availability commitments (or explicit lack of an SLA).

**Accounts** — registration accuracy, credential security, one account per user, suspension and termination grounds.

**Acceptable use** — prohibited conduct, enforcement rights. Be specific enough to enforce.

**User content** (if applicable) — user retains ownership; grants a license limited to operating and improving the service; representations that they have the rights; notice-and-takedown process.

**Payment** — prices, currency, taxes, billing cycle, auto-renewal, **cancellation and refund policy**. Auto-renewal disclosure is separately regulated in several jurisdictions; make it conspicuous.

**IP** — the provider's ownership of the service, trademarks, feedback licensing.

**Term & termination** — how either side ends it, effect on data, export window.

**Disclaimers & limitation of liability** — "as is", cap on damages, exclusion of consequential damages. Note in the deliverable that consumer statutes may override these regardless of drafting.

**Indemnity** by the user for their misuse and their content.

**Dispute resolution** — governing law, venue, arbitration and class-waiver if desired. Flag that arbitration/class waivers are unenforceable or restricted in some jurisdictions.

**Changes to terms** — how notice is given. Silent unilateral amendment is widely challenged; specify notice and an effective date.

**Miscellaneous** — severability, entire agreement, assignment, force majeure, contact details.

## Step 3 — Flag the enforceability risks

Call out explicitly, rather than quietly drafting around:
- Browsewrap acceptance (terms merely linked in a footer) is weakly enforceable. Recommend clickwrap with a logged timestamp.
- Blanket liability exclusions against consumers.
- Class-action waivers and mandatory arbitration in consumer contexts.
- Unilateral amendment without notice.
- Perpetual, irrevocable, sublicensable licenses over user content — legal, but a reputational problem; make sure it is intended.

## Step 4 — Verify

- Do the terms match the product? Check the actual signup flow, pricing page, and refund behavior. Terms that contradict the product are worse than none.
- Is the acceptance mechanism actually implemented (checkbox, recorded consent)?
- Is the privacy policy referenced and consistent with it?
- Any unfilled placeholders? List them all.

## Step 5 — Deliver

Draft, a summary of the choices made, an implementation checklist (clickwrap,
consent logging, cancellation UI, auto-renewal notice), the enforceability risk
list, and the disclaimer.
