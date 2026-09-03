---
name: meeting-notes
description: Turn a meeting, call, or transcript into structured minutes with decisions, action items, and open questions separated out. Use when the user says "write up this meeting", "議事録", "meeting minutes", "summarize this call", "action items from this", or pastes a transcript or raw notes from a discussion. For capturing personal notes and todos day to day, see secretary.
metadata:
  department: small-business
  version: 1.0.0
---

# Meeting Notes

The value of minutes is not the summary — it is the separation of **decisions**
from **discussion** from **actions**. A wall of prose that mixes them is why
nothing happens after a meeting.

## Step 1 — Capture the frame

Date, attendees (and who was absent but affected), purpose in one line. If a
transcript was provided, note that the record is from a transcript rather than
live notes — attribution in auto-transcripts is often wrong, and that matters
when a decision is later attributed to someone.

## Step 2 — Sort every point into exactly one bucket

**Decisions** — what was actually settled. For each: the decision, who made it,
and the reasoning in one line. The reasoning is what stops the same discussion
recurring in six weeks.

**Action items** — what someone will do. Every one needs:
`what | owner (a person) | due date`.
An action with no owner will not happen. An action with no date is a wish. If
either was not stated in the meeting, mark it explicitly as `owner: TBD` rather
than assigning one yourself — inventing an owner creates a false record.

**Open questions** — raised, not resolved. For each, who will resolve it and by when.

**Context** — background worth keeping. Keep this short; it is the bucket that
swallows everything if allowed.

Discard: pleasantries, tangents that led nowhere, and repeated restatements.

## Step 3 — Flag the things that were not said

Two failure modes worth surfacing explicitly:

- **Apparent agreement with no decision.** Everyone nodded, nothing was decided. Note it as an open question rather than recording a decision that did not happen.
- **A decision that contradicts an earlier one.** Flag it so someone reconciles them.

## Step 4 — Verify

- Does every action item have an owner and a date, or an explicit TBD?
- Is every recorded decision one that was actually stated, rather than one you inferred from the discussion? **This is the most important check** — inferred decisions in written minutes become real, and are then acted on.
- Are attributions correct? If working from an auto-transcript, mark uncertain attributions rather than guessing.
- Is anything in the notes confidential enough that circulation should be limited? Say so.

## Step 5 — Deliver

```
# <Meeting> — <date>
Attendees: …    Purpose: …

## Decisions
- <decision> — <who> — <one-line why>

## Actions
| What | Owner | Due |

## Open questions
- <question> — <who resolves> — <by when>

## Context
- …
```

Circulate within 24 hours. Ask recipients to correct anything wrong within a
stated window — after that, the notes are the record, and that only works if
people had a real chance to object.
