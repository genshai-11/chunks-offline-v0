# Theme 3 — CHUNKS Modular Learning Aesthetic

## Design Philosophy

Theme 3 is the **CHUNKS Modular Learning Aesthetic**: a focused dark learning instrument where knowledge modules feel like glowing, connectable chunks. It uses a deep void background, subtle node/grid textures, red radial energy, glass surfaces, and red-tinted shadows.

This is not a generic dark mode. It should feel modular, precise, alive, and engineered for learning focus.

## Tokens

- Background: `#0A0B0F` — Deep Focus Void
- Surface: `#111318` — Chunk Matte
- Foreground: `#FFFFFF` — Pure Clarity
- Muted: `#94A3B8` — Soft Metadata
- Border: `#1F2937` / `rgba(255,255,255,0.10)` — Subtle Structure
- Primary Accent: `#BF0709` — CHUNKS Logo Red
- Secondary Accent: `#9F0507` — Deep Ember
- Highlight: `#FF4D4F` — Vibrant Pop

## Typography

- Heading: Space Grotesk
- Body: Inter
- Data/Numbers: JetBrains Mono

## Background Texture

Use subtle modular grid and node/wave overlays through CSS, not heavy images. Backgrounds may include low-opacity red radial energy blurs positioned near focal areas.

## Components

### Buttons

Primary buttons are pill-shaped red energy CTAs:

- Gradient: `#9F0507` to `#BF0709`
- White uppercase text
- Red glow shadow
- Hover: small lift/scale and stronger glow
- Minimum height: 44px

### Cards

Lesson chunks and control cards:

- Background: `#111318`
- Border: `1px solid rgba(255,255,255,0.10)`
- Radius: `rounded-2xl`
- Red-tinted hover glow
- Decorative red corner accents where useful

### Inputs

- Background: black translucent
- Minimal bottom-border style
- Focus: CHUNKS red border and glow

### Icons

Use dependency-free inline SVG until an icon package is approved. Icons should feel technical and clean, with red accent containers when needed.

## Accessibility

- Preserve strong contrast.
- Focus rings use CHUNKS red.
- Touch targets remain at least 44px.
- Respect `prefers-reduced-motion` for glow/pulse animations.
