---
name: contract-review
description: Review a contract clause by clause and produce a risk-ranked issues list with suggested redlines. Use when the user shares any agreement and asks "review this contract", "is this safe to sign", "what should I negotiate", "契約書レビュー", "この契約書を確認して", "リスクはある?", or pastes contract text. Covers MSAs, SOWs, service agreements, and general commercial terms. For NDAs specifically, see nda-drafting. For employment terms, see employment-agreement.
metadata:
  department: legal
  version: 1.0.0
---

# Contract Review

Produce a risk-ranked review a non-lawyer can act on and a lawyer can check.

> **Not legal advice.** This is a structured reading of a document, not counsel.
> It does not create an attorney-client relationship, does not account for
> jurisdiction-specific law, and must be reviewed by a qualified lawyer before
> signing anything material. State this at the top of every deliverable.

## Step 1 — Establish position and stakes

Before reading clauses, get:
- **Which side are we?** Customer or vendor. The same clause is favorable or hostile depending on this. Never review without knowing.
- **Deal value** and term length.
- **Governing law / jurisdiction** named in the document.
- **What is actually being exchanged** — data? IP? people? money only?
- Negotiating leverage: are we the smaller party, and is this a take-it-or-leave-it paper?

## Step 2 — Read for the clauses that carry real money

Work this list. For each, record: present/absent, what it says, and the risk to our side.

**Money & term**
- Payment terms, late fees, price escalation, auto-renewal and the notice window to escape it
- Termination: for convenience? for cause only? notice period? what survives?
- Minimum commitments, true-ups, overage pricing

**Risk allocation** — the clauses that decide who pays when something goes wrong
- **Limitation of liability** — cap amount, and whether it is mutual. An uncapped or one-sided cap is usually the single largest issue in a commercial contract.
- **Indemnification** — who defends whom, for what, and is it mutual?
- **Warranties and disclaimers**
- **Insurance requirements** — can we actually meet them?

**Control**
- IP ownership: who owns work product, background IP, and derivatives
- Data: ownership, processing rights, deletion on termination, sub-processors, cross-border transfer
- Confidentiality scope and duration
- Assignment and change-of-control
- Exclusivity, non-compete, non-solicit
- Dispute resolution: courts vs arbitration, venue, jury waiver, fee-shifting

**Missing clauses count as findings.** An absent liability cap is a finding, not a
non-issue — check for absence deliberately.

## Step 3 — Rank

| Severity | Meaning |
|----------|---------|
| **Blocker** | Do not sign as written. Unbounded liability, IP assignment we can't give, obligations we cannot perform. |
| **High** | Negotiate before signing. Materially one-sided but survivable. |
| **Medium** | Ask for, accept trade-off if refused. |
| **Low** | Note only. |

## Step 4 — Draft redlines

For every Blocker and High, give: the current text (quoted), the proposed
replacement text, and one sentence on why the counterparty should accept it.
A finding without proposed language is half-finished work.

## Step 5 — Verify before delivering

- Did you review the **whole** document, including exhibits, schedules, SOWs, and anything incorporated by reference (a linked online ToS is part of the contract)? If a referenced document was not provided, say so — the review is incomplete without it.
- Did you check defined terms? A benign-looking clause often turns on a hostile definition.
- Did you state which side you reviewed for?
- Are there internal inconsistencies (e.g. term in §3 contradicts §12)?

## Step 6 — Deliver

1. Disclaimer.
2. One-paragraph bottom line: sign / sign with changes / do not sign.
3. Ranked issues table with clause reference, risk, and proposed redline.
4. Questions for counsel — the points genuinely needing a lawyer's judgment.
