# Task API Contracts

## Overview
This document defines the API contracts for the enhanced task functionality, including the new dueDate, priority, and workType fields.

## Base URL
`http://localhost:8000/api` (development)
`https://api.example.com/v1` (production)

## Authentication
All endpoints require a valid JWT token in the Authorization header:
`Authorization: Bearer <token>`

## Endpoints

### Create Task
- **Method**: POST
- **Path**: `/todos/`
- **Description**: Creates a new task with optional due date, priority, and work type

#### Request
**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Body**:
```json
{
  "title": "string (required, min 1 char, max 200 chars)",
  "description": "string (optional, max 1000 chars)",
  "dueDate": "string | null (optional, ISO 8601 date format)",
  "priority": "'low' | 'medium' | 'high' (optional, defaults to 'medium')",
  "workType": "'personal' | 'work' | 'study' | 'home' | 'other' (optional, defaults to 'personal')"
}
```

#### Responses
- **201 Created**: Task created successfully
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
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
  }
  ```

- **400 Bad Request**: Validation error
  ```json
  {
    "detail": "string (error message)"
  }
  ```

- **401 Unauthorized**: Invalid or missing token

### Get Task
- **Method**: GET
- **Path**: `/todos/{id}`
- **Description**: Retrieves a specific task by ID

#### Request
**Path Parameters**:
- `id`: Task ID (integer)

**Headers**:
- `Authorization: Bearer <token>`

#### Responses
- **200 OK**: Task retrieved successfully
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
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
  }
  ```

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or belongs to different user

### Update Task
- **Method**: PUT
- **Path**: `/todos/{id}`
- **Description**: Updates an existing task with new values

#### Request
**Path Parameters**:
- `id`: Task ID (integer)

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Body**:
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "dueDate": "string | null (optional)",
  "priority": "'low' | 'medium' | 'high' (optional)",
  "workType": "'personal' | 'work' | 'study' | 'home' | 'other' (optional)"
}
```

#### Responses
- **200 OK**: Task updated successfully
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
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
  }
  ```

- **400 Bad Request**: Validation error
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or belongs to different user

### Get All Tasks
- **Method**: GET
- **Path**: `/todos/`
- **Description**: Retrieves all tasks for the authenticated user

#### Request
**Headers**:
- `Authorization: Bearer <token>`

#### Responses
- **200 OK**: Tasks retrieved successfully
  ```json
  [
    {
      "id": "string",
      "user_id": "string",
      "title": "string",
      "description": "string | null",
      "dueDate": "string | null",
      "priority": "'low' | 'medium' | 'high'",
      "workType": "'personal' | 'work' | 'study' | 'home' | 'other'",
      "completed": "boolean",
      "created_at": "string (ISO 8601)",
      "updated_at": "string (ISO 8601)"
    }
  ]
  ```

- **401 Unauthorized**: Invalid or missing token

### Delete Task
- **Method**: DELETE
- **Path**: `/todos/{id}`
- **Description**: Deletes a specific task by ID

#### Request
**Path Parameters**:
- `id`: Task ID (integer)

**Headers**:
- `Authorization: Bearer <token>`

#### Responses
- **204 No Content**: Task deleted successfully
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or belongs to different user

### Toggle Task Completion
- **Method**: PATCH
- **Path**: `/todos/{id}/complete`
- **Description**: Toggles the completion status of a task

#### Request
**Path Parameters**:
- `id`: Task ID (integer)

**Headers**:
- `Authorization: Bearer <token>`

#### Responses
- **200 OK**: Task completion status toggled
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
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
  }
  ```

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Task does not exist or belongs to different user