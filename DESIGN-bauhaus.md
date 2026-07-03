# Design System Theme 2: CHUNKS Bauhaus

**Status:** Supported alternate theme / active Theme 2 option  
**Project ID:** CHUNKS-OFFLINE-LIVE-ROOM

## 1. Design Philosophy
Theme 2 uses Bauhaus / constructivist modernism: **form follows function**, pure geometry, primary color blocking, thick black borders, and hard offset shadows. The interface should feel like a live classroom control room reconstructed as a Bauhaus poster: bold, geometric, readable, and deliberately functional.

**Vibe:** Constructivist, geometric, modernist, artistic-yet-functional, bold, architectural.

## 2. Tokens

### Colors
- `background`: `#F0F0F0`
- `foreground`: `#121212`
- `primary-red`: `#D02020`
- `primary-blue`: `#1040C0`
- `primary-yellow`: `#F0C020`
- `border`: `#121212`
- `muted`: `#E0E0E0`
- `success-green`: `#05B169`

### Typography
- Font family: `Outfit`, fallback `Inter`, system sans-serif
- Import: `Outfit:wght@400;500;700;900`
- Headlines: uppercase, `font-black`, tight tracking, strong geometric scale
- Labels/buttons: uppercase, bold, wide tracking
- Body: medium weight, highly legible
- Numbers/scoring: keep monospace for CCI/CPD/CVR values

### Shape
- Radius is binary:
  - `rounded-none` for cards/buttons/panels
  - `rounded-full` for badges/circles/geometric markers
- Borders:
  - major panels/cards/buttons use 2px–4px black borders
  - dividers use hard black lines

### Shadows
Use hard offset shadows only:
- Small: `4px 4px 0 #121212`
- Large: `8px 8px 0 #121212`
- No blur, no soft elevation.

## 3. Component Rules

### Buttons
- Primary: red fill, white text, black border, hard shadow
- Secondary: yellow or white fill, black text, black border, hard shadow
- Active press: translate down/right and remove shadow
- Typography: uppercase, bold, tracking-wide

### Cards
- White/off-white surface
- 4px black border
- hard black shadow
- optional geometric corner decoration

### Badges
- Pill or hard rectangular label depending context
- Uppercase, bold, wide tracking

### Live Room UI
- Teacher control panels can use black/blue/yellow color blocking.
- Learner response buttons keep semantic Red / Yellow / Green clarity; do not let decorative color blocking obscure response meaning.
- Disabled learner buttons still need clear text reasons.

## 4. Layout
- Main sections use poster-like breadth and strong vertical rhythm.
- Desktop can use asymmetric two-column layouts.
- Mobile remains single-column and accessibility-first.
- Section dividers should be thick, visible, and geometric.

## 5. Mandatory Non-Generic Choices
- Use geometric logo/markers: circle, square, triangle.
- Use primary-color blocks: red, blue, yellow.
- Use hard shadows instead of soft shadows.
- Use visible black borders on major UI surfaces.
- Use uppercase geometric display typography.

## 6. Accessibility Constraints
- Keep response states readable under pressure.
- Preserve 44px minimum touch targets.
- Maintain visible focus rings.
- Never rely on color alone for Red / Yellow / Green response meaning.

## 7. Implementation Notes
- This theme should be implemented through centralized CSS variables and reusable UI primitives.
- Avoid one-off Tailwind hex values in feature pages.
- Theme switching should be reversible: `calm` Theme 1 and `bauhaus` Theme 2 should share component APIs.
