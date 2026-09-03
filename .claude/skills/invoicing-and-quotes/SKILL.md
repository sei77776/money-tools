---
name: invoicing-and-quotes
description: Create quotes, estimates, and invoices that get accepted and paid, with correct terms, tax treatment, and required fields. Use when the user says "create an invoice", "send a quote", "estimate for a client", "請求書を作って", "見積書", "invoice template", "what should my payment terms be". For chasing unpaid invoices, see ar-collections. For setting the price itself, see pricing-and-margin.
metadata:
  department: small-business
  version: 1.0.0
---

# Quotes & Invoices

## Step 1 — Gather what the document legally needs

Requirements vary by jurisdiction; confirm rather than assume. Commonly required
on an invoice:

- Seller legal name, address, and tax/registration number
- Buyer legal name and address
- Unique sequential invoice number (gaps and duplicates cause audit problems — check the last number used)
- Issue date and supply date
- Line-item description, quantity, unit price
- Tax rate and tax amount **stated separately** per rate
- Total excluding tax, tax, total including tax
- Payment terms, due date, and payment instructions
- Currency

Japan note: qualified invoices under the インボイス制度 additionally require the
registration number (登録番号) and per-rate tax breakdown. If the user is in Japan,
ask whether they are a 適格請求書発行事業者 before generating — a non-compliant
invoice costs the customer their input tax credit.

## Step 2 — Quotes: write to be accepted

A quote is a sales document, not a price list.

- Lead with the outcome the client gets, not the hours.
- Itemize enough to show value; not so much that each line invites negotiation.
- Present 2–3 options (good/better/best) rather than one number — it moves the conversation from *whether* to *which*.
- State inclusions **and exclusions** explicitly. Undefined scope is where margin dies.
- Set a validity period (e.g. 30 days) so pricing is not open-ended.
- State assumptions and what triggers a change order.
- Give one clear acceptance mechanism and next step.

## Step 3 — Choose terms deliberately

| Choice | Guidance |
|--------|----------|
| Net terms | Net 14 or Net 30. Longer terms are a loan to the customer — price them in |
| Deposit | 30–50% up front for project work; for a new customer, non-negotiable |
| Milestones | Tie payment to deliverables for anything over ~4 weeks |
| Late fees | Only if the underlying contract permits — check before stating one |
| Early-pay discount | 2/10 net 30 is roughly 36% annualized; use only when cash timing justifies it |

Match the invoice terms to the signed contract. Where they conflict, the contract
usually governs — flag the mismatch rather than papering over it.

## Step 4 — Make it easy to pay

Include a payment link or full bank details. State who to contact with questions.
Send to the actual accounts-payable address, not only the project contact — this
single change resolves a large share of "late" payments, which are really
"never routed" payments.

## Step 5 — Verify

- Invoice number is unique and sequential.
- Line items sum to the subtotal; tax computes correctly at each rate; total is right. Recompute rather than trusting the template.
- PO number included if the customer requires one — many AP systems reject invoices without it.
- Due date is an actual date, not just "Net 30".
- Names match the contracting entities exactly.

## Step 6 — Deliver

The document (via `docx` or `xlsx`, or the user's existing template), a summary
of the terms chosen and why, and a suggested follow-up schedule handing off to
`ar-collections`.
