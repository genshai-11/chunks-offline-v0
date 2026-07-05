# Screen 4: Teacher Room Control Page

## 1. Metadata
* **Route / Path**: `/teacher/room/:roomCode`
* **Parent Component**: `TeacherRoomPage` inside [TeacherRoomPage.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/teacher/TeacherRoomPage.tsx)
* **Purpose**: Active management dashboard for teacher hosts. Allows opening, closing, and advancing response practice rounds, modifying live CCI parameters, sharing room codes, and monitoring the classroom roster.

---

## 2. Layout Structure
* **AppShell Container**: Wraps the screen with a standard navigation header ([TopNavigation.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/TopNavigation.tsx)), eyebrow ("Live Room Control"), statusLabel (Room Code), title (Room Title), and headerMeta.
  * `headerMeta`: A card displaying the dynamic room status (lobby, active round, or finished).
* **WorkspaceLayout Split Grid**:
  * **Primary (Left/Top Column)**: Displays active sentence window, response analytics panels, and control buttons.
  * **Secondary (Right/Bottom Column)**: Displays side utilities (Share link details and student roster).

---

## 3. Components Inventory

### A. Layout Components
* **`AppShell`** ([AppShell.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/AppShell.tsx))
* **`WorkspaceLayout`** ([WorkspaceLayout.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/WorkspaceLayout.tsx))

### B. Custom Features Components (Primary Column)
* **`CurrentSentenceWindow`** ([CurrentSentenceWindow.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/live-room/CurrentSentenceWindow.tsx))
  * Displays the current active sentence, translation, and target learner assigned to it (if in assigned capture mode). Shows a preview of the next sentence in queue if no round is active.
* **`CapturedResponsePanel`** ([CapturedResponsePanel.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/teacher/components/CapturedResponsePanel.tsx))
  * Shows aggregate analytics for the round (count and percent of Red/Yellow/Green replies) and lists individual learner submission items.
* **`ActionDock`** ([ActionDock.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/ActionDock.tsx))
  * Standard control buttons:
    * `Button` `"Open round"`
    * `Button` `"Close round"` (secondary variant)
    * `Button` `"Advance"` (secondary variant)
    * `Button` `"Finish room"` (secondary variant)
* **`CollapsiblePanel` for Round Settings** ([CollapsiblePanel.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/CollapsiblePanel.tsx))
  * Contains selection dropdowns (`<select>`) for changing the target CCI standard category for the upcoming round.

### C. Custom Features Components (Secondary Column)
* **`CollapsiblePanel` for Share Link**
  * Contains `ShareLinkCard` ([ShareLinkCard.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/teacher/components/ShareLinkCard.tsx)) displaying the join URL, instructions, and copy helpers.
* **`CollapsiblePanel` for Roster**
  * Summary: Displays the count of online learners.
  * Contains `TeacherRoster` ([TeacherRoster.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/teacher/components/TeacherRoster.tsx)) displaying active, offline, and left learners. Enables selection of the assigned learner who will receive the response rights for the next active round.
