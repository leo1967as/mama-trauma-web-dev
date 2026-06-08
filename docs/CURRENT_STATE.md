## Status: complete
## Last Updated: 2026-06-08
## Confidence: high

## Priority:
Phase 0 audit + Phase 2 (Support Level label) complete, plus a check-in UX pass. Next coding phase is Phase 3 (onboarding field-name alignment to spec). Browser smoke check of the check-in animation + greeting still pending.

## Next Action:
Browser smoke-check: (1) Home greeting shows the onboarding name or "there" (never "Afterbloom"), (2) daily check-in — header/footer stay put while only the question body fades up per step, options rise together, no per-option Score, (3) "Today's Support Level" heading on Home + Mood. Then begin Phase 3.

## Risks:
- Browser-level QA is still recommended for the new global help sheet and CTA behavior.
- LocalStorage keys were intentionally reset, so older app data will not carry over.
- Support Level and EPDS mapping are heuristic and may need tuning after browser validation.

## Recent Context:
Rebranded MaMa to Afterbloom across source paths, storage keys, user-facing copy, and mock data; renamed `src/components/calmmama` to `src/components/afterbloom`; switched Risk Level to Support Level; wired a global I Need Help sheet from Dashboard; and verified the app with build and lint.
