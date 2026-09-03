---
name: bank-reconciliation
description: Reconcile a bank or card statement against the books (ledger, accounting export, invoice list) and produce a matched/unmatched breakdown. Use when the user says "reconcile", "match transactions", "the bank doesn't match the books", "照合", "突合", "銀行明細と帳簿が合わない", or hands over a bank CSV plus a ledger. For building the statements themselves, see financial-statements. For chasing unpaid customer invoices, see ar-collections.
metadata:
  department: finance
  version: 1.0.0
---

# Bank Reconciliation

Match two transaction sets and explain every difference. The deliverable is not
"they match" — it is a complete, itemized account of why they don't.

> **Not accounting advice.** A human must approve every adjusting entry.

## Step 1 — Load both sides

Read the bank/card export and the ledger export (`xlsx` skill for spreadsheets,
`pdf` for statements). For each side report: row count, date range, opening
balance, closing balance, sum of amounts.

Normalize both to: `date, amount, description, ref_id, source`.
Sign convention: money leaving the account is negative on both sides. Fix
whichever side disagrees and say that you did.

## Step 2 — Match in passes, strictest first

Run these passes in order. A row matched in an earlier pass is removed from later passes.

| Pass | Rule |
|------|------|
| 1 | Exact: same amount **and** same date **and** same reference/check number |
| 2 | Exact amount, date within ±3 days |
| 3 | Exact amount, date within ±10 days, fuzzy description match |
| 4 | One-to-many: one bank line == sum of N ledger lines (batched deposits, split payments) |
| 5 | Many-to-one: N bank lines == one ledger line (installments, partial payments) |

Record which pass matched each pair. Never match on amount alone across a wide
date window without flagging it as low confidence.

## Step 3 — Classify the leftovers

Every unmatched row must land in exactly one bucket:

- **In transit** — recorded in books, not yet cleared the bank (normal near period end).
- **Outstanding** — cleared the bank, not yet in books (needs a journal entry).
- **Bank-only** — fees, interest, FX charges, chargebacks. Usually needs a new ledger entry.
- **Duplicate** — same transaction recorded twice on one side.
- **Timing/period** — belongs in an adjacent period.
- **Unexplained** — could not be classified. This bucket must be listed line by line.

## Step 4 — Prove the reconciliation

Build and show the bridge:

```
Bank closing balance
  + outstanding deposits not yet in bank
  − outstanding payments not yet cleared
  ± bank-only items not yet booked
  ± corrections
  = Ledger closing balance
```

If the bridge does not close to zero, say so with the exact residual amount. Do
**not** create a balancing plug line. An unclosed reconciliation reported
honestly is a correct result; a plugged one is not.

## Step 5 — Deliver

Spreadsheet with tabs: `matched`, `unmatched-bank`, `unmatched-ledger`,
`proposed-entries`, `bridge`. Plus a summary stating: match rate (%), residual
amount, count of unexplained items, and the specific human decisions needed.
