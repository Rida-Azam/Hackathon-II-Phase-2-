# Research: High-Fidelity Minimalist Dark Themes in Next.js 15+

## 1. Preventing "Dark Mode Flicker" (FOUC)
**Decision:** Use the "Blocking Script" strategy via `next-themes` or a manual inline `<script>`.

- **Mechanism:** In Next.js 15+ (App Router), the server cannot know the user's `localStorage` preference. To prevent the flash of light mode, a small blocking script must be injected into the `<head>` to apply the `dark` class before the body renders.
- **Tailwind v4 Note:** Tailwind v4 moves away from `tailwind.config.js`. The `dark` variant must be explicitly defined in `globals.css` using `@custom-variant dark (&:where(.dark, .dark *));`.
- **Implementation:**
  - Standard: Use `next-themes` with the `ThemeProvider` wrapping the layout.
  - Manual: Inject a `dangerouslySetInnerHTML` script in `layout.tsx` that checks `localStorage` and `prefers-color-scheme`.

## 2. Minimalist Color Palettes & Accessibility
**Decision:** Prioritize "Soft Dark" (#121212) for general use and "OLED Black" (#000000) for high-end minimalist aesthetics.

- **Palette A (Material Minimalist):**
  - Background: `#121212`
  - Surface/Cards: `#1E1E1E`
  - Text: High-contrast white (`#FFFFFF`) at 87-100% opacity.
  - *Benefit:* Reduces eye strain and allows for better depth/shadow representation.
- **Palette B (OLED/Luxury):**
  - Background: `#000000`
  - Borders: `#333333`
  - Text: Off-white (`#EDEDED`) to prevent "halation" (glowing effect) on black backgrounds.
- **Accessibility (WCAG AA):** Maintain a contrast ratio of at least 4.5:1. Avoid pure white text on pure black for long-form content to assist users with astigmatism.

## 3. Tailwind Config & Custom Fonts (Next.js 15 + Tailwind v4)
**Decision:** Use the "CSS-First" approach with `@theme` variables.

- **Setup:** Import fonts (Inter/Poppins) via `next/font/google` in `layout.tsx` and assign them to CSS variables (e.g., `--font-inter`).
- **Theming:** In `globals.css`, use the `@theme` block to map these variables:
  ```css
  @theme {
    --font-sans: var(--font-inter), ui-sans-serif;
    --font-display: var(--font-poppins);
    --color-background: #000000;
    --color-primary: #ffffff;
  }
  ```
- **Benefit:** Eliminates the need for a heavy `tailwind.config.js` and leverages native CSS variables for faster builds and runtime theme switching.

## 4. Glassmorphism Techniques
**Decision:** Implement the "Frosted Glass" formula using `backdrop-blur` and semi-transparent borders.

- **The Formula:**
  - `bg-white/10` (or `bg-black/20` for dark glass).
  - `backdrop-blur-md` to `backdrop-blur-xl`.
  - `border border-white/20` to define the edges.
  - `shadow-2xl` for depth.
- **Performance:** Limit the use of `backdrop-blur` on large numbers of elements as it is computationally expensive. Provide a fallback `background-color` for browsers that do not support backdrop filters.

## 5. Persistence Strategy
**Decision:** Use `localStorage` for client-side persistence with a `mounted` check to prevent hydration mismatches.

- **Toggle:** Create a client component for the theme toggle.
- **Hydration Guard:** Always wrap theme-dependent icons/UI in a `mounted` check (via `useEffect`) to ensure the server-rendered HTML matches the initial client render.

---
### Sources
- [Next.js 15 Dark Mode Guide](https://www.sujalvanjare.com/blog/dark-mode-nextjs15-tailwind-v4)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/theme)
- [Fixing FOUC in Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Material Design Dark Theme Standards](https://dev.to/topboyasante/setting-up-dark-mode-in-next-js-with-tailwindcss-1bk1)
- [Glassmorphism Implementation](https://flyonui.com/blog/glassmorphism-with-tailwind-css/)
