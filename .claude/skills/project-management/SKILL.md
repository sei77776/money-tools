---
name: project-management
description: Plan and track a business project or client engagement — milestones, dependencies, status reporting, and recovering a slipping schedule. Use when the user says "project plan", "案件管理", "プロジェクトの進捗", "we're behind schedule", "status report", "who's doing what by when", or is running delivery work with deadlines. For planning a software implementation task, see writing-plans. For the client relationship at kickoff, see client-onboarding.
metadata:
  department: small-business
  version: 1.0.0
---

# Project Management

Business and client delivery projects. (Code implementation planning belongs to
the development department's `writing-plans` — different granularity, different
review loop.)

## Step 1 — Define done before defining tasks

- What is delivered, to whom, and what makes it acceptable?
- What is explicitly **not** in this project?
- Hard deadline or preferred date? If hard, what drives it — a contract, an event, a regulatory date?
- What is the constraint: scope, time, or budget? Exactly one can be fixed most rigidly; ask which, because every later trade-off resolves against that answer.

## Step 2 — Break down and sequence

Decompose to tasks small enough to estimate within a factor of two — typically
1–5 days. Anything larger is not a task, it is an unexamined assumption.

For each: owner (a person, not a team), estimate, dependencies, and the
deliverable that proves it is done.

Then identify the **critical path** — the longest dependent chain. Only slippage
on that chain moves the end date. Without it, teams optimize tasks that don't
matter and miss the ones that do.

Add buffer at the project level, not per task. Per-task buffer gets consumed
silently (work expands to fill it); a single visible project buffer does not.

## Step 3 — Track what actually predicts slippage

Bad status tracking asks "are we on track?" and gets "yes" until suddenly no.
Track instead:

- **Critical-path tasks** and their current forecast finish, not their % complete.
- **Blocked items** with age. A blocker aging past a few days is the real signal.
- **Dependency status on the client's side** — usually the largest uncontrolled risk.
- **Estimate-to-complete**, re-forecast from where things actually are, not remaining budget.

"90% done" is not a status. "Two tasks left, both estimated 3 days, one blocked on
their legal review since Tuesday" is.

## Step 4 — Report honestly, weekly

Format: RAG status → what shipped this week → what's next → blockers with owners
and asks → changes to the end date.

If the date moved, **say the date moved**, in the first line, with the reason.
A status report that buries a slip destroys more trust than the slip itself. If
you knew last week and didn't say, say that too.

## Step 5 — Recovering a slipping project

Options, in rough order of preference:
1. **Cut scope** — agree with the client which deliverable moves to a later phase.
2. **Re-sequence** — parallelize work that was needlessly serialized.
3. **Add people** — slowest and least reliable; onboarding cost usually exceeds the gain on a short project.
4. **Move the date** — often the correct answer, and always better than silently missing it.

Never recover a schedule by quietly dropping quality steps (review, testing,
verification). That converts a schedule problem into a delivery failure.

## Step 6 — Verify

- Does every task have a single named owner?
- Is the critical path identified, and is the reported end date derived from it?
- Does each open blocker have an owner, an age, and a specific ask?
- Do the current estimates-to-complete actually sum to the stated end date? Recompute rather than restating the original plan.

## Step 7 — Deliver

Task breakdown with owners and dependencies, the critical path, the current
forecast end date with the arithmetic behind it, blockers, and the weekly status
template.
