# Quickstart: Task Enhancements Implementation

**Feature**: 009-task-enhancements
**Date**: 2026-01-06
**Branch**: `009-task-enhancements`

## Overview

This guide provides a step-by-step implementation approach for adding priority, category, due dates, search/filter, reminders, and calendar features to the Todo application.

---

## Prerequisites

- ✅ Branch `009-task-enhancements` checked out
- ✅ Backend running on `http://localhost:8000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ Database connection configured (Neon PostgreSQL or SQLite)
- ✅ JWT authentication working (from previous features)

---

## Implementation Phases

### Phase 1: Backend Model Extension
**Estimated Complexity**: Low
**Files Changed**: 1

#### Step 1.1: Update Task Model
**File**: `backend/src/models/task.py`

**Current State**:
```python
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Add New Fields**:
```python
from datetime import datetime, date  # Add 'date' import
from typing import Optional, Literal  # Add 'Literal' import
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

    # NEW FIELDS - Add these three lines
    priority: Literal['low', 'medium', 'high'] = Field(default='medium')
    category: Literal['Home', 'Work', 'Other'] = Field(default='Other')
    due_date: Optional[date] = Field(default=None)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Verification**:
```bash
# Restart backend server
cd backend
uv run uvicorn src.main:app --reload

# Check logs for successful model loading (no errors)
```

#### Step 1.2: Handle Database Migration

**For Development (SQLite)**:
```bash
# Delete existing database (DEV ONLY - loses data)
cd backend
rm todo.db

# Restart backend - new schema auto-created
uv run uvicorn src.main:app --reload
```

**For Production (Neon PostgreSQL)**:
```sql
-- Connect to Neon database via psql or Neon SQL Editor
-- Run these ALTER TABLE statements:

ALTER TABLE tasks
ADD COLUMN priority VARCHAR(10) DEFAULT 'medium',
ADD COLUMN category VARCHAR(10) DEFAULT 'Other',
ADD COLUMN due_date DATE DEFAULT NULL;

-- Add constraints for validation
ALTER TABLE tasks
ADD CONSTRAINT check_priority CHECK (priority IN ('low', 'medium', 'high'));

ALTER TABLE tasks
ADD CONSTRAINT check_category CHECK (category IN ('Home', 'Work', 'Other'));
```

**Verification**:
```bash
# Test API with curl
curl -X POST http://localhost:8000/api/todos/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test priority","priority":"high","category":"Work","due_date":"2026-01-15"}'

# Should return 201 with new fields included
```

---

### Phase 2: Frontend Type Updates
**Estimated Complexity**: Low
**Files Changed**: 1

#### Step 2.1: Extend TypeScript Interface
**File**: `frontend/src/types/todo.ts`

**Current State**:
```typescript
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

**Add New Types and Fields**:
```typescript
// Add type aliases
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Home' | 'Work' | 'Other';

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;

  // NEW FIELDS
  priority: Priority;
  category: Category;
  due_date: string | null; // ISO date string (YYYY-MM-DD) or null

  created_at: string;
  updated_at: string;
}
```

**Verification**:
- TypeScript compiler should show no errors
- Existing code continues working (new fields are required in type but API provides defaults)

---

### Phase 3: Add Task Form Enhancement
**Estimated Complexity**: Medium
**Files Changed**: 1

#### Step 3.1: Update Add Task Form
**File**: `frontend/src/app/todos/page.tsx`

**Current Form State**:
```typescript
const [newTitle, setNewTitle] = useState("");
```

**Add New State Variables**:
```typescript
const [newTitle, setNewTitle] = useState("");
const [newPriority, setNewPriority] = useState<Priority>("medium");
const [newCategory, setNewCategory] = useState<Category>("Other");
const [newDueDate, setNewDueDate] = useState<string>("");
```

**Update Form Submission**:
```typescript
const handleAddTodo = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTitle.trim()) return;
  try {
    const response = await api.post("/api/todos/", {
      title: newTitle,
      priority: newPriority,
      category: newCategory,
      due_date: newDueDate || null
    });
    setTodos([...todos, response.data]);
    setNewTitle("");
    setNewPriority("medium");
    setNewCategory("Other");
    setNewDueDate("");
  } catch (err) {
    console.error("Failed to add", err);
  }
};
```

