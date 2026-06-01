# AGENTS.md

## Purpose
This file is the operating contract for all AI agents in this repo.
- Rules only — never a log or changelog.
- Project-specific overrides live in `docs/PROJECT_CONTEXT.md` and take precedence.

---

## Session Start

### Step 1 — Read in priority order
If a file does not exist, skip it and continue.

**Tier 1 — Always read (project RAM):**
1. `docs/CURRENT_STATE.md`
2. `docs/KNOWN_ISSUES.md`
3. Latest file in `docs/SESSION_LOGS/`

**Tier 2 — Read only if relevant to today's task:**
4. `docs/START_HERE.md` — if first session or codebase is unfamiliar
5. `docs/PROJECT_CONTEXT.md` — if scope or product questions arise
6. `docs/ARCHITECTURE.md` — if touching structure or modules
7. `docs/CONTRACTS.md` — if touching API or schema
8. `docs/FAILED_ATTEMPTS.md` — before trying any non-trivial approach
9. `docs/DECISIONS.md` — before reversing a past decision

> If token budget is tight, Tier 1 is non-negotiable. Tier 2 can be skipped
> with explicit justification stated in the session log.

### Step 2 — Flag stale docs
For each Tier 1 doc, check `Last Updated`. If older than 30 days, output:

```
⚠️ docs/CURRENT_STATE.md may be stale (last updated: YYYY-MM-DD).
   Treating with reduced confidence. Verify against codebase before acting.
```

### Step 3 — Confirm understanding
State the following before touching any code:
- Current project state
- Known blockers
- What you believe the next task is

Do not edit code until this is confirmed.

---

## During Work
- Preserve existing behavior unless explicitly changing it.
- Prefer small, targeted patches.
- Do not rewrite unrelated files.
- Explain risk before any major refactor.
- Do not modify deployment/runtime files unless required by the task.
- After any UI or behavior change, verify the web app still runs normally.
- Before trying a non-trivial approach, check `docs/FAILED_ATTEMPTS.md`.

---

## Session End — Required Checklist

Mark each item `[x]` when done. Do not end the session with unchecked items
unless explicitly instructed to stop early — in that case, note what was skipped
and why in the session log.

```
- [ ] docs/CURRENT_STATE.md — updated status, priority, next action, risks, last updated
- [ ] docs/SESSION_LOGS/YYYY-MM-DD.md — entry appended
- [ ] docs/KNOWN_ISSUES.md — updated if a bug remains unresolved
- [ ] docs/DECISIONS.md — updated if an architectural decision was made
- [ ] docs/FAILED_ATTEMPTS.md — updated if an approach was tried and failed
- [ ] tasks/TODO.md — updated with concrete next steps
```

---

## Log Quality Gate
- Do NOT log: formatting-only, rename-only, or trivial edits.
- DO log: architectural changes, root causes, debugging findings, failed approaches,
  important assumptions, and any decision that would be hard to reconstruct from git.

---

## File Registry

| File | Role | Size Limit | Update Trigger |
|------|------|------------|----------------|
| `AGENTS.md` | Rules only | — | Rule changes only |
| `docs/START_HERE.md` | Boot sequence for new or unfamiliar session | ≤ 50 lines | Onboarding changes |
| `docs/CURRENT_STATE.md` | Project RAM: status, priority, risks, next action | ≤ 200 lines | Every session |
| `docs/PROJECT_CONTEXT.md` | Overview, architecture snapshot, project overrides | ≤ 150 lines | Scope changes |
| `docs/ARCHITECTURE.md` | Module responsibilities and data flow | — | Structural changes |
| `docs/CONTRACTS.md` | API/schema contracts and source-of-truth payloads | — | API or schema changes |
| `docs/SESSION_LOGS/` | Daily working memory (one file per day) | ≤ 100 lines/file | Every session |
| `docs/KNOWN_ISSUES.md` | Unresolved bugs and problems | ≤ 150 lines | Bug found or resolved |
| `docs/FAILED_ATTEMPTS.md` | Approaches tried and why they failed | — | Failed approach |
| `docs/DECISIONS.md` | Decision history and rationale | — | Architectural decision |
| `tasks/TODO.md` | Next actionable tasks | — | Every session |
| `tasks/BACKLOG.md` | Deferred work | — | As needed |

When a file approaches its size limit, summarize and archive older entries rather
than deleting them.

---

## File Templates

Use these templates exactly. Do not omit fields — use `none` or `n/a` if empty.
Consistent structure is what makes these files machine-readable across sessions.

### `docs/CURRENT_STATE.md`
```
## Status: [active | blocked | complete]
## Last Updated: YYYY-MM-DD
## Confidence: [high | medium | low]

## Priority:
(one sentence — the single most important thing right now)

## Next Action:
(one concrete, unambiguous task)

## Risks:
- (list)

## Recent Context:
(what changed in the last session that a new agent needs to know)
```

### `docs/SESSION_LOGS/YYYY-MM-DD.md` — one entry per session, appended
```
## Session: YYYY-MM-DD

### Done
-

### Not Done
-

### Bugs Found
-

### Bugs Fixed
-

### Remaining Risks
-

### Next Recommended Action
-
```

### `docs/KNOWN_ISSUES.md` — one entry per issue
```
## [ISSUE-ID] Short title
- Status: [open | investigating | blocked]
- Discovered: YYYY-MM-DD
- Description:
- Attempted fixes:
- Next step:
```

### `docs/FAILED_ATTEMPTS.md` — one entry per failure
```
## YYYY-MM-DD — Short description of approach
- What was tried:
- Why it failed:
- Do not retry because:
```

### `docs/DECISIONS.md` — one entry per decision
```
## YYYY-MM-DD — Decision title
- Context:
- Decision:
- Alternatives considered:
- Rationale:
- Revisit if:
```

---

## Project-Specific Overrides
Any rules in `docs/PROJECT_CONTEXT.md` take precedence over this file for that project.
