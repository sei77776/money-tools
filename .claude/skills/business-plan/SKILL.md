---
name: business-plan
description: Write a business plan or funding document — market, model, operations, team, and financial projections tied to stated assumptions. Use when the user says "business plan", "事業計画書", "融資の資料", "投資家向け資料", "plan for the bank", "5-year projection", or needs a document for a lender, investor, or grant. For the marketing go-to-market portion, see marketing-plan. For the cash model itself, see cash-runway-forecast.
metadata:
  department: small-business
  version: 1.0.0
---

# Business Plan

## Step 1 — Ask who reads it, because that changes the document

| Reader | What they actually test |
|--------|-------------------------|
| **Bank / lender** | Can you repay? Cash flow stability, collateral, track record. Conservative projections read as credible |
| **Equity investor** | How big can this get? Market size, growth rate, defensibility, team |
| **Grant body** | Does it meet the stated criteria? Follow their structure exactly |
| **Internal** | Is this the right thing to do? Honest trade-offs, no persuasion layer |

Writing an investor-style growth narrative for a bank, or vice versa, is the most
common way these documents fail. Confirm the reader before drafting.

## Step 2 — Sections

1. **Executive summary** — written last. One page. What the business does, for whom, why now, what you're asking for.
2. **The problem and the opportunity** — evidenced, not asserted.
3. **Solution / offering** — what is actually sold, and what stage it is at today.
4. **Market** — size it bottom-up (customers × price), not by quoting a global market figure. Top-down TAM numbers are treated as a credibility signal in the wrong direction.
5. **Competition** — name real competitors including the status quo ("they do nothing" or "they use a spreadsheet"). A plan claiming no competition reads as insufficient research.
6. **Business model** — how money is made, unit economics (`unit-economics`), pricing.
7. **Go-to-market** — from `marketing-plan`.
8. **Operations** — how the thing is actually delivered; key dependencies and suppliers.
9. **Team** — who, and specifically why they can do this. Name the gaps and the hiring plan; an acknowledged gap reads better than a hidden one.
10. **Financials** — see below.
11. **Risks and mitigations** — the section most often omitted and most closely read. Include the risks that would genuinely hurt, with what you would do.
12. **The ask** — amount, use of funds broken down, and what it buys in terms of milestones.

## Step 3 — Financials

Provide 3 years monthly, or 5 years annually, comprising P&L, cash flow, and
balance sheet, built from `cash-runway-forecast` and `unit-economics`.

Rules that determine whether the numbers are believed:
- **An assumptions page comes first**, with every driver a reader can change in one place.
- Build revenue **bottom-up** — customers × price × frequency — never as a percentage of a market.
- Costs scale with revenue. A plan where revenue grows 10× and headcount grows 1.5× is not credible without a stated reason.
- Include the base case and a downside. Presenting only the upside costs credibility with any experienced reader.
- Show the break-even point and the peak funding requirement (the trough), not just the endpoint.

## Step 4 — Verify

- Do the three statements tie to each other? (Net income → cash flow → balance sheet.)
- Does the funding ask match the peak cash requirement in the model, with headroom?
- Is every market and industry figure sourced, with a date? **Unsourced numbers in a funding document are a serious credibility problem** — remove or source them.
- Does the narrative match the spreadsheet? Prose claiming 40% margins alongside a model showing 22% is a common and fatal inconsistency — check it explicitly.
- Is the summary genuinely one page?

## Step 5 — Deliver

The document (`docx` or `pptx` per the reader), the financial model (`xlsx`) with
the assumptions tab first, a source list for every external figure, and a list of
claims that still need evidence before this goes out.
