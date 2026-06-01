## Status: active
## Last Updated: 2026-05-21
## Confidence: medium

## Priority:
Lock the simplified Home and Mood flows, then replace local-only storage with a real backend contract.

## Next Action:
Define the backend/API shape for daily check-ins and decide permanent destinations for the modules parked in Legacy.

## Risks:
- Data is stored only in localStorage and is not yet synced to a backend.
- Risk and insight logic is rule-based and should be validated against product expectations.
- Some UI sections still use placeholder content outside the daily check-in flow.

## Recent Context:
Base44 dependencies and stubs were removed, the app now runs standalone, client chat notes were captured in `Client_chat.md`, the Mood/Home flow now uses real local history for check-ins, insights, and risk summaries, the sleep-hour picker now opens as a viewport-centered modal from a click trigger, visible chart markers and empty-state fallbacks were added, save flow now verifies persisted data after write, Home was simplified to a task-first postpartum flow, Mood was refactored into a quick check-in-first flow with optional details and a single insight, the optional detail inputs were rewritten into stacked conversational cards so labels read like gentle questions instead of dashboard controls, the old inline green save banner was replaced with a floating success popup, the trend chart now re-animates smoothly when mood data changes, and displaced Mood/Home modules now live in a temporary Legacy tab.
