## Overview
- Product: postpartum support dashboard focused on daily check-ins, mood monitoring, light journaling, and care guidance.
- Current runtime: local standalone React + Vite app.
- Main working surfaces: Home tab, Mood tab, Therapy tab, Care Plans tab, Circle tab.

## Product Snapshot
- Home shows a care journey, risk summary, project intake form, and dashboard summaries.
- Mood provides the primary daily check-in flow and journal capture.
- Risk, graph, and insights currently derive from local mood history rules in `src/lib/mood-data.js`.

## Project Overrides
- Keep AGENTS-driven docs current each session.
- Favor simple, real data flows over decorative mock features.
- Preserve existing UI language while replacing placeholders with usable product behavior.