**Add Form Controls** (after existing title input):
```tsx
<form onSubmit={handleAddTodo} className="relative group">
  {/* Existing title input */}
  <input
    type="text"
    placeholder="Push a new task into your day..."
    className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-3xl py-6 px-8 text-lg font-medium shadow-2xl shadow-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all placeholder:text-muted-foreground/30"
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
  />

  {/* NEW: Additional fields row */}
  <div className="flex gap-4 mt-4">
    <div className="flex-1">
      <label className="block text-[10px] font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-widest">
        Priority
      </label>
      <select
        value={newPriority}
        onChange={(e) => setNewPriority(e.target.value as Priority)}
        className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div className="flex-1">
      <label className="block text-[10px] font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-widest">
        Category
      </label>
      <select
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value as Category)}
        className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
      >
        <option value="Home">Home</option>
        <option value="Work">Work</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div className="flex-1">
      <label className="block text-[10px] font-bold text-muted-foreground mb-2 ml-1 uppercase tracking-widest">
        Due Date
      </label>
      <input
        type="date"
        value={newDueDate}
        onChange={(e) => setNewDueDate(e.target.value)}
        className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
      />
    </div>
  </div>

  <button
    type="submit"
    className="absolute right-4 top-1/2 -translate-y-1/2 bg-foreground text-background p-3 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl"
  >
    <Plus size={24} />
  </button>
</form>
```

---

### Phase 4: TodoItem Component Enhancement
**Estimated Complexity**: Medium
**Files Changed**: 1

#### Step 4.1: Update TodoItem Display
**File**: `frontend/src/components/TodoItem.tsx`

**Add State for Editing New Fields**:
```typescript
const [isEditing, setIsEditing] = useState(false);
const [editTitle, setEditTitle] = useState(todo.title);
const [editDescription, setEditDescription] = useState(todo.description || "");
// NEW: Add these
const [editPriority, setEditPriority] = useState(todo.priority);
const [editCategory, setEditCategory] = useState(todo.category);
const [editDueDate, setEditDueDate] = useState(todo.due_date || "");
```

**Update handleSave Function**:
```typescript
const handleSave = () => {
  onUpdate(todo.id, editTitle, editDescription, editPriority, editCategory, editDueDate || null);
  setIsEditing(false);
};
```

**Add Visual Indicators** (in display mode, before title):
```tsx
<div className="flex items-start justify-between">
  <div className="flex items-start space-x-6 flex-1 min-w-0">
    {/* Existing checkbox */}
    <button onClick={() => onToggle(todo.id)} ...>
      {/* ... existing checkbox code ... */}
    </button>

    <div className="flex-1 min-w-0">
      {/* NEW: Priority & Category Badges */}
      <div className="flex items-center gap-2 mb-2">
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest",
          todo.priority === 'high' && "bg-red-500/10 text-red-500",
          todo.priority === 'medium' && "bg-blue-500/10 text-blue-500",
          todo.priority === 'low' && "bg-gray-500/10 text-gray-500"
        )}>
          {todo.priority}
        </span>
        <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 text-muted-foreground uppercase tracking-widest">
          {todo.category}
        </span>
        {todo.due_date && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 uppercase tracking-widest">
            {new Date(todo.due_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Existing title and description */}
      <h3 className={...}>{todo.title}</h3>
      {/* ... rest of display code ... */}
    </div>
  </div>
</div>
```

