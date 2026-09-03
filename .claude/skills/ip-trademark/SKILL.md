---
name: ip-trademark
description: Assess intellectual property questions — trademark clearance for a name or logo, copyright of assets, open-source license obligations, and IP ownership across contractors. Use when the user says "can we use this name", "trademark", "商標", "著作権", "is this logo safe", "open source license", "GPL", "who owns this code", or is naming a product or brand. For assigning IP in contracts, see employment-agreement or contract-review.
metadata:
  department: legal
  version: 1.0.0
---

# IP & Trademark

> **Not legal advice.** Clearance searches performed here are preliminary and
> non-exhaustive. Only a qualified IP attorney can give a clearance opinion.
> Say this plainly — a false "it's clear" is a costly error.

## Step 1 — Identify which IP right is actually in question

These are different regimes and conflating them produces wrong answers:

| Right | Protects | Arises |
|-------|----------|--------|
| **Trademark** | Names, logos, slogans identifying a source of goods/services | Use in commerce; registration strengthens it |
| **Copyright** | Creative expression — code, text, images, music | Automatically on fixation |
| **Patent** | Inventions, processes | Only on grant after application |
| **Trade secret** | Confidential business value | Kept secret and reasonably protected |

## Step 2a — Trademark clearance (preliminary)

1. **Define the goods/services class.** A name can be free in one Nice class and taken in another. Ask what will actually be sold before searching.
2. **Search** — national registries (USPTO TESS, EUIPO, JPO), plus common-law use: web search, app stores, domain registrations, social handles, GitHub orgs, company registries.
3. **Assess similarity** on sight, sound, and meaning — not exact match only. "Klaro" and "Claro" collide. Phonetic and translated equivalents matter.
4. **Report**: identical marks in class, similar marks in class, similar marks in adjacent classes, unregistered use found.

Give a risk rating (low/medium/high) with reasoning, never a clearance opinion.
State the databases searched and, explicitly, what you did **not** search.

## Step 2b — Copyright & assets

For each asset in the project, determine provenance: original work / licensed stock (which license, what does it permit) / open source (which license) / AI-generated (note the jurisdiction-dependent protectability) / unknown.

**"Unknown provenance" is a finding.** Fonts, icons, and stock photos are the
most common sources of unlicensed use — check the license terms actually permit
commercial and redistributed use, not just download.

## Step 2c — Open-source license compliance

Scan dependency manifests and lockfiles. Classify each license:

- **Permissive** (MIT, BSD, Apache-2.0) — attribution required; Apache-2.0 adds patent and NOTICE terms.
- **Weak copyleft** (LGPL, MPL, EPL) — modifications to the library must be shared; check linking mode.
- **Strong copyleft** (GPL, AGPL) — AGPL reaches network use and is the one that most often surprises SaaS companies. Flag every AGPL dependency prominently.
- **Non-commercial / source-available** (BSL, SSPL, CC-BY-NC) — usually not OSS; read the actual grant.

Deliverable: dependency, license, obligation, current compliance status, action needed. Confirm an attribution/NOTICE file exists and is complete.

## Step 2d — Ownership chain

For every contributor — employee, contractor, agency, freelancer — is there a
signed IP assignment? **In many jurisdictions a contractor owns what they create
absent a written assignment**, regardless of having been paid. Gaps here surface
during due diligence and are expensive to fix retroactively. List every gap.

## Step 3 — Verify

- Did you state the goods/services class for any trademark conclusion?
- Did you check phonetic and translated variants, not just exact strings?
- Did you scan transitive dependencies, not just direct ones?
- Is every conclusion labeled as preliminary?

## Step 4 — Deliver

Risk-rated findings per area, the specific searches run and their date, the gaps
in ownership chain, and a short list of what a lawyer should confirm.
