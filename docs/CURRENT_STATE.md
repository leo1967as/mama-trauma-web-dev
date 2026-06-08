## Status: complete
## Last Updated: 2026-06-08
## Confidence: high

## Priority:
Phases 0, 2, 3 complete + a check-in UX pass, all verified in headless Chrome and committed. Onboarding stored keys now match spec field names. Next coding phase is Phase 4 (Home screen — wire stage/reminder from onboarding data) or Phase 5 (daily check-in core), per PLAN.

## Next Action:
Begin Phase 4: use `getPreferredCheckinTime()` / `getIsFirstTimeMother()` where relevant on Home, and confirm every Home card reads from a single onboarding/history source (no hardcoded stage).

## Risks:
- Browser-level QA is still recommended for the new global help sheet and CTA behavior.
- LocalStorage keys were intentionally reset, so older app data will not carry over.
- Support Level and EPDS mapping are heuristic and may need tuning after browser validation.

## Recent Context:
Rebranded MaMa to Afterbloom across source paths, storage keys, user-facing copy, and mock data; renamed `src/components/calmmama` to `src/components/afterbloom`; switched Risk Level to Support Level; wired a global I Need Help sheet from Dashboard; and verified the app with build and lint.
