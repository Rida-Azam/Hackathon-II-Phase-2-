"""
CLI Menu - Menu display and main application loop.

This module provides the menu interface and main loop that
dispatches user choices to the appropriate handlers.
"""

from src.services.task_service import TaskService
from src.cli.handlers import (
    handle_add_task,
    handle_view_tasks,
    handle_update_task,
    handle_delete_task,
    handle_toggle_task,
)

# Emoji icons for menu
ICON_ADD = chr(0x2795)       # ➕
ICON_VIEW = chr(0x1F4CB)     # 📋
ICON_UPDATE = chr(0x270F)    # ✏️
ICON_DELETE = chr(0x1F5D1)   # 🗑️
ICON_TOGGLE = chr(0x2705)    # ✅
ICON_EXIT = chr(0x1F6AA)     # 🚪


def display_welcome() -> None:
    """Display the welcome message when application starts."""
    print()
    print("=" * 54)
    print("          🎯 TODO APPLICATION - Phase I")
    print("=" * 54)
    print("Welcome! Manage your tasks with this simple app.")
    print()


def display_goodbye() -> None:
    """Display the goodbye message when application exits."""
    print()
    print("👋 Goodbye! Have a productive day! 👋")
    print()


def display_menu() -> None:
    """Display the main menu options."""
    print()
    print("+" + "-" * 34 + "+")
    print("|" + " " * 13 + "MAIN MENU" + " " * 13 + "|")
    print("+" + "-" * 34 + "+")
    print(f"|  1. {ICON_ADD} Add Task                |")
    print(f"|  2. {ICON_VIEW} View Tasks              |")
    print(f"|  3. {ICON_UPDATE} Update Task           |")
    print(f"|  4. {ICON_DELETE} Delete Task           |")
    print(f"|  5. {ICON_TOGGLE} Toggle Complete       |")
    print(f"|  0. {ICON_EXIT} Exit                    |")
    print("+" + "-" * 34 + "+")


def main_loop(service: TaskService) -> None:
    """
    Run the main application loop.

    Displays menu, accepts user input, and dispatches to handlers.
    Continues until user selects Exit (0).

    Args:
        service: The TaskService instance for task operations
    """
    while True:
        display_menu()
        choice = input(">> Enter your choice: ").strip()

        if choice == "0":
            break
        elif choice == "1":
            handle_add_task(service)
        elif choice == "2":
            handle_view_tasks(service)
        elif choice == "3":
            handle_update_task(service)
        elif choice == "4":
            handle_delete_task(service)
        elif choice == "5":
            handle_toggle_task(service)
        else:
            print()
            print("❌ [ERROR] Invalid choice. Please enter a number from the menu.")
