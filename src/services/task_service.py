"""
Task Service - Business logic for task operations.

This module provides the TaskService class that orchestrates
task operations with validation and storage interaction.
"""

from src.models.task import Task
from src.storage.memory_store import MemoryStore
from src.cli.validators import validate_title, validate_description


class TaskService:
    """
    Business logic service for task operations.

    Orchestrates validation and storage operations for tasks.
    """

    def __init__(self, store: MemoryStore) -> None:
        """
        Initialize the service with a storage backend.

        Args:
            store: The MemoryStore instance for data persistence
        """
        self._store = store

    def add_task(
        self,
        title: str,
        description: str = "",
        category: str = "📌",
        priority: str = "🟢",
    ) -> Task:
        """
        Add a new task after validation.

        Args:
            title: Task title (required, 1-200 characters)
            description: Task description (optional, max 1000 characters)
            category: Category emoji (defaults to 📌 Other)
            priority: Priority emoji (defaults to 🟢 Low)

        Returns:
            The created Task

        Raises:
            ValueError: If title or description validation fails
        """
        # Validate title
        is_valid, error = validate_title(title)
        if not is_valid:
            raise ValueError(error)

        # Validate description
        is_valid, error = validate_description(description)
        if not is_valid:
            raise ValueError(error)

        # Create task via storage
        return self._store.add(title.strip(), description.strip(), category, priority)

    def get_all_tasks(self) -> list[Task]:
        """
        Get all tasks.

        Returns:
            List of all tasks (may be empty)
        """
        return self._store.get_all()

    def get_task(self, task_id: int) -> Task | None:
        """
        Get a task by ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task if found, None otherwise
        """
        return self._store.get(task_id)

    def update_task(
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

        Raises:
            ValueError: If title or description validation fails
        """
        # Validate title if provided
        if title is not None:
            is_valid, error = validate_title(title)
            if not is_valid:
                raise ValueError(error)
            title = title.strip()

        # Validate description if provided
        if description is not None:
            is_valid, error = validate_description(description)
            if not is_valid:
                raise ValueError(error)
            description = description.strip()

        return self._store.update(task_id, title, description, category, priority)

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if deleted, False if not found
        """
        return self._store.delete(task_id)

    def toggle_task(self, task_id: int) -> Task | None:
        """
        Toggle a task's completion status.

        Args:
            task_id: The ID of the task to toggle

        Returns:
            The updated Task if found, None otherwise
        """
        return self._store.toggle_complete(task_id)
