# Layout Redesign: Dynamic Classroom Workspace

**Feature**: CHUNKS Mirror / Offline Live Room Frontend  
**Date**: 2026-07-03 21:24 GMT+7  
**Status**: Approved for Phase 3A implementation

## Goals

- Replace full-spread pages with a compact, responsive app workspace.
- Add persistent top navigation across current routes.
- Allow operational panels to hide and expand on demand.
- Keep Teacher setup and Teacher live control focused on the current classroom action.
- Preserve Theme 2 as a white-canvas Bauhaus style.
- Keep topic/section selection database-backed; no synthetic topic rows.

## Layout Model

```text
AppShell
├── TopNavigation
├── compact PageHeader
└── WorkspaceLayout
    ├── Primary area
    └── Secondary rail
        └── CollapsiblePanel instances

ActionDock can be used inside either area for sticky primary controls.
```

## Components

### AppShell
Centralizes route chrome, white canvas, max-width, page header, and theme switcher slot.

### TopNavigation
Provides route navigation for Home, Teacher, Learner, and Admin. It remains compact and responsive.

### WorkspaceLayout
Responsive grid for operational screens:

- Desktop: primary area + secondary rail.
- Mobile: single-column layout.
- No horizontal overflow.

### ActionDock
Groups primary actions near the current context. It can be sticky on larger screens and stacked on mobile.

### CollapsiblePanel
Accessible hide/expand container with localStorage persistence by panel ID.

## Teacher Setup Structure

```text
Primary
├── Resource Scope panel
│   ├── Course
│   ├── Lesson
│   └── database lesson_sections checkboxes
└── Room Settings panel
    ├── Title
    ├── Host
    ├── CCI
    └── Capture mode

Secondary
└── Ready Check panel
    ├── filtered resource count
    ├── selected database sections count
    └── create room action dock
```

## Teacher Room Structure

```text
Primary
├── Current Sentence Window
└── Round Settings panel

Secondary
├── Share Link panel
└── Roster panel

ActionDock
├── Open round
├── Close round
├── Advance
└── Finish room
```

## Theme 2 Rules

- Page background stays `#ffffff`.
- Bauhaus identity comes from borders, hard offset shadows, labels, typography, and selected surfaces.
- No whole-page dotted/gray wallpaper.
- Touch targets remain at least 44px.
- Focus rings remain visible.

## Validation

- `npm test`
- `npm run build`
- targeted Playwright navigation/layout checks
