# Research: Premium Black Theme

## Decision 1: Pure Black vs. Soft Black
- **Decision**: Primary background will be #000000 (Pure Black) for the "absolute" immersion requested, but secondary surfaces (cards, sidebars) will use #0a0a0a or #111111 for depth.
- **Rationale**: User explicitly requested "Pure black/dark background (#000)". To avoid halation, text will be off-white (#EDEDED).
- **Alternatives considered**: #121212 (standard Material Design Dark) - rejected because it's not "black" enough for the high-end aesthetic requested.

## Decision 2: Typography & Weights
- **Decision**: Use `Poppins` (Headings, 700) and `Inter` (Body, 400/500/600).
- **Rationale**: Poppins provides the "premium/bold" look for CTA headlines, while Inter maintains high legibility on dark backgrounds.
- **Alternatives considered**: Manrope - rejected as Inter is more industry-standard for productivity apps (Linear, Vercel).

## Decision 3: Depth & Glassmorphism
- **Decision**: Use 1px borders with 10% white opacity (`border-white/10`) and `backdrop-blur-xl`.
- **Rationale**: Shadows are ineffective on #000 backgrounds. Borders are the primary way to define container edges in pure black themes.
- **Alternatives considered**: Intense gradients - rejected to keep the "flat/minimalist" requirement.

## Decision 4: Animation Library
- **Decision**: Framer Motion for entry transitions and hover effects.
- **Rationale**: Smooth `scale-105` and `fade-in` are best-in-class features of Framer Motion, which integrates perfectly with Next.js App Router.
- **Alternatives considered**: Raw CSS - rejected for complex entry orchestrations.

## Decision 5: Icons
- **Decision**: Lucide React with `strokeWidth={1.5}`.
- **Rationale**: Thinner strokes match the "premium/minimalist" productivity look of modern SaaS tools.
- **Alternatives considered**: FontAwesome - rejected as too "standard" and bulky.
