## Mood Entry Contract
```json
{
  "id": "YYYY-MM-DD",
  "dateKey": "YYYY-MM-DD",
  "moodScore": 1,
  "energyLevel": 50,
  "sleepHours": 4,
  "tags": ["overwhelmed", "tired"],
  "note": "string",
  "supportContacted": "yes",
  "updatedAt": "ISO-8601"
}
```

## Storage Keys
- `afterbloom_mood_history`
- `afterbloom_project_input`
- `afterbloom_reminder`
- `afterbloom_reminder_dismissed`

## Source Of Truth
- Daily check-in history: `src/lib/mood-data.js`
- Project intake form: localStorage payload written from `HomeTab`
