"""
CLI Handlers - Action handlers for menu options.

This module provides handler functions for each menu action:
add, view, update, delete, and toggle task completion.
"""

from src.services.task_service import TaskService
from src.cli.validators import parse_int

# Emojis for status and feedback
EMOJI_SUCCESS = "✅"
EMOJI_ERROR = "❌"
EMOJI_INFO = "ℹ️"
EMOJI_WARNING = "⚠️"
EMOJI_DONE = "✅"
EMOJI_TODO = "⬜"

# Priority emojis
PRIORITY_HIGH = "🔴"
PRIORITY_MEDIUM = "🟡"
PRIORITY_LOW = "🟢"

# Category emojis
CATEGORY_WORK = "💼"
CATEGORY_HOME = "🏠"
CATEGORY_HEALTH = "💪"
CATEGORY_SHOPPING = "🛒"
CATEGORY_PERSONAL = "🎯"
CATEGORY_OTHER = "📌"


def handle_add_task(service: TaskService) -> None:
    """
    Handle the Add Task action.

    Prompts for title (required), description (optional),
    category, and priority. Validates input and creates the task.

    Args:
        service: The TaskService instance
    """
    print()

    # Get title (required)
    title = input("📝 Enter task title: ")

    # Get description (optional)
    description = input("📄 Enter task description (press Enter to skip): ")

    # Get category
    print("📁 Select category:")
    print("  1. 💼 Work")
    print("  2. 🏠 Home")
    print("  3. 💪 Health")
    print("  4. 🛒 Shopping")
    print("  5. 🎯 Personal")
    print("  6. 📌 Other")
    category_choice = input(">> Enter choice (1-6, default 6): ").strip()
    category_map = {
        "1": CATEGORY_WORK,
        "2": CATEGORY_HOME,
        "3": CATEGORY_HEALTH,
        "4": CATEGORY_SHOPPING,
        "5": CATEGORY_PERSONAL,
        "6": CATEGORY_OTHER,
    }
    category = category_map.get(category_choice, CATEGORY_OTHER)

    # Get priority
    print("⚡ Select priority:")
    print("  1. 🔴 High")
    print("  2. 🟡 Medium")
    print("  3. 🟢 Low")
    priority_choice = input(">> Enter choice (1-3, default 3): ").strip()
    priority_map = {
        "1": PRIORITY_HIGH,
        "2": PRIORITY_MEDIUM,
        "3": PRIORITY_LOW,
    }
    priority = priority_map.get(priority_choice, PRIORITY_LOW)

    try:
        task = service.add_task(title, description, category, priority)
        print(f"{EMOJI_SUCCESS} Task added successfully!")
    except ValueError as e:
        print(f"{EMOJI_ERROR} {str(e)}")


def handle_view_tasks(service: TaskService) -> None:
    """
    Handle the View Tasks action.

    Displays all tasks in a formatted list with ID, status, title,
    category, and priority emojis.

    Args:
        service: The TaskService instance
    """
    print()
    tasks = service.get_all_tasks()

    if not tasks:
        print(f"{EMOJI_INFO} No tasks found. Add your first task! 📝")
        return

    print()
    print("=" * 74)
    print("                               📋 YOUR TASKS")
    print("=" * 74)
    print(f"{'ID':<3} | {'Status':<8} | {'Title':<22} | {'Description':<26} | {'Cat':<5} | {'Prio'}")
    print("=======+===========+========================+============================+=======+=======")

    for task in tasks:
        status = f"{EMOJI_DONE} Done" if task.completed else f"{EMOJI_TODO} Todo"
        # Truncate title if too long for display
        display_title = task.title[:21] + "..." if len(task.title) > 21 else task.title
        # Truncate description if too long for display
        display_desc = task.description[:25] + "..." if len(task.description) > 25 else task.description
        # Format row with proper column alignment
        print(f"{task.id:<3} | {status:<8} | {display_title:<22} | {display_desc:<25} | {task.category:<5} | {task.priority}")

    print("=" * 74)
    print(f"{EMOJI_INFO} Total: {len(tasks)} task(s)")
    completed = sum(1 for t in tasks if t.completed)
    pending = len(tasks) - completed
    print(f"   Completed: {completed} {EMOJI_DONE}  |  Pending: {pending} {EMOJI_TODO}")


