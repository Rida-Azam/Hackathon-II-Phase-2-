# Data Model: Premium Black Theme Update

**Branch**: `007-premium-black-theme` | **Date**: 2026-01-03 | **Spec**: [./spec.md](./spec.md)

## Summary
This feature focus is purely on UI/UX redesign. No changes to the core Task or User data models are required.

## UI Entities (Next.js Props/State)

### 1. Feature Card
Used for the Landing Page hero section.

| Attribute | Type | Description |
|-----------|------|-------------|
| `icon` | `LucideIcon` | Icon component from lucide-react |
| `title` | `string` | Short title (e.g., "Task Management") |
| `description` | `string` | Brief value proposition |

### 2. Button Variant
Standardized across landing, login, and signup.

| Variant | Colors | Behavior |
|---------|--------|----------|
| `primary` | bg-blue-600, text-white | Scale 105 on hover, glow |
| `outline` | border-blue-600, text-blue-600 | Brightness increase on hover |
| `ghost` | transparent, text-muted | Underline on hover |

## Themes (Tailwind CSS Variables)

```css
:root {
  --background: #000000;
  --foreground: #EDEDED;
  --card: #111111;
  --card-foreground: #EDEDED;
  --primary: #3B82F6;
  --primary-foreground: #FFFFFF;
  --border: #222222;
  --input: #1A1A1A;
}
```
