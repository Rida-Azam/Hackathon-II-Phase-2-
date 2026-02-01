# Task Enhancement Quickstart Guide

## Overview
This guide provides a quick overview of how to implement the enhanced task creation functionality with due date, priority, and work type options.

## Prerequisites
- Node.js 18+ and npm
- Python 3.13+ with uv
- PostgreSQL database
- Next.js and FastAPI knowledge

## Implementation Steps

### 1. Backend Changes
#### Update Task Model
1. Add new fields to the Task model:
   - dueDate: string | null
   - priority: enum with values 'low', 'medium', 'high'
   - workType: enum with values 'personal', 'work', 'study', 'home', 'other'

2. Set default values:
   - priority: 'medium'
   - workType: 'personal'
   - dueDate: null

3. Create database migration to add columns to existing tasks table

4. Update API endpoints to accept new fields while maintaining backward compatibility

### 2. Frontend Changes
#### Create Options Panel
1. Add expandable/collapsible options panel above task input
2. Include date picker component with today/tomorrow/next week quick selections
3. Create priority selector with visual indicators
4. Create work type selector with category options

#### Update Task Creation Flow
1. Add state variables for new fields
2. Apply default values when creating tasks
3. Include new fields in API requests
4. Preserve state on failure, reset on success

#### Update Task Display
1. Show subtle priority indicators
2. Display due date compactly
3. Show work type as category badge
4. Maintain clean UI without cluttering task titles

### 3. Testing
1. Test task creation with all new options
2. Test task creation without new options (backward compatibility)
3. Test editing tasks with new fields
4. Test mobile responsiveness
5. Test keyboard navigation

## Key Files to Modify
- Backend: `src/models/task.py` (add new fields)
- Backend: `src/api/routes/todos.py` (update endpoints)
- Frontend: `src/app/todos/page.tsx` (add options panel)
- Frontend: `src/components/TodoItem.tsx` (update display)

## Environment Variables
No new environment variables required

## API Changes
- POST `/api/todos/` now accepts optional dueDate, priority, workType fields
- PUT `/api/todos/{id}` now accepts optional dueDate, priority, workType fields
- All existing functionality remains unchanged

## Default Behavior
- New tasks get priority='medium' and workType='personal' by default
- dueDate defaults to null
- Existing tasks retain their original structure
- All new fields are optional for API compatibility