def handle_update_task(service: TaskService) -> None:
    """
    Handle the Update Task action.

    Prompts for task ID, then new title, description, category, and priority.
    Keeps original values if user presses Enter without input.

    Args:
        service: The TaskService instance
    """
    print()

    # Get task ID
    id_input = input("🔢 Enter task ID to update: ")
    task_id = parse_int(id_input)

    if task_id is None:
        print(f"{EMOJI_ERROR} ❌ Please enter a valid number.")
        return

    # Check if task exists
    task = service.get_task(task_id)
    if task is None:
        print(f"{EMOJI_ERROR} ❌ Task with ID {task_id} not found.")
        return

    print(f"📝 Current title: {task.title}")
    new_title = input("✏️  Enter new title (press Enter to keep current): ")

    print(f"📄 Current description: {task.description or '(empty)'}")
    new_description = input("✏️  Enter new description (press Enter to keep current): ")

    # Get new category
    print(f"📁 Current category: {task.category}")
    print("  1. 💼 Work")
    print("  2. 🏠 Home")
    print("  3. 💪 Health")
    print("  4. 🛒 Shopping")
    print("  5. 🎯 Personal")
    print("  6. 📌 Other")
    category_choice = input(">> Enter new category (1-6, press Enter to keep): ").strip()
    category_map = {
        "1": CATEGORY_WORK,
        "2": CATEGORY_HOME,
        "3": CATEGORY_HEALTH,
        "4": CATEGORY_SHOPPING,
        "5": CATEGORY_PERSONAL,
        "6": CATEGORY_OTHER,
    }
    new_category = category_map.get(category_choice)

    # Get new priority
    print(f"⚡ Current priority: {task.priority}")
    print("  1. 🔴 High")
    print("  2. 🟡 Medium")
    print("  3. 🟢 Low")
    priority_choice = input(">> Enter new priority (1-3, press Enter to keep): ").strip()
    priority_map = {
        "1": PRIORITY_HIGH,
        "2": PRIORITY_MEDIUM,
        "3": PRIORITY_LOW,
    }
    new_priority = priority_map.get(priority_choice)

    # Determine what to update
    title_to_update = new_title.strip() if new_title.strip() else None
    desc_to_update = new_description if new_description else None
    if new_description == "":
        desc_to_update = None

    try:
        result = service.update_task(
            task_id, title_to_update, desc_to_update, new_category, new_priority
        )
        if result:
            print(f"{EMOJI_SUCCESS} ✅ Task {task_id} updated successfully!")
        else:
            print(f"{EMOJI_ERROR} ❌ Task with ID {task_id} not found.")
    except ValueError as e:
        print(f"{EMOJI_ERROR} ❌ {str(e)}")


def handle_delete_task(service: TaskService) -> None:
    """
    Handle the Delete Task action.

    Prompts for task ID and confirmation before deletion.

    Args:
        service: The TaskService instance
    """
    print()

    # Get task ID
    id_input = input("🔢 Enter task ID to delete: ")
    task_id = parse_int(id_input)

    if task_id is None:
        print(f"{EMOJI_ERROR} ❌ Please enter a valid number.")
        return

    # Check if task exists
    task = service.get_task(task_id)
    if task is None:
        print(f"{EMOJI_ERROR} ❌ Task with ID {task_id} not found.")
        return

    # Confirm deletion
    confirm = input(f"🗑️  Delete task {task_id} '{task.title}'? (y/n): ")

    if confirm.lower() == "y":
        service.delete_task(task_id)
        print(f"{EMOJI_SUCCESS} ✅ Task {task_id} deleted.")
    else:
        print(f"{EMOJI_INFO} ℹ️ Deletion cancelled.")


def handle_toggle_task(service: TaskService) -> None:
    """
    Handle the Toggle Complete/Incomplete action.

    Prompts for task ID and toggles its completion status.

    Args:
        service: The TaskService instance
    """
    print()

    # Get task ID
    id_input = input("🔢 Enter task ID to toggle: ")
    task_id = parse_int(id_input)

    if task_id is None:
        print(f"{EMOJI_ERROR} ❌ Please enter a valid number.")
        return

    # Toggle the task
    task = service.toggle_task(task_id)

    if task is None:
        print(f"{EMOJI_ERROR} ❌ Task with ID {task_id} not found.")
        return

    if task.completed:
        print(f"{EMOJI_SUCCESS} ✅ Task {task_id} marked as complete! 🎉")
    else:
        print(f"{EMOJI_WARNING} ⚠️ Task {task_id} marked as incomplete.")
