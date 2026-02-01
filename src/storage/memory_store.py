"""
Memory Store - In-memory storage for Task entities.

This module provides the MemoryStore class for CRUD operations on tasks,
with auto-incrementing IDs that are never reused after deletion.
"""

from src.models.task import Task


class MemoryStore:
    """
    In-memory storage for Task entities.

    Manages a list of tasks with auto-incrementing IDs.
    IDs are never reused after deletion per spec requirement.
    """

    _next_id: int = 1  # Class-level counter, never reset or reused

    def __init__(self) -> None:
        """Initialize an empty task store."""
        self._tasks: list[Task] = []

    def add(
        self,
        title: str,
        description: str = "",
        category: str = "📌",
        priority: str = "🟢",
    ) -> Task:
        """
        Create and store a new task.

        Args:
            title: Task title (required)
            description: Task description (optional, defaults to empty)
            category: Category emoji (defaults to 📌 Other)
            priority: Priority emoji (defaults to 🟢 Low)

        Returns:
            The created Task with auto-assigned ID
        """
        task = Task(
            id=MemoryStore._next_id,
            title=title,
            description=description,
            completed=False,
            category=category,
            priority=priority,
        )
        MemoryStore._next_id += 1
        self._tasks.append(task)
        return task

    def get(self, task_id: int) -> Task | None:
        """
        Retrieve a task by ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task if found, None otherwise
        """
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def get_all(self) -> list[Task]:
        """
        Retrieve all tasks.

        Returns:
            List of all tasks (may be empty)
        """
        return list(self._tasks)

    def update(
        self,
        task_id: int,
        title: str | None = None,
        description: str | None = None,
        category: str | None = None,
        priority: str | None = None,
    ) -> Task | None:
        """
        Update a task's title, description, category, and/or priority.

        Args:
            task_id: The ID of the task to update
            title: New title (None to keep current)
            description: New description (None to keep current)
            category: New category (None to keep current)
            priority: New priority (None to keep current)

        Returns:
            The updated Task if found, None otherwise
        """
        task = self.get(task_id)
        if task is None:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if category is not None:
            task.category = category
        if priority is not None:
            task.priority = priority

        return task

    def delete(self, task_id: int) -> bool:
        """
        Delete a task by ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if deleted, False if not found
        """
        task = self.get(task_id)
        if task is None:
            return False

        self._tasks.remove(task)
        return True

    def toggle_complete(self, task_id: int) -> Task | None:
        """
        Toggle a task's completed status.

        Args:
            task_id: The ID of the task to toggle

        Returns:
            The updated Task if found, None otherwise
        """
        task = self.get(task_id)
        if task is None:
            return None

        task.completed = not task.completed
        return task