**Add Edit Form Fields** (in editing mode):
```tsx
{isEditing ? (
  <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
    {/* Existing title input */}
    <input type="text" value={editTitle} onChange={...} />

    {/* Existing description textarea */}
    <textarea value={editDescription} onChange={...} />

    {/* NEW: Priority, Category, Due Date */}
    <div className="flex gap-4">
      <select
        value={editPriority}
        onChange={(e) => setEditPriority(e.target.value as Priority)}
        className="flex-1 p-4 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-foreground/10 outline-none transition-all text-sm font-medium"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={editCategory}
        onChange={(e) => setEditCategory(e.target.value as Category)}
        className="flex-1 p-4 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-foreground/10 outline-none transition-all text-sm font-medium"
      >
        <option value="Home">Home</option>
        <option value="Work">Work</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        value={editDueDate}
        onChange={(e) => setEditDueDate(e.target.value)}
        className="flex-1 p-4 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-foreground/10 outline-none transition-all text-sm font-medium"
      />
    </div>

    {/* Existing buttons */}
    <div className="flex justify-end space-x-3 mt-2">
      <button onClick={() => setIsEditing(false)} ...>Cancel</button>
      <button onClick={handleSave} ...>Update Task</button>
    </div>
  </div>
) : (
  // ... existing display mode ...
)}
```

**Update onUpdate Prop Type** (in parent component):
```typescript
// In frontend/src/app/todos/page.tsx
const handleUpdate = async (
  id: number,
  title: string,
  description: string | null,
  priority: Priority,
  category: Category,
  due_date: string | null
) => {
  setIsProcessing(true);
  try {
    await api.put(`/api/todos/${id}/`, { title, description, priority, category, due_date });
    await fetchTodos();
  } catch (err: any) {
    setError(err.response?.data?.detail || err.message);
  } finally {
    setIsProcessing(false);
  }
};
```

---

### Phase 5: Search & Filter UI
**Estimated Complexity**: Medium
**Files Changed**: 1 (main todos page)

#### Step 5.1: Add Filter State
**File**: `frontend/src/app/todos/page.tsx`

```typescript
const [searchQuery, setSearchQuery] = useState("");
const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
const [filterDueDate, setFilterDueDate] = useState<"all" | "today" | "week" | "overdue" | "none">("all");
```

#### Step 5.2: Create Filter Logic
```typescript
const filteredTodos = todos.filter(task => {
  // Search filter (title)
  if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
    return false;
  }

  // Priority filter
  if (filterPriority !== "all" && task.priority !== filterPriority) {
    return false;
  }

  // Category filter
  if (filterCategory !== "all" && task.category !== filterCategory) {
    return false;
  }

  // Due date filter
  if (filterDueDate !== "all") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterDueDate === "none") {
      if (task.due_date) return false;
    } else if (filterDueDate === "today") {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);
      if (dueDate.getTime() !== today.getTime()) return false;
    } else if (filterDueDate === "week") {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (dueDate < today || dueDate > sevenDaysLater) return false;
    } else if (filterDueDate === "overdue") {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      if (dueDate >= today) return false;
    }
  }

  return true;
});
```

#### Step 5.3: Add Filter UI
```tsx
{/* Add after header, before add task form */}
<div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Search */}
    <div className="flex-1">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
      />
    </div>

    {/* Priority Filter */}
    <select
      value={filterPriority}
      onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
      className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
    >
      <option value="all">All Priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>

    {/* Category Filter */}
    <select
      value={filterCategory}
      onChange={(e) => setFilterCategory(e.target.value as Category | "all")}
      className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
    >
      <option value="all">All Categories</option>
      <option value="Home">Home</option>
      <option value="Work">Work</option>
      <option value="Other">Other</option>
    </select>

    {/* Due Date Filter */}
    <select
      value={filterDueDate}
      onChange={(e) => setFilterDueDate(e.target.value as any)}
      className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
    >
      <option value="all">All Dates</option>
      <option value="today">Today</option>
      <option value="week">This Week</option>
      <option value="overdue">Overdue</option>
      <option value="none">No Date</option>
    </select>

    {/* Clear Filters */}
    <button
      onClick={() => {
        setSearchQuery("");
        setFilterPriority("all");
        setFilterCategory("all");
        setFilterDueDate("all");
      }}
      className="px-4 py-3 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors rounded-2xl hover:bg-white/5"
    >
      Clear
    </button>
  </div>
</div>

{/* Update task list to use filteredTodos instead of todos */}
<div className="space-y-6">
  {loading ? (
    // ... loading skeleton ...
  ) : filteredTodos.length === 0 ? (
    <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
      <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] opacity-50">
        {todos.length === 0 ? "Empty Workspace" : "No tasks match filters"}
      </p>
    </div>
  ) : (
    filteredTodos.map((todo) => (
      <TodoItem key={todo.id} todo={todo} ... />
    ))
  )}
</div>
```

