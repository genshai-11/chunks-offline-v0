# Design System: CHUNKS Mirror / Offline Live Room
**Project ID:** CHUNKS-OFFLINE-LIVE-ROOM

## Theme Options

CHUNKS supports two documented visual themes:

- **Theme 1 — Calm Classroom Console:** Coinbase-inspired editorial spacing, pill actions, soft cards, CHUNKS Red as the single primary brand/action color. This is the original baseline.
- **Theme 2 — Bauhaus Classroom Poster:** geometric Bauhaus style with primary color blocking, thick black borders, hard offset shadows, and Outfit typography. See [DESIGN-bauhaus.md](./DESIGN-bauhaus.md).
- **Theme 3 — CHUNKS Modular Learning Aesthetic:** deep focus void, modular grid texture, red radial energy, glass/chunk surfaces, red-glow CTAs, and technical SVG icon language. See [DESIGN-modular.md](./DESIGN-modular.md).
- **Theme 4 — Craft Minimal Chunking:** soft off-white canvas, charcoal typography, functional chunking colors, compact header, precise spacing, and minimal shadows. See [DESIGN-craft.md](./DESIGN-craft.md).

**Active default theme for the current frontend:** **Theme 2 — Bauhaus Classroom Poster**. Theme 3 and Theme 4 are available as additional selectable themes.

Theme changes must stay centralized in tokens and reusable primitives so Admin, Teacher, and Learner flows remain accessible and consistent. Theme 3 red glows, gradients, texture overlays, and dark surfaces, plus Theme 4 functional chunking colors and minimal light surfaces, must be implemented through CSS variables and reusable theme classes rather than one-off page styles.

## 1. Visual Theme & Atmosphere — Theme 1 Baseline
CHUNKS Theme 1 should feel like a calm, premium classroom control room: editorially spaced, bright, highly legible, and quietly confident. The structure borrows Coinbase's white-canvas discipline, pill-shaped actions, generous section rhythm, and dark product-console moments, but replaces Coinbase Blue with **CHUNKS Red (#cf202f)** as the single primary brand voltage.

The app must avoid noisy gamification even though the interaction is classroom-live. Teacher screens should feel controlled and operational; learner screens should feel simple, reassuring, and fast under pressure.

## 2. Color Palette & Roles
- **CHUNKS Red (#cf202f):** Primary brand/action color for CTAs, active route accents, selected Red response semantics, focus rings, and key inline emphasis. Use sparingly.
- **CHUNKS Red Active (#a91925):** Pressed/active state for primary CTAs.
- **Soft Red Disabled (#e6a1a8):** Disabled primary action tint when an action is unavailable.
- **Ink Black (#0a0b0d):** Primary headings, strong labels, and high-emphasis text.
- **Body Graphite (#5b616e):** Running text and secondary descriptions.
- **Muted Slate (#7c828a):** Helper text, timestamps, and less-important metadata.
- **White Canvas (#ffffff):** Default page background.
- **Soft Classroom Gray (#f7f7f7):** Alternating panels and quiet background bands.
- **Control Surface (#eef0f3):** Secondary button fills, search pills, resource chips, and icon plates.
- **Dark Console (#0a0b0d):** Teacher/live-room hero or control surfaces where focus should intensify.
- **Elevated Console (#16181c):** Floating cards on dark console sections.
- **Success Green (#05b169):** Green response semantics and successful status text; do not use as primary CTA.
- **Reflection Yellow (#f4b000):** Yellow response semantics and warning/attention states; use with restraint.
- **Hairline (#dee1e6):** Default dividers and card outlines.

## 3. Typography Rules
Use Inter or a similar neutral sans-serif as the default substitute for CoinbaseSans/CoinbaseDisplay. Display headlines use modest weight 400 with slight negative letter spacing to stay calm rather than loud. Body copy uses weight 400; component titles and buttons use weight 600. Numeric scoring values such as CCI, CPD, CVR, and reflection time should use JetBrains Mono, Geist Mono, or another tabular monospace at medium weight.

## 4. Component Stylings
* **Buttons:** Primary actions are pill-shaped with CHUNKS Red fill and white text. Secondary actions use soft gray fills with ink text.
* **Response Buttons:** Red, Yellow, and Green buttons are large, thumb-friendly, and clearly labeled with color plus meaning. Disabled buttons must show a nearby reason such as "Observing", "Already responded", or "Round closed".
* **Cards/Containers:** Feature cards and classroom state cards use generously rounded 24px corners, white background, and either a subtle hairline border or whisper-soft shadow. Dark teacher console cards use Elevated Console backgrounds with white text.
* **Inputs/Forms:** Inputs use 12px rounded corners, white fill, 1px hairline border, and a 2px CHUNKS Red focus ring. Search and room-code inputs may use pill geometry.
* **Badges/Status Pills:** Use pill-shaped badges for lobby, round open, round closed, assigned, observing, captured, and finished states.
* **Progress Cards:** CPD, CCI, CVR, and Reflection Time cards use monospace numbers, calm labels, and color only where it clarifies response meaning.

## 5. Layout Principles
Use a 4px spacing base with generous classroom breathing room: 16px for compact gaps, 24–32px for card interiors, 48px for major group spacing, and 80–96px for landing/entry bands. Desktop teacher views can use a two-column control layout: current sentence and controls on the left, roster and response summary on the right. Learner views should collapse into a single focused column with the sentence, response buttons, and progress cards in that order.

Keep the primary action count low per screen. Every screen should answer: "What is happening now?", "What can I do?", and "Why is an action unavailable?".
