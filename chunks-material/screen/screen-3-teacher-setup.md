# Screen 3: Teacher Setup Page

## 1. Metadata
* **Route / Path**: `/teacher/setup`
* **Parent Component**: `TeacherSetupPage` inside [TeacherSetupPage.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/teacher/TeacherSetupPage.tsx)
* **Purpose**: Allows teachers to define the scope of sentence resources and configure live room settings (scoring mode, default response capture mode, target CCI standard) before starting a practice session.

---

## 2. Layout Structure
* **AppShell Container**: Wraps the screen with a standard navigation header ([TopNavigation.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/TopNavigation.tsx)), eyebrow ("Teacher Host"), title ("Create a live room."), description, and headerMeta.
  * `headerMeta`: A card displaying the active configuration summary (`selectedSectionIds.length`/`sectionsForLesson.length` sections and resource counts).
* **WorkspaceLayout Split Grid**:
  * **Primary (Left/Top Column)**: Displays collapsible setup panels.
  * **Secondary (Right/Bottom Column)**: Displays a live checklist review of configuration settings.

---

## 3. Components Inventory

### A. Layout Components
* **`AppShell`** ([AppShell.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/AppShell.tsx))
  * Props:
    * `eyebrow`: `"Teacher Host"`
    * `title`: `"Create a live room."`
    * `statusLabel`: `"Create Room"`
    * `description`: `"Choose a compact resource scope, room settings, and scoring standard before sharing the room code."`
* **`WorkspaceLayout`** ([WorkspaceLayout.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/WorkspaceLayout.tsx))

### B. UI Components (Primary Column)
* **`CollapsiblePanel` for Resource Scope** ([CollapsiblePanel.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/CollapsiblePanel.tsx))
  * Summary: Displaying selected Course & Lesson titles.
  * Inner form inputs:
    * Select elements (`<select>`) for choosing `Course` and `Lesson`.
    * Fieldset for selecting database sections via checkbox list (`input[type="checkbox"]`).
    * Selection helper buttons: `Button` for "Select all sections" and `Button` for "Clear".
* **`CollapsiblePanel` for Room Settings** ([CollapsiblePanel.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/CollapsiblePanel.tsx))
  * Summary: Selected response capture mode (e.g. `assigned`, `first_responder`, `auto_rotate`) and scoring mode (`simple`, `timed`).
  * Inner form inputs:
    * Input element (`<input>`) for Room title.
    * Input element (`<input>`) for Host name.
    * Select element (`<select>`) for target CCI standard card.
    * Select element (`<select>`) for response capture mode.
    * Hidden input for scoring mode.

### C. UI Components (Secondary Column)
* **`CollapsiblePanel` for Ready Check**
  * Summary: Displays the summary label (e.g., `"X sections · Y resources"`).
  * Inner elements:
    * A key-value summary list (`<dl>`) showing count metadata.
    * `Alert` (tone="warning") displaying a warning notice if no approved resources exist.
    * `ActionDock` ([ActionDock.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/ActionDock.tsx)) wrapping the main submission button.
    * Submit `Button` ([Button.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Button.tsx)) displaying `"Create room"` (or `"Creating room…"` when working).
