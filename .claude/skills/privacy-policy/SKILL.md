---
name: privacy-policy
description: Draft or audit a privacy policy grounded in what the product actually collects, and map it to GDPR/CCPA/APPI obligations. Use when the user says "privacy policy", "GDPR", "CCPA", "APPI", "個人情報保護方針", "プライバシーポリシー", "cookie banner", "data processing", or asks what they must disclose about user data. For the contractual side of vendor data handling, see vendor-msa-review.
metadata:
  department: legal
  version: 1.0.0
---

# Privacy Policy

A privacy policy is a factual description of a system, not a template. Write the
system inventory first; the document falls out of it.

> **Not legal advice.** Privacy obligations are jurisdiction-specific and
> enforcement carries real penalties. A qualified lawyer must review before
> publication. State this in the deliverable.

## Step 1 — Inventory what is actually collected

Do not accept a verbal summary. Inspect the codebase and configuration:

- Search for form fields, analytics SDKs, tag managers, session recorders, ad pixels, error trackers, chat widgets, A/B tools.
- Check the database schema for personal data columns.
- List third-party services in `package.json`, environment variables, and CSP/network calls.
- Note cookies and local storage keys set.

Produce a table: `data element | collected where | purpose | legal basis | retention | shared with | storage region`.

**Any gap in this table is a gap in the policy.** If you cannot determine a
retention period, do not invent one — flag it as an open question for the user.

## Step 2 — Map to obligations

| Regime | Applies when | Key obligations |
|--------|--------------|-----------------|
| **GDPR** (EU/UK) | Offering goods/services to, or monitoring, people in the EU/UK | Legal basis for each purpose, DSR rights (access/erasure/portability/objection), DPO if applicable, breach notice in 72h, transfer mechanism for non-EU storage |
| **CCPA/CPRA** (California) | Thresholds on revenue/data volume | Notice at collection, "Do Not Sell or Share" link, opt-out of targeted ads, sensitive-PI limits |
| **APPI** (Japan) | Handling personal data of people in Japan | Purpose of use specified and published, consent for third-party provision, rules for cross-border transfer |

Also check sector rules: children's data (COPPA / age gating), health, financial.

## Step 3 — Write the document

Required sections: who we are and how to contact us; what we collect; why, with
legal basis; who we share it with (name the categories and the actual processors);
international transfers and safeguards; retention periods; user rights and how to
exercise them; cookies; children; security; how changes are notified; effective date.

Rules:
- Plain language. If a sentence needs a lawyer to parse, rewrite it.
- Specific over generic. "We use Stripe for payments and Google Analytics 4 for usage analytics" beats "we may share data with service providers".
- Never claim a practice the product does not follow. An aspirational policy is a liability, not a protection.

## Step 4 — Verify

- Does every item in the Step 1 inventory appear in the policy?
- Does the policy claim anything the codebase contradicts? (e.g. "we do not use tracking cookies" while a pixel is installed.) Check this directly — it is the highest-risk error.
- Is there an actual mechanism behind each stated right? A stated erasure right with no deletion path is a compliance failure.
- Is the effective date set and a change-notification method stated?

## Step 5 — Deliver

The policy draft, the data inventory table it was built from, a gap list
(practices needing engineering work before the policy is true), and the
disclaimer.
