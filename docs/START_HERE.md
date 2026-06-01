## Boot Sequence
- Read `AGENTS.md` first.
- Read `docs/CURRENT_STATE.md`.
- Read `docs/KNOWN_ISSUES.md`.
- Read the latest file in `docs/SESSION_LOGS/`.
- Open `src/pages/tabs/HomeTab.jsx` and `src/pages/tabs/MoodTab.jsx` first for product-facing changes.
- Open `src/lib/mood-data.js` first for daily check-in storage, history, risk, and insight logic.
- Open `src/components/calmmama/` for Home dashboard components.

## Current Focus Areas
- Home dashboard summary and project input capture
- Mood tracking, risk, and insights backed by local history
- Care journey interaction polish

## Notes
- This repo currently runs as a standalone local app with no Base44 dependency.
- Documentation skeletons were created to satisfy the repo operating contract and should be kept current each session.
