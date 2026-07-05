# Screen 5: Learner Room - Join / Lobby Page

## 1. Metadata
* **Route / Path**: `/room/:roomCode` or `/chunks-mirror/join/:roomCode` (when `learnerId` is not stored in LocalStorage for this room code)
* **Parent Component**: `LearnerJoinPage` inside [LearnerJoinPage.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/learner/LearnerJoinPage.tsx)
* **Purpose**: Allows student learners to input a display name and join the current live room. Reconciles session state before redirecting to the active play console.

---

## 2. Layout Structure
* **AppShell Container**: Wraps the screen with a standard navigation header ([TopNavigation.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/TopNavigation.tsx)), eyebrow ("Learner Room"), statusLabel (Room Code), and title.
* **WorkspaceLayout Split Grid**:
  * **Primary (Left/Top Column)**: Displays the Join form wrapper card.
  * **Secondary (Right/Bottom Column)**: Displays static rule references for learners.

---

## 3. Components Inventory

### A. Layout Components
* **`AppShell`** ([AppShell.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/AppShell.tsx))
  * Props:
    * `eyebrow`: `"Learner Room"`
    * `title`: Dynamically loaded Room Title or `"Join room :roomCode"`.
    * `statusLabel`: Room Code (e.g. `"demo"`).
    * `description`: `"Join with a display name, then answer only when your state says assigned."`
* **`WorkspaceLayout`** ([WorkspaceLayout.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/WorkspaceLayout.tsx))

### B. UI Components (Primary Column)
* **`Card`** ([Card.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Card.tsx))
  * Contains the HTML form for room entry.
  * Form details:
    * Label: `"Display name"`
    * Input element (`<input>`): Takes learner name, updates `displayName` state.
    * Submit `Button` ([Button.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Button.tsx)) displaying `"Join room"` (or `"Joining…"` when processing). Disabled if input is empty or request is in-flight.
* **`Alert`** ([Alert.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Alert.tsx))
  * Tone: `"error"`
  * Title: `"Cannot join room"`
  * Renders dynamically below the form if the API join request fails.

### C. UI Components (Secondary Column)
* **`Card`** ([Card.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Card.tsx))
  * Variant: `"dark"`
  * Header text: `"Learner rules"` (uppercase tracking-widest).
  * Bullet list details:
    * Wait until the teacher opens a Sentence Window.
    * Assigned learners can answer Red, Yellow, or Green.
    * Each round stores one tracked response.
