# Task Enhancement Implementation Plan

## Technical Context

The Todo Evolution application needs to enhance the task creation flow by adding optional fields for due date, priority, and work type. This will allow users to better organize and categorize their tasks without disrupting the simple, fast experience of basic task creation.

### Current Architecture
- **Frontend**: Next.js application with TypeScript
- **Backend**: FastAPI with PostgreSQL database
- **Authentication**: JWT-based system
- **Current Task Schema**: id, title, description, completed, created_at, updated_at
- **Task Creation Flow**: Inline form on the todos page

### Resolved Technical Questions
- **Database migration strategy**: Using Alembic (existing system) with nullable columns and default values for new records
- **UI components**: Native date input with custom styled selects for priority and work type
- **Existing tasks**: Will have null/undefined values for new fields; defaults apply only to new tasks
- **Data display**: Subtle indicators for priority, compact date display, category badges for work type

## Constitution Check

This implementation aligns with the project's core principles:
- Maintains simplicity and speed of task creation (new options are optional)
- Preserves backward compatibility (existing clients continue to work)
- Follows type-safe development practices (proper TypeScript definitions)
- Ensures responsive design across devices (mobile-first approach)
- Prioritizes user experience with optional enhancements (non-disruptive additions)
- Uses established patterns (Alembic for migrations, existing UI patterns)

### Gate Evaluation
- ✅ Simplicity: New features are optional and don't complicate basic flow
- ✅ Backward Compatibility: Existing clients continue to function
- ✅ Type Safety: All new fields will have proper TypeScript definitions
- ✅ User Experience: Enhancements improve organization without complexity
- ✅ Established Patterns: Using existing migration and UI systems
- ✅ Responsive Design: Components will work on all device sizes

## Phase 0: Research & Analysis

### Research Tasks
1. **Database Schema Changes**: Research the best approach to add optional fields to existing Task model
2. **UI Component Selection**: Investigate suitable UI components for date picker, priority selector, and work type selector
3. **Migration Strategy**: Determine safe approach for adding columns to existing table
4. **Display Strategy**: Research how to effectively display new task attributes in the list without cluttering UI

## Phase 1: Design & Architecture

### Data Model Design
**Extended Task Schema**:
- id: string
- title: string (required)
- description: string (optional)
- dueDate: string | null (optional, default: null)
- priority: 'low' | 'medium' | 'high' (required, default: 'medium')
- workType: 'personal' | 'work' | 'study' | 'home' | 'other' (required, default: 'personal')
- completed: boolean
- createdAt: string
- updatedAt: string

### API Contract Design
**POST /api/todos/** - Create Task
- Request Body: { title: string, description?: string, dueDate?: string | null, priority?: 'low' | 'medium' | 'high', workType?: 'personal' | 'work' | 'study' | 'home' | 'other' }
- Response: 201 Created with full task object
- Defaults: priority='medium', workType='personal' if not provided

**PUT /api/todos/{id}** - Update Task
- Request Body: Same as create with all fields optional
- Response: 200 OK with updated task object

### UI Component Design
1. **Options Panel**: Expandable/collapsible panel above task input
2. **Date Picker**: Calendar widget with quick-select options (Today, Tomorrow, Next Week)
3. **Priority Selector**: Segmented control or dropdown with visual indicators
4. **Work Type Selector**: Pill-based selector or dropdown

## Phase 2: Implementation Strategy

### Backend Implementation
1. Update Task model with new fields
2. Update database schema with safe migration
3. Update API endpoints to accept new fields with defaults
4. Update validation logic

### Frontend Implementation
1. Add state management for new fields
2. Create UI components for options panel
3. Update task creation flow
4. Update task display to show new attributes appropriately
5. Update task editing flow to include new fields

### Testing Approach
1. Unit tests for new API endpoints
2. Integration tests for task creation with new fields
3. UI tests for options panel functionality
4. Backward compatibility tests

## Phase 3: Implementation Plan

### Sprint 1: Backend Changes
- [ ] Extend Task model with new fields
- [ ] Create database migration
- [ ] Update API endpoints to accept new fields
- [ ] Implement default value logic
- [ ] Add validation rules

### Sprint 2: Frontend UI
- [ ] Create options panel component
- [ ] Implement date picker functionality
- [ ] Create priority selector
- [ ] Create work type selector
- [ ] Integrate with task creation flow

### Sprint 3: Integration & Polish
- [ ] Connect frontend to backend API
- [ ] Implement task display updates
- [ ] Add validation feedback
- [ ] Implement editing functionality for new fields
- [ ] Responsive design adjustments

### Sprint 4: Testing & Deployment
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Deploy to production