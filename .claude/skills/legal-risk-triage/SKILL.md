---
name: legal-risk-triage
description: Triage an incoming legal issue — a demand letter, customer complaint, IP notice, data incident, or regulator contact — into severity, immediate actions, and whether a lawyer is needed now. Use when the user says "we got a legal letter", "someone is threatening to sue", "cease and desist", "DMCA notice", "data breach", "法的なリスク", "訴えられそう", "警告書が届いた", or describes a situation that might become a legal problem.
metadata:
  department: legal
  version: 1.0.0
---

# Legal Risk Triage

The first hour matters. This skill decides what to do now, what not to do, and
whether this needs a lawyer today.

> **Not legal advice.** For anything rated Critical or High below, engaging a
> qualified lawyer is the recommended immediate action, not an optional step.

## Step 0 — Before anything else

Say these first, every time, because they are the errors that make a bad
situation worse:

1. **Do not respond substantively yet.** Acknowledging receipt is fine; admitting facts, apologizing in a way that concedes liability, or arguing the merits is not.
2. **Preserve everything.** Suspend any automatic deletion of relevant email, logs, messages, and documents immediately. Spoliation converts a defensible matter into an indefensible one.
3. **Do not delete or edit anything**, including the content complained of, until the preservation and takedown question has been decided deliberately.
4. **Narrow the audience.** Internal speculation in writing becomes discoverable.
5. **Note the deadline.** Many notices carry a response window; find and record it.

## Step 1 — Classify the matter

| Type | Typical first move |
|------|--------------------|
| Demand letter / cease & desist | Do not reply on the merits; assess the claim, engage counsel |
| IP infringement notice (DMCA, trademark) | Assess validity; a counter-notice has legal consequences — do not file reflexively |
| Customer dispute / refund escalation | Usually commercial, not legal — check contract terms first |
| Data incident | Clock may be running (72h under GDPR); parallel-track containment and notification assessment |
| Regulator inquiry | Always counsel. Never answer informally |
| Employment complaint | Counsel, and do not retaliate or change the person's status |
| Contract breach (either direction) | Read the contract's notice and cure provisions before acting |

## Step 2 — Rate severity

- **Critical** — regulator, data breach with personal data, injunction sought, criminal exposure, or existential financial claim. Counsel today.
- **High** — credible claim with material money, IP that blocks the product, employment claim. Counsel this week.
- **Medium** — contractual dispute within normal commercial range, resolvable through the contract's own mechanism.
- **Low** — complaint without legal foundation or demand.

Rate on: credibility of the claim, financial exposure, operational impact,
reputational impact, and deadline pressure. State the reasoning; a bare rating
cannot be challenged or corrected.

## Step 3 — Assemble the facts

Timeline of what happened, with dates and sources. The relevant contract, policy,
or terms. Who internally knows what. What evidence exists and where it lives.
What the other side is actually asking for (money? behavior change? both?).

Separate **facts** from **assumptions** explicitly, and mark each. A triage memo
that blends them misleads whoever reads it next.

## Step 4 — Recommend

- Immediate actions (next 24h), with an owner for each.
- Do-not-do list.
- Whether to engage counsel, and what to hand them.
- Options with rough trade-offs: comply / negotiate / dispute / ignore — including the realistic cost and risk of each.

## Step 5 — Verify

- Is the response deadline identified and stated prominently?
- Is preservation actually in place, or only recommended? Say which.
- Is every factual claim sourced?
- Have you avoided giving a merits opinion dressed up as analysis?

## Step 6 — Deliver

A one-page triage memo: what happened, severity with reasoning, deadline,
immediate actions, do-not-do list, counsel recommendation, and open questions.
