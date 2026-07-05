# UI Components Inventory: src/components/ui

This document specifies the current reusable UI components defined in [src/components/ui](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui) of the frontend workspace.

---

## 1. Alert Component
* **Path**: [Alert.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Alert.tsx)
* **Purpose**: Displays system alerts, warnings, errors, or success logs to the user.
* **Component Definition**:
  ```typescript
  type Tone = 'info' | 'warning' | 'error' | 'success'

  interface AlertProps {
    children: ReactNode
    className?: string
    title: string
    tone?: Tone
  }
  ```
* **Tone Classes Mapping**:
  * `info`: `border-chunks-hairline bg-chunks-soft text-chunks-body`
  * `warning`: `border-yellow-200 bg-yellow-50 text-yellow-800`
  * `error`: `border-red-200 bg-red-50 text-red-800`
  * `success`: `border-green-200 bg-green-50 text-green-800`

---

## 2. Button & ButtonLink Components
* **Path**: [Button.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Button.tsx)
* **Purpose**: Interactive control buttons (`Button` using `<button>`) and navigation links (`ButtonLink` using `<a>`) configured with theme classes.
* **Component Definition**:
  ```typescript
  type Variant = 'primary' | 'secondary'

  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: Variant
  }

  interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children: ReactNode
    variant?: Variant
  }
  ```
* **Variants CSS Mapping**:
  * `primary`: `bg-chunks-red text-white hover:bg-chunks-red-active`
  * `secondary`: `bg-chunks-control text-chunks-ink hover:bg-chunks-hairline`
* **Additional Styling**: Applies standard interactive styles including `.theme-button`, hover states, and disabled styling (`disabled:bg-chunks-red-disabled` for buttons).

---

## 3. Card Component
* **Path**: [Card.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Card.tsx)
* **Purpose**: General layout containers that support HTML tags polymorphism and style variations.
* **Component Definition**:
  ```typescript
  interface CardProps extends HTMLAttributes<HTMLElement> {
    as?: ElementType // Default: 'div'
    children: ReactNode
    className?: string
    variant?: 'light' | 'dark' // Default: 'light'
  }
  ```
* **Styles Breakdown**:
  * `dark` variant: `theme-card theme-card-dark bg-chunks-dark p-6 text-white shadow-soft rounded-[2rem]`
  * `light` variant: `theme-card rounded-3xl border border-chunks-hairline bg-white p-6 shadow-soft`

---

## 4. CollapsiblePanel Component
* **Path**: [CollapsiblePanel.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/CollapsiblePanel.tsx)
* **Purpose**: Renders collapsible cards with action bars and summaries. Automatically persists the open/close state inside `window.localStorage` per panel ID.
* **Component Definition**:
  ```typescript
  interface CollapsiblePanelProps {
    actions?: ReactNode
    children: ReactNode
    className?: string
    defaultOpen?: boolean // Default: true
    panelId: string
    summary?: ReactNode
    title: ReactNode
    variant?: 'light' | 'dark' // Default: 'light'
  }
  ```
* **Features**:
  * Uses `localStorage.getItem('chunks-panel:{panelId}')` to restore state.
  * Handles accessibility requirements (`aria-controls`, `aria-expanded`).
  * Features a status button detailing a list of operations (`+` or `−`).

---

## 5. StatusBadge Component
* **Path**: [StatusBadge.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/StatusBadge.tsx)
* **Purpose**: Simple colored badges for displaying state indicators.
* **Component Definition**:
  ```typescript
  type Tone = 'brand' | 'success' | 'warning' | 'error' | 'neutral'

  interface StatusBadgeProps {
    children: ReactNode
    tone?: Tone // Default: 'neutral'
  }
  ```
* **Tone Classes Mapping**:
  * `brand`: `bg-chunks-control text-chunks-red`
  * `success`: `bg-green-50 text-chunks-green`
  * `warning`: `bg-yellow-50 text-yellow-700`
  * `error`: `bg-red-50 text-red-700`
  * `neutral`: `bg-chunks-control text-chunks-ink`

---

## 6. ThemeSwitcher & ThemeIconToggle Components
* **Path**: [ThemeSwitcher.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/ThemeSwitcher.tsx)
* **Purpose**: Component utilities to handle the theme selection process. Controls 4 active design modes (`calm`, `bauhaus`, `modular`, `craft`).
* **Component Definition**:
  ```typescript
  type ThemeName = 'calm' | 'bauhaus' | 'modular' | 'craft'

  interface ThemeSwitcherProps {
    activeTheme: ThemeName
    onThemeChange: (theme: ThemeName) => void
  }
  ```
* **Render Modes**:
  * `ThemeSwitcher`: Comprehensive settings card with layout labels, descriptions, and radio option grids.
  * `ThemeIconToggle`: A simple inline action button toggling icons representing each theme (`CalmThemeIcon`, `BauhausThemeIcon`, `ModularThemeIcon`, `CraftThemeIcon`).
