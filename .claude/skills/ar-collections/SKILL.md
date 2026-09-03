---
name: ar-collections
description: Build an accounts-receivable aging report and a collections plan with escalating outreach for unpaid invoices. Use when the user says "unpaid invoices", "AR aging", "customers haven't paid", "collections", "chase payment", "売掛金", "未入金", "請求書が支払われない", "入金催促". For issuing the invoices in the first place, see invoicing-and-quotes. For the cash impact, see cash-runway-forecast.
metadata:
  department: finance
  version: 1.0.0
---

# AR & Collections

Turn a list of unpaid invoices into an aging report and a sequenced, escalating
collections plan that preserves the customer relationship where possible.

## Step 1 — Build the aging

Bucket every open invoice by days past **due date** (not issue date — a common
error that overstates delinquency for net-30/net-60 terms):

`Current | 1–30 | 31–60 | 61–90 | 90+`

For each bucket report: invoice count, total amount, and % of total AR.
Then compute:

```
DSO = (average AR / revenue in period) × days in period
```

Flag **concentration**: if one customer is more than ~20% of open AR, that is a
cash risk independent of aging, and it should lead the summary.

## Step 2 — Classify each overdue invoice

- **Administrative** — wrong PO, wrong address, invoice never received, awaiting approval. Usually resolves in one email.
- **Disputed** — customer contests scope, quality, or amount. Route to whoever owns the relationship; do not escalate a dispute through a dunning sequence.
- **Cash-constrained** — customer wants to pay and cannot. Offer a payment plan.
- **Non-responsive** — no reply across multiple channels. This is the escalation track.

Never apply the same sequence to all four. Misapplied escalation is how a solvent
customer becomes a former customer.

## Step 3 — Sequence outreach

| Timing | Action | Tone |
|--------|--------|------|
| Due − 5d | Friendly reminder with invoice attached | Helpful |
| Due + 1d | "Did this land?" — assume administrative | Neutral |
| Due + 14d | Phone call to the AP contact, follow up in writing | Direct |
| Due + 30d | Escalate to the customer's manager/owner; state late fee if contracted | Firm |
| Due + 60d | Formal demand letter; pause further service if contract permits | Formal |
| Due + 90d | Hand to collections or legal | — |

Before any service pause or late fee, check the contract actually permits it —
route to `contract-review` if unsure. Do not threaten remedies the contract
does not grant.

Draft the actual message for whichever step is due. Keep it short: reference the
invoice number, amount, due date, and one clear payment link or instruction.

## Step 4 — Verify

- Does the aging total equal the AR balance on the balance sheet? Show both; explain any gap.
- Are any "overdue" invoices actually paid but unapplied? Check against deposits before sending anything — dunning a customer who already paid is a real and avoidable harm.
- Are payment terms correctly recorded per customer?

## Step 5 — Deliver

Aging table by bucket and by customer, classification per overdue invoice,
drafted next-action message for each, and a total of collectible-this-month cash.
Recommend a bad-debt provision for anything past 90 days with no contact.
