# Data Model: UI/UX Enhancement

## UI State Entities (Frontend Only)

### Entity: UI Theme State
Represents the visual mode of the application.

| Field | Type | Description |
|-------|------|-------------|
| mode  | 'dark' | 'light' | Current active theme. Defaults to 'dark'. |
| persisted | boolean | Whether the preference exists in localStorage. |

### Entity: Notification (Toast)
Represents a temporary feedback message.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique UUID or timestamp. |
| type | 'success' | 'error' | 'info' | Style of the toast. |
| message | string | Content to display. |
| duration | number | Time in ms before auto-dismiss (default 3000). |

## State Transitions

### Theme Toggle
1. User clicks icon.
2. System toggles `'dark'` class on `document.documentElement`.
3. System updates state.
4. System writes to `localStorage`.

### Action Feedback
1. User completes CRUD action.
2. System pushes new Notification to queue.
3. System triggers entry animation (fade-in).
4. System sets timer for removal.
