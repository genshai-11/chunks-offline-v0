# Theme 4 — Craft Minimal Chunking

## Design Philosophy

Theme 4 follows **Craftsmanship over Defaults**: a clean, high-contrast, light interface that uses generous negative space, precise typography, and functional chunking colors. It avoids decorative noise, fake telemetry, heavy gradients, and excessive shadows.

The theme is designed for direct classroom operation and content clarity. Every visible element should have a purpose.

## Core Colors

- Primary Accent: `#DC2626` / `#C10B0D` — CHUNKS red for primary actions, active states, tags, and hover highlights.
- Dark Neutral: `#171717` — headings, strong text, dark header variants, and deep interactive surfaces.
- Light Neutral: `#F9FAFB` / `#F3F4F6` / `#FAF9F6` — page canvas, content surfaces, separators.

## Functional Chunking Colors

These colors are semantic learning aids, not decoration:

- Gap Fillers: `#1D4ED8` blue
- Sentence Frames: `#D97706` amber
- Idioms & Collocations: `#059669` emerald
- Key Terms: `#DC2626` red

## Typography

- Sans: Inter for body and navigation.
- Display: Space Grotesk or Outfit for large headings and CHUNKS wordmark.
- Mono: JetBrains Mono / SFMono for counts, selection state, scoring, and grammar metadata.

## Navigation

- Compact header.
- Typography-based CHUNKS wordmark.
- Minimal icon buttons.
- Optional quick search can be added later, but the first pass keeps the header slim.

## Components

### Buttons

- Primary: red, pill-like or softly rounded, high contrast.
- Secondary: neutral surface, charcoal text.
- Hover: subtle lift only, no red glow.
- Minimum height: 44px.

### Cards

- Light neutral backgrounds.
- Soft border `#E5E7EB`.
- Radius `rounded-2xl`.
- Shadow minimal: `shadow-sm` or none.

### Inputs

- White/off-white background.
- Neutral border.
- Red focus ring.
- Clear labels above fields.

## Motion

- Purposeful and fast: 200ms to 300ms.
- Hover uses subtle `translate-y[-2px]` or `scale-[1.02]`.
- Loading should use soft shimmer, not distracting spinners.

## Accessibility

- Excellent contrast.
- Clear keyboard focus.
- 44px touch targets.
- Semantic structure and purposeful content only.