---

### Phase 6: Sidebar Updates
**Estimated Complexity**: Low
**Files Changed**: 1

#### Step 6.1: Remove Notes from Sidebar
**File**: `frontend/src/components/Sidebar.tsx`

**Current navItems**:
```typescript
const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/todos", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", href: "/todos", icon: CheckSquare },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: Calendar },
  { id: "reminders", label: "Reminders", href: "/reminders", icon: Bell },
  { id: "notes", label: "Notes", href: "/notes", icon: FileText },  // REMOVE THIS LINE
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];
```

**Updated navItems**:
```typescript
const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/todos", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", href: "/todos", icon: CheckSquare },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: Calendar },
  { id: "reminders", label: "Reminders", href: "/reminders", icon: Bell },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];
```

---

### Phase 7: Reminders Page
**Estimated Complexity**: Medium
**Files Changed**: 1 new file

#### Step 7.1: Create Reminders Page
**File**: `frontend/src/app/reminders/page.tsx` (NEW)

```typescript
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Task } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Bell } from "lucide-react";

export default function RemindersPage() {
  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchTodos();
  }, [router]);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/api/todos/");
      setTodos(response.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.replace("/login");
      } else {
        setError(err.response?.data?.detail || "Connection error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reminder logic: high priority OR due within next 7 days
  const reminderTasks = todos.filter(task => {
    if (task.completed) return false;

    if (task.priority === 'high') return true;

    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= sevenDaysLater;
    }

    return false;
  });

  const handleUpdate = async (
    id: number,
    title: string,
    description: string | null,
    priority: any,
    category: any,
    due_date: string | null
  ) => {
    setIsProcessing(true);
    try {
      await api.put(`/api/todos/${id}/`, { title, description, priority, category, due_date });
      await fetchTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this task?")) return;
    setIsProcessing(true);
    try {
      await api.delete(`/api/todos/${id}/`);
      await fetchTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = async (id: number) => {
    setIsProcessing(true);
    try {
      await api.patch(`/api/todos/${id}/complete/`);
      await fetchTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/[0.03] blur-[120px] pointer-events-none" />

        <Header />

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-12">
            <header>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-500/10 rounded-2xl">
                  <Bell size={24} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold font-poppins tracking-tight">Reminders</h2>
                  <p className="text-muted-foreground font-medium mt-1">
                    High-priority tasks and items due soon
                  </p>
                </div>
              </div>
            </header>

            <div className="space-y-6">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-white/5 animate-pulse rounded-[2rem] border border-white/5" />
                ))
              ) : reminderTasks.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                  <Bell size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] opacity-50">
                    No Reminders
                  </p>
                  <p className="text-foreground/40 mt-2 text-sm font-medium">
                    High-priority or upcoming tasks will appear here
                  </p>
                </div>
              ) : (
                reminderTasks.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    disabled={isProcessing}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

### Phase 8: Calendar Page
**Estimated Complexity**: High
**Files Changed**: 1 new file

#### Step 8.1: Create Calendar Page
**File**: `frontend/src/app/calendar/page.tsx` (NEW)

```typescript
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Task } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchTodos();
  }, [router]);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/api/todos/");
      setTodos(response.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return todos.filter(task => task.due_date === dateStr);
  };

  const selectedDateTasks = selectedDate
    ? todos.filter(task => task.due_date === selectedDate)
    : [];

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleUpdate = async (id: number, title: string, description: string | null, priority: any, category: any, due_date: string | null) => {
    setIsProcessing(true);
    try {
      await api.put(`/api/todos/${id}/`, { title, description, priority, category, due_date });
      await fetchTodos();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this task?")) return;
    setIsProcessing(true);
    try {
      await api.delete(`/api/todos/${id}/`);
      await fetchTodos();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = async (id: number) => {
    setIsProcessing(true);
    try {
      await api.patch(`/api/todos/${id}/complete/`);
      await fetchTodos();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <CalendarIcon size={24} className="text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold font-poppins tracking-tight">Calendar</h2>
                  <p className="text-muted-foreground font-medium mt-1">View tasks by due date</p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Grid */}
              <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold font-poppins">{monthName}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest pb-2">
                      {day}
                    </div>
                  ))}

                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const tasksForDay = getTasksForDate(day);
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "aspect-square rounded-2xl border transition-all hover:bg-white/5 relative",
                          isSelected ? "bg-foreground text-background border-foreground" : "border-white/5 bg-white/[0.01]"
                        )}
                      >
                        <span className="text-sm font-bold">{day}</span>
                        {tasksForDay.length > 0 && (
                          <div className={cn(
                            "absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1",
                            isSelected && "opacity-70"
                          )}>
                            {tasksForDay.slice(0, 3).map((_, i) => (
                              <div key={i} className={cn(
                                "w-1 h-1 rounded-full",
                                isSelected ? "bg-background" : "bg-blue-500"
                              )} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Tasks */}
              <div className="lg:col-span-1">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sticky top-6">
                  <h3 className="text-lg font-bold font-poppins mb-4">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
                  </h3>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {selectedDateTasks.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-8">
                        No tasks for this date
                      </p>
                    ) : (
                      selectedDateTasks.map(task => (
                        <div key={task.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                          <p className="font-bold text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest",
                              task.priority === 'high' && "bg-red-500/10 text-red-500",
                              task.priority === 'medium' && "bg-blue-500/10 text-blue-500",
                              task.priority === 'low' && "bg-gray-500/10 text-gray-500"
                            )}>
                              {task.priority}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 text-muted-foreground uppercase tracking-widest">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Task List for Selected Date */}
            {selectedDate && selectedDateTasks.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-poppins">Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
                {selectedDateTasks.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    disabled={isProcessing}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## Testing Checklist

### Backend Tests
- [ ] Task model has new fields with correct types
- [ ] POST /api/todos/ with new fields succeeds
- [ ] POST /api/todos/ without new fields uses defaults
- [ ] PUT /api/todos/{id} updates new fields
- [ ] GET /api/todos/ returns new fields
- [ ] Invalid priority/category values return 422
- [ ] Invalid date format returns 422

### Frontend Tests
- [ ] Add task form includes priority, category, due date
- [ ] Task creation with all fields works
- [ ] Task creation with minimal fields (title only) works
- [ ] TodoItem displays priority/category/due_date badges
- [ ] Edit form allows updating priority/category/due_date
- [ ] Search filters tasks by title (case-insensitive)
- [ ] Priority filter works correctly
- [ ] Category filter works correctly
- [ ] Due date filters work (today, week, overdue, none)
- [ ] Clear filters button resets all filters
- [ ] Sidebar doesn't show "Notes" link
- [ ] Reminders page shows high-priority tasks
- [ ] Reminders page shows tasks due within 7 days
- [ ] Completed tasks don't appear in reminders
- [ ] Calendar page displays current month correctly
- [ ] Calendar page shows task indicators on dates
- [ ] Clicking calendar date filters tasks
- [ ] Month navigation (prev/next) works
- [ ] All features work on mobile viewport

---

## Deployment Notes

1. **Database Migration**: Run ALTER TABLE statements on production DB before deploying backend
2. **Environment Variables**: No new env vars required
3. **Backward Compatibility**: Existing frontend clients continue working (new fields have defaults)
4. **Rollback Plan**: Revert backend model changes; frontend handles missing fields gracefully

---

## Next Steps

After quickstart implementation:
1. Run `/sp.tasks` to generate detailed, testable implementation tasks
2. Execute tasks sequentially with tests after each phase
3. Create PR when all tests pass
4. Document any deviations or issues in implementation notes
