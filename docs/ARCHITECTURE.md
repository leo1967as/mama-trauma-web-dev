## App Structure
- `src/App.jsx`: app shell and routing.
- `src/pages/Dashboard.jsx`: tab container and main screen composition.
- `src/pages/tabs/`: top-level product tabs.
- `src/components/calmmama/`: Home/dashboard-specific components.
- `src/lib/mood-data.js`: local mood history storage, chart shaping, risk summary, and insight rules.

## Data Flow
- User submits a daily check-in from `MoodTab`.
- Check-in is persisted to localStorage through `upsertMoodEntry`.
- Home, Mood chart, insights, and risk components read from the same history source.

## Current Technical Boundaries
- No backend persistence yet.
- No API contracts yet.
- Product logic is mostly client-side and local-first.
