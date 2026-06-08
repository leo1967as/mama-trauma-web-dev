## Status: complete
## Last Updated: 2026-06-08
## Confidence: high

## Priority:
Afterbloom rebrand + Phase 0 audit complete. Bulk rebrand verified spec-compliant; one over-replacement fixed (`AuthContext` default name). Phase 2 (Support Level label/copy) and Phase 3 (onboarding field-name alignment) are the next coding phases — logged as backlog in `PLAN.md`. Browser smoke check still pending.

## Next Action:
Browser smoke-check the Home greeting (must show the onboarding name or "there", never "Afterbloom"), then begin Phase 2: add a "Support Level" heading to `SupportIndicator` and remove the duplicated level label.

## Risks:
- Browser-level QA is still recommended for the new global help sheet and CTA behavior.
- LocalStorage keys were intentionally reset, so older app data will not carry over.
- Support Level and EPDS mapping are heuristic and may need tuning after browser validation.

## Recent Context:
Rebranded MaMa to Afterbloom across source paths, storage keys, user-facing copy, and mock data; renamed `src/components/calmmama` to `src/components/afterbloom`; switched Risk Level to Support Level; wired a global I Need Help sheet from Dashboard; and verified the app with build and lint.
