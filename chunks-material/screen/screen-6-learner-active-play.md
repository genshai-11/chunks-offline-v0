# Screen 6: Learner Room - Active Play Page

## 1. Metadata
* **Route / Path**: `/room/:roomCode` or `/chunks-mirror/join/:roomCode` (when `learnerId` exists in LocalStorage for this room code)
* **Parent Component**: `LearnerRoomPage` inside [LearnerRoomPage.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/learner/LearnerRoomPage.tsx) (nested under `LearnerJoinPage.tsx`)
* **Purpose**: Student workspace for real-time classroom practice. Listens to WebSocket notifications via Supabase for sentence changes, round openings, eligibility shifts, and allows sending Red/Yellow/Green metrics.

---

## 2. Layout Structure
* **AppShell Container**: (Inherited from parent wrapper [LearnerJoinPage.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/learner/LearnerJoinPage.tsx)).
* **WorkspaceLayout Split Grid**:
  * **Primary (Left/Top Column)**: Displays active sentence information, response eligibility alert, and response buttons.
  * **Secondary (Right/Bottom Column)**: Displays room details, learner statistics summaries, and historical logs.

---

## 3. Components Inventory

### A. Layout Components
* **`WorkspaceLayout`** ([WorkspaceLayout.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/WorkspaceLayout.tsx))

### B. Custom Features Components (Primary Column)
* **`Card` (Active Sentence Window)** ([Card.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Card.tsx))
  * Variant: `"dark"`
  * Title details: Large heading displaying active english text (`text_en` / `text_prompt`) or a waiting message.
  * Sub-text details: Displaying localized Vietnamese prompt (`text_vi`).
  * Status: Renders a `StatusBadge` ([StatusBadge.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/StatusBadge.tsx)) showing round status (`open` or `closed`).
* **`LearnerStateBanner`** ([LearnerStateBanner.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/learner/components/LearnerStateBanner.tsx))
  * Props:
    * `learnerState`: current status (`waiting`, `assigned`, `observing`, `captured`, `already_responded`, `round_closed`).
    * `disabledReason`: string explaining why input is frozen.
  * Renders color-coded status overlays depending on student role assignment (e.g. green for assigned, yellow for observing).
* **`ActionDock`** ([ActionDock.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/ActionDock.tsx))
  * Holds `ResponseButtons` ([ResponseButtons.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/learner/components/ResponseButtons.tsx)):
    * Red button (represents low confidence/comprehension)
    * Yellow button (represents partial confidence/comprehension)
    * Green button (represents full confidence/comprehension)
* **`Alert`** ([Alert.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Alert.tsx))
  * Tone: `"error"`
  * Renders at the bottom of primary actions if response transmission fails.

### C. Custom Features Components (Secondary Column)
* **`Card` (Room Status & Roster)**
  * Key-value metadata list showing Room code, active round index, and learner eligibility status.
  * Conditional children: `Alert` (tone="success") showing confirmation details of the current round's response (color, reflection time).
* **`ProgressCards`** ([ProgressCards.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/learner/components/ProgressCards.tsx))
  * Renders a layout of metrics panels displaying overall learning metrics:
    * Card A: **CPD Points** (points accumulated, highest cpd rating).
    * Card B: **Comprehension rate** (Green vs. Red ratio).
    * Card C: **Reflect Speed** (average reaction speed in seconds).
* **`LastCapturedResponse`** ([LastCapturedResponse.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/features/learner/components/LastCapturedResponse.tsx))
  * Panel detailing the performance statistics of the last submitted practice sentence.
