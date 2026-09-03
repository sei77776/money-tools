---
name: vendor-management
description: Manage the ongoing supplier and vendor portfolio — selection, scorecards, renewal calendar, concentration risk, and offboarding. Use when the user says "choose a supplier", "vendor review", "取引先管理", "仕入先の選定", "should we switch providers", "renewal is coming up", or is comparing service providers. For reviewing the contract terms, see vendor-msa-review. For finding waste in spend, see expense-audit.
metadata:
  department: small-business
  version: 1.0.0
---

# Vendor Management

## Step 1 — Maintain the vendor register

One table is the backbone of everything else here:

`vendor | what they provide | annual spend | contract end date | renewal notice deadline | internal owner | criticality | data access | replaceable?`

**Criticality**: does the business stop if this vendor stops? Rank
critical / important / convenient. Effort should follow criticality — a
critical vendor deserves a scorecard and a contingency plan; a convenience
vendor does not.

The renewal notice deadline column is the highest-value field in the register.
Populate it from the contract and set a calendar reminder 45 days before each one.

## Step 2 — Selection, when choosing a new vendor

1. Write the requirements **before** looking at options — including must-haves, nice-to-haves, and constraints (budget, timeline, compliance, integrations).
2. Shortlist 3. One option is not a decision; ten is a research project.
3. Score against a fixed weighted matrix. Weight the criteria before seeing prices, so the weighting is not reverse-engineered to justify a preference.
4. Reference-check with existing customers of similar size — ask specifically what went wrong and how the vendor handled it.
5. Run a paid pilot for anything critical before committing to a term.
6. Route the contract through `vendor-msa-review` before signing.

Score on total cost of ownership, not sticker price: implementation, migration,
training, integration work, and exit cost all count.

## Step 3 — Review performance on a cadence

For critical vendors, quarterly; important, annually. Score:

- **Delivery** — on time, in full, to spec
- **Quality** — defect/incident rate, SLA attainment against the contract's actual measurement definition
- **Responsiveness** — support times, escalation handling
- **Commercial** — price versus market, billing accuracy
- **Risk** — security posture, financial stability, concentration

Bring evidence, not impressions. "Three P1 incidents last quarter, two outside SLA"
is actionable; "they've been flaky" is not.

## Step 4 — Watch concentration and lock-in

Flag when: one vendor is more than ~25% of total spend; a single vendor is the
sole source for something critical; data or workflow lock-in makes exit cost
exceed a year of fees; or the vendor shows financial distress signals.

For each critical vendor, maintain a one-paragraph contingency: what we do in the
first 48 hours if they fail, and who the alternate is.

## Step 5 — Offboard deliberately

When ending a relationship: give notice in the contractual form and window
(often written notice to a specific address — email may not satisfy it); export
data and verify the export is complete and usable **before** the account closes;
obtain deletion confirmation; revoke the vendor's access to internal systems;
close billing and confirm no auto-renewal fires; document why, for the next
selection.

## Step 6 — Deliver

Updated register, scorecards for reviewed vendors, the next 12 months of renewal
deadlines as dates, concentration risk flags, and recommended actions with owners.
