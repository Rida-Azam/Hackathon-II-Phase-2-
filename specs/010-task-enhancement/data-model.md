# Task Enhancement Data Model

## Entity: Task

### Fields
- **id**: string (primary key, auto-generated)
- **title**: string (required, min length: 1, max length: 200)
- **description**: string (optional, max length: 1000)
- **dueDate**: string | null (optional, ISO 8601 date string format, default: null)
- **priority**: enum['low', 'medium', 'high'] (required, default: 'medium')
- **workType**: enum['personal', 'work', 'study', 'home', 'other'] (required, default: 'personal')
- **completed**: boolean (required, default: false)
- **createdAt**: string (datetime, ISO 8601 format, auto-generated)
- **updatedAt**: string (datetime, ISO 8601 format, auto-generated)

### Relationships
- **User**: Many tasks belong to one user (via user_id foreign key)

### Validation Rules
- **title**: Required field, minimum 1 character, maximum 200 characters
- **description**: Optional, maximum 1000 characters
- **dueDate**: Optional, if provided must be valid ISO 8601 date string
- **priority**: Required, must be one of 'low', 'medium', or 'high'
- **workType**: Required, must be one of 'personal', 'work', 'study', 'home', or 'other'
- **completed**: Boolean value, default false

### State Transitions
- **Creation**: New task created with defaults for priority ('medium') and workType ('personal')
- **Update**: Task properties can be modified (except id and createdAt)
- **Completion**: completed field toggles between true/false
- **Deletion**: Task is removed from the system

### Default Values
- **priority**: 'medium'
- **workType**: 'personal'
- **dueDate**: null
- **completed**: false
- **createdAt**: current timestamp
- **updatedAt**: current timestamp

## API Request/Response Objects

### Create Task Request
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "dueDate": "string | null (optional)",
  "priority": "'low' | 'medium' | 'high' (optional, default: 'medium')",
  "workType": "'personal' | 'work' | 'study' | 'home' | 'other' (optional, default: 'personal')"
}
```

### Task Response
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "description": "string | null",
  "dueDate": "string | null",
  "priority": "'low' | 'medium' | 'high'",
  "workType": "'personal' | 'work' | 'study' | 'home' | 'other'",
  "completed": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Update Task Request
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "dueDate": "string | null (optional)",
  "priority": "'low' | 'medium' | 'high' (optional)",
  "workType": "'personal' | 'work' | 'study' | 'home' | 'other' (optional)"
}
```