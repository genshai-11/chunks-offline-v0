# Layout Components Inventory: src/components/layout

This document specifies the structural layout components defined in [src/components/layout](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout) of the frontend workspace.

---

## 1. ActionDock Component
* **Path**: [ActionDock.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/ActionDock.tsx)
* **Purpose**: A unified control bar that groups context metadata or labels on the left/top side and action controls (buttons) on the right side.
* **Component Definition**:
  ```typescript
  interface ActionDockProps {
    children: ReactNode
    className?: string
    label?: string // Default: 'Actions'
    meta?: ReactNode
  }
  ```
* **Styling & Layout**:
  * Root wrapper: `theme-card rounded-3xl border border-chunks-hairline bg-white p-4 shadow-soft`
  * Responsive flex positioning: `flex flex-col gap-3 md:flex-row md:items-center md:justify-between`
  * Child controls flex container: `flex flex-wrap gap-3`

---

## 2. AppShell Component
* **Path**: [AppShell.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/AppShell.tsx)
* **Purpose**: The main page shell wrapper. Controls top-level navigation placement, layout width bounds, and standardizes page header titles, subtitles, and metadata sections.
* **Component Definition**:
  ```typescript
  interface AppShellProps {
    action?: ReactNode
    children: ReactNode
    description?: ReactNode
    eyebrow?: string
    headerMeta?: ReactNode
    statusLabel?: string
    themeControl?: ReactNode
    title: ReactNode
  }
  ```
* **Layout Bounds**:
  * Outer shell: `.theme-shell min-h-[100dvh] bg-chunks-canvas text-chunks-ink`
  * Max-width inner wrapper: `mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8`
  * Responsive header grid: `grid gap-5 border-b border-chunks-hairline pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end`
  * Large title text: `.theme-hero-title mt-4 max-w-4xl text-4xl font-normal tracking-tight md:text-6xl`

---

## 3. TopNavigation Component
* **Path**: [TopNavigation.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/TopNavigation.tsx)
* **Purpose**: Renders the sticky top menu bar. Contains the home link brand logo, active menu navigation controls with SVG icons, and control utilities (e.g. theme toggle triggers and setup shortcut buttons).
* **Component Definition**:
  ```typescript
  interface NavItem {
    href: string
    label: string
    match: (pathname: string) => boolean
    icon: ReactNode
  }

  interface TopNavigationProps {
    action?: ReactNode
    pathname?: string // Default: window.location.pathname
    statusLabel?: string
    themeControl?: ReactNode
  }
  ```
* **Sticky Positioning & Blur**:
  * Root wrapper: `sticky top-0 z-20 border-b border-chunks-hairline bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85`
* **Navigation Links**:
  * Home (`/`, icon: `HomeIcon`)
  * Teacher Setup (`/teacher/setup`, icon: `TeacherIcon`)
  * Learner Play (`/room/demo`, icon: `LearnerIcon`)
  * Admin Settings (`/admin`, icon: `AdminIcon`)

---

## 4. WorkspaceLayout Component
* **Path**: [WorkspaceLayout.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/WorkspaceLayout.tsx)
* **Purpose**: A responsive two-column grid layout for structured page panels. Displays main content in the primary column and secondary details (such as lists or stats cards) in the sticky sidebar.
* **Component Definition**:
  ```typescript
  interface WorkspaceLayoutProps {
    primary: ReactNode
    secondary?: ReactNode
    className?: string // Default: ''
  }
  ```
* **CSS Grid Specification**:
  * Grid structure: `grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.72fr)]`
  * Sticky Sidebar behavior on large viewports: `xl:sticky xl:top-28 xl:self-start`
