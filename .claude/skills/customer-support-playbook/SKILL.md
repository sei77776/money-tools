---
name: customer-support-playbook
description: Build customer support operations — response templates, escalation tiers, SLAs, refund policy, and turning tickets into product fixes. Use when the user says "customer support", "how should I respond to this complaint", "カスタマーサポート", "クレーム対応", "support templates", "refund policy", "angry customer", or is handling inbound customer issues. For the contractual side of a serious dispute, see legal-risk-triage.
metadata:
  department: small-business
  version: 1.0.0
---

# Customer Support Playbook

## Step 1 — Define tiers and response targets

| Tier | Definition | First response | Resolution target |
|------|------------|----------------|-------------------|
| P1 | Service down or data at risk for many customers | 1 hour | Continuous until resolved |
| P2 | Blocked customer, no workaround | 4 business hours | 2 business days |
| P3 | Degraded but workable | 1 business day | 5 business days |
| P4 | Question, feature request, cosmetic | 2 business days | Best effort |

Publish targets you can actually meet. A missed published SLA damages trust more
than a modest one met consistently. If current staffing cannot hit these, adjust
the targets rather than the reporting.

## Step 2 — Structure every response the same way

1. **Acknowledge the specific problem** in the customer's own words — this proves you read it.
2. **State what you know** and what you don't, honestly.
3. **Say what happens next**, with a named owner and a time.
4. **Give a workaround** if one exists, even a clumsy one.
5. **Follow up when you said you would**, even if the answer is "still working on it".

Apologize for the impact ("sorry this cost you a day") without conceding
liability where the facts aren't established. If a matter looks like it could
become a legal claim, stop and run `legal-risk-triage` before replying.

Never: blame the customer, hide behind policy without explaining it, promise a
date engineering hasn't agreed, or close a ticket without confirming resolution.

## Step 3 — Write the template library

Cover the recurring cases: acknowledgment, need-more-info, known-issue with ETA,
resolved, workaround, feature request declined, refund approved, refund declined,
outage notice, outage postmortem, price change, and account closure.

Templates are starting points. Each must be edited to reference the specific
customer's situation — a visibly canned reply to a frustrated customer makes
things worse, not better.

## Step 4 — Set the refund policy in advance

Decide before you are under pressure: what qualifies, who can approve at what
amount, the time limit, and whether a partial credit is offered instead. Write
the threshold below which anyone on the team may refund without approval — it
resolves most disputes at a fraction of the cost of escalating them.

## Step 5 — Close the loop into the product

Support volume is product feedback. Monthly: tag tickets by root cause, rank the
top 5 drivers by volume and by handling time, and hand them to the development
department as concrete issues. Track whether volume for each cause falls after a
fix ships — if it doesn't, the fix missed the actual cause.

## Step 6 — Verify

- Are the SLA targets achievable with current staffing? Show the arithmetic (tickets/day × handling time vs available hours).
- Does every escalation path end at a named person, not a role that no one fills?
- Is the refund approval threshold written down?
- Do templates avoid promising anything not actually committed?

## Step 7 — Deliver

Tier definitions with SLAs, the template library, the escalation map with names,
the refund policy, and the monthly ticket-to-product review process.
