"""
Todo Application - Main Entry Point

Phase I: In-Memory Python Console Todo Application

This is the entry point for the Todo application. It initializes the
storage and service layers, then runs the main menu loop.

Usage:
    python -m src.main
"""

import sys
import io

# Force UTF-8 encoding for Windows compatibility
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(
        sys.stdout.buffer, encoding='utf-8', errors='replace'
    )
    sys.stderr = io.TextIOWrapper(
        sys.stderr.buffer, encoding='utf-8', errors='replace'
    )

from src.storage.memory_store import MemoryStore
from src.services.task_service import TaskService
from src.cli.menu import main_loop, display_welcome, display_goodbye


def main() -> None:
    """
    Main function - Application entry point.

    Initializes services and runs the main application loop.
    """
    # Initialize storage and service
    store = MemoryStore()
    service = TaskService(store)

    # Display welcome message
    display_welcome()

    # Run main loop
    main_loop(service)

    # Display goodbye message
    display_goodbye()


if __name__ == "__main__":
    main()
