# Task Enhancement Feature Specification

## Objective

Enhance the **Add Task** feature so users can select **Due Date**, **Priority**, and **Type of Work** *before submitting a task*, while keeping the UI simple, fast, and optional.

No changes to authentication, task modal redesign, or user name display are included in this spec.

## User Scenarios & Testing

### Primary User Flow
1. User navigates to the todos page
2. User clicks the "+" button or focuses on the "Push a new task into your day…" input field
3. Options panel expands showing due date, priority, and work type selectors
4. User optionally selects values for these fields
5. User enters task title (required) and description (optional)
6. User submits the task
7. Task is created with selected options or defaults

### Secondary Flows
- User adds a basic task without selecting any options
- User selects all options before submitting
- User modifies selected options before submission
- User refreshes the page and sees consistent data

### Edge Cases
- User selects a past due date (should show soft warning)
- User submits without a title (should show validation error)
- User selects options but then clears them before submission

## Functional Requirements

### 1. Enhanced Add Task Flow
- **REQ-TASK-001**: When the user clicks "+" or focuses on the task input, an options panel must appear showing due date, priority, and type of work selectors
- **REQ-TASK-002**: The options panel must be collapsible and not interfere with basic task creation
- **REQ-TASK-003**: All options must be optional with sensible defaults applied automatically

### 2. Due Date Selection
- **REQ-DATE-001**: Due date selector must be a date picker component
- **REQ-DATE-002**: Due date field must accept null values (default: null)
- **REQ-DATE-003**: Due date selector must include quick picks for Today, Tomorrow, and Next Week
- **REQ-DATE-004**: System must show a soft warning if a past date is selected

### 3. Priority Selection
- **REQ-PRIO-001**: Priority selector must be a segmented control or select dropdown
- **REQ-PRIO-002**: Priority values must be limited to: low, medium, high
- **REQ-PRIO-003**: Default priority value must be "medium"
- **REQ-PRIO-004**: Priority selector must include light color indicators for visual recognition
- **REQ-PRIO-005**: Priority selector must be keyboard accessible

### 4. Type of Work Selection
- **REQ-WORK-001**: Work type selector must be a dropdown or pill selector
- **REQ-WORK-002**: Work type values must be limited to: personal, work, study, home, other
- **REQ-WORK-003**: Default work type value must be "personal"

### 5. Task Creation API
- **REQ-API-001**: Create task endpoint must accept dueDate, priority, and workType parameters
- **REQ-API-002**: API must remain backward compatible with existing requests
- **REQ-API-003**: API must apply default values for priority ("medium") and workType ("personal") if not provided
- **REQ-API-004**: API must accept null values for dueDate

### 6. State Management
- **REQ-STATE-001**: Selected options must be reset after successful task creation
- **REQ-STATE-002**: Selected options must be preserved if task creation fails
- **REQ-STATE-003**: System must support optimistic UI updates when appropriate

### 7. Validation Rules
- **REQ-VALID-001**: Task title must be required
- **REQ-VALID-002**: System must provide soft warning if due date is in the past
- **REQ-VALID-003**: System must auto-fallback to defaults if priority or work type are missing

### 8. UI/UX Requirements
- **REQ-UI-001**: Options panel must be visible but collapsible
- **REQ-UI-002**: Inline expansion must be used instead of modals
- **REQ-UI-003**: System must support desktop, tablet, and mobile interfaces
- **REQ-UI-004**: System must support keyboard-friendly navigation
- **REQ-UI-005**: Adding a basic task must not require extra clicks when options aren't needed

## Success Criteria

- **SUCCESS-001**: 95% of users can successfully add a task with enhanced options within 30 seconds
- **SUCCESS-002**: Users can add basic tasks without selecting options as quickly as before the enhancement
- **SUCCESS-003**: No performance degradation occurs in task creation flow
- **SUCCESS-004**: Mobile users can access all enhanced features without horizontal scrolling
- **SUCCESS-005**: Keyboard-only users can navigate and select all enhanced options
- **SUCCESS-006**: Users can identify and select due date, priority, and work type options with 90% accuracy on first attempt

## Key Entities

### Task
- id: string
- title: string (required)
- description: string (optional)
- dueDate: string | null
- priority: 'low' | 'medium' | 'high'
- workType: 'personal' | 'work' | 'study' | 'home' | 'other'
- completed: boolean
- createdAt: string

## Assumptions

- The current task creation API can be extended to accept additional parameters
- The UI framework supports date pickers and segmented controls
- Users are familiar with the concept of priorities and work categorization
- The existing task list display will accommodate the new fields without redesign
- The backend database schema can be updated to include new fields

## Constraints

- No changes to authentication system
- No changes to task modal redesign
- No changes to user name display
- Backward compatibility must be maintained
- UI must remain simple and fast
- Options must remain optional

## Dependencies

- Current task creation API must support extension
- UI framework must support required components (date picker, segmented controls)
- Database schema must allow for new fields