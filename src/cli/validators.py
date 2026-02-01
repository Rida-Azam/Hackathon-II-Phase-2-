"""
Input validators - Validation functions for user input.

This module provides centralized validation functions for title,
description, and integer parsing with consistent error handling.
"""


def validate_title(title: str) -> tuple[bool, str]:
    """
    Validate a task title.

    Args:
        title: The title string to validate

    Returns:
        Tuple of (is_valid, error_message)
        If valid, error_message is empty string
    """
    title = title.strip()

    if not title:
        return False, "Title is required."

    if len(title) > 200:
        return False, "Title must be 200 characters or less."

    return True, ""


def validate_description(description: str) -> tuple[bool, str]:
    """
    Validate a task description.

    Args:
        description: The description string to validate

    Returns:
        Tuple of (is_valid, error_message)
        If valid, error_message is empty string
    """
    description = description.strip()

    if len(description) > 1000:
        return False, "Description must be 1000 characters or less."

    return True, ""


def parse_int(value: str) -> int | None:
    """
    Parse a string to integer.

    Args:
        value: The string to parse

    Returns:
        The parsed integer, or None if invalid
    """
    try:
        return int(value.strip())
    except ValueError:
        return None
