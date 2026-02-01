"""
Task model - Data structure for todo items.

This module defines the Task dataclass representing a single todo item
with id, title, description, completion status, category, and priority.
"""

from dataclasses import dataclass


@dataclass
class Task:
    """
    Represents a todo task item.

    Attributes:
        id: Unique identifier (auto-assigned, never reused after deletion)
        title: Task title (1-200 characters, required)
        description: Task description (0-1000 characters, optional)
        completed: Completion status (default False)
        category: Category emoji for the task (default 📌)
        priority: Priority emoji for the task (default 🟢)
    """

    id: int
    title: str
    description: str = ""
    completed: bool = False
    category: str = "📌"  # Default: Other
    priority: str = "🟢"  # Default: Low
