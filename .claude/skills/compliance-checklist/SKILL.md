---
name: compliance-checklist
description: Build a compliance checklist for a product, launch, or business activity and assess current status against it. Use when the user asks "are we compliant", "compliance checklist", "what do we need before launch", "コンプライアンス", "法令遵守", "監査対応", or mentions SOC 2, ISO 27001, GDPR readiness, or accessibility requirements. For the privacy document itself, see privacy-policy. For contract-level obligations, see vendor-msa-review.
metadata:
  department: legal
  version: 1.0.0
---

# Compliance Checklist

Turn a vague "are we OK?" into a scoped, evidence-backed status list.

> **Not legal advice.** This is a working checklist, not a certification or a
> legal opinion. State this in the deliverable.

## Step 1 — Scope it, or the list is meaningless

Determine and write down:
- **Business activity** — what is sold, to whom, where.
- **Jurisdictions** where customers and users are located (not just where the company is).
- **Data handled** — personal, sensitive, payment, health, children's.
- **Regimes in play** — legal obligations (GDPR, CCPA, APPI, PCI DSS, accessibility law) vs voluntary frameworks pursued for sales reasons (SOC 2, ISO 27001).

Distinguish these clearly. "We need SOC 2" is a commercial requirement; "we need
GDPR" is a legal one. They are handled differently and the user should know which is which.

## Step 2 — Build the checklist from the scope

Common domains — include only those in scope:

**Data protection** — lawful basis documented, privacy notice published, DSR process with an owner and SLA, records of processing, DPAs signed with every processor, breach response plan with a 72h path, transfer mechanism for cross-border data.

**Security** — MFA on admin accounts, access reviews, encryption at rest and in transit, backup and tested restore, vulnerability management, logging and retention, incident response runbook, vendor security review.

**Payments** — PCI scope determined (using a hosted processor usually reduces it dramatically — verify rather than assume), no card data touching own systems, refund/chargeback handling.

**Consumer & marketing** — terms published and accepted via clickwrap, pricing and auto-renewal disclosure, cancellation path, email consent and unsubscribe, cookie consent where required, advertising substantiation.

**Employment** — contracts in place, IP assignment signed, contractor vs employee classification reviewed, required policies.

**Corporate** — entity registration current, business licenses, insurance active, tax registrations, statutory filings.

**Accessibility** — WCAG conformance target set and tested (an obligation, not a nicety, in a growing number of jurisdictions).

## Step 3 — Assess honestly

Each item: **Compliant / Partial / Non-compliant / Not applicable / Unknown**, and for anything not "Not applicable", the **evidence** — a file, a screenshot, a config, a signed document.

"Unknown" is a legitimate and important status. Do **not** mark an item compliant
because it seems likely. An unverified checklist that reads green is worse than
one that reads honestly amber, because it stops the investigation.

Verify what you can directly: read the codebase for MFA enforcement, check whether
a cookie banner exists, confirm the privacy policy is actually published.

## Step 4 — Prioritize

Rank gaps by: **exposure** (regulatory penalty, contract breach, lost deal, user harm) × **effort**. Present in three tiers: blocks launch / fix this quarter / backlog.

## Step 5 — Verify and deliver

Confirm every checklist item has a status, every non-N/A item has evidence or an
explicit "no evidence found", and every gap has an owner and a target date.

Deliver: scope statement, checklist with status and evidence, prioritized gap
list, and a plain statement of what remains **Unknown** — reported as prominently
as what is compliant.
