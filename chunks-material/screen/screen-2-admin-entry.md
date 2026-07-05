# Screen 2: Admin Entry Page

## 1. Metadata
* **Route / Path**: `/admin`
* **Parent Component**: `RoleEntryPage` inside [RoleEntryPage.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/routes/RoleEntryPage.tsx)
* **Purpose**: Entry page for Administrators to prepare sentence resources and manage CCI standards.

---

## 2. Layout Structure
* **AppShell Container**: Wraps the screen with a standard navigation header ([TopNavigation.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/TopNavigation.tsx)), eyebrow ("Admin Workspace"), title ("Prepare resources and CCI standards."), and description.
* **WorkspaceLayout Split Grid**:
  * **Primary (Left/Top Column)**: Displays learning cycle steps and system alerts.
  * **Secondary (Right/Bottom Column)**: Renders the cards for role navigation.

---

## 3. Components Inventory

### A. Layout Components
* **`AppShell`** ([AppShell.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/AppShell.tsx))
  * Props:
    * `eyebrow`: `"Admin Workspace"`
    * `title`: `"Prepare resources and CCI standards."`
    * `statusLabel`: `"Offline Live Room"`
    * `description`: `"Teacher opens each Sentence Window, learner responds Red / Yellow / Green, and CHUNKS stores durable CCI / CPD progress through Supabase."`
* **`WorkspaceLayout`** ([WorkspaceLayout.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/layout/WorkspaceLayout.tsx))
  * Splits content into two columns (`primary` and `secondary`).

### B. UI Components (Primary Column)
* **`Card`** ([Card.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Card.tsx))
  * Variant: `"dark"`
  * Contents: An ordered list (`<ol>`) illustrating the 4-step workflow:
    1. Admin prepares Resource + CCI
    2. Teacher opens Sentence Window
    3. Learner responds Red / Yellow / Green
    4. System calculates CCI / CPD
  * Inner child tags: `.theme-step-index` (span showing step number 1-4 with background color `bg-chunks-red`).
* **`Alert`** ([Alert.tsx](file:///C:/Users/gensh/OneDrive/Máy tính/LUCY/PROJECT-WORKPLACE/CHUNKS/CHUNKS-OFFINE-V0/frontend/src/components/ui/Alert.tsx))
  * Props:
    * `tone`: `"info"`
    * `title`: `"Supabase connected"`
  * Description text: `"Using the linked project as durable state. Realtime events are treated as hints and reconciled with persisted rows."`

### C. UI Components (Secondary Column)
* **Role Navigation Cards** (3 instances of `Card`)
  * **Card 1: Teacher Host**
    * Title: `"Teacher Host"`
    * Description: `"Create rooms, open sentence windows, and monitor live responses."`
    * Navigation element: `ButtonLink` to `/teacher/setup` (variant="primary").
  * **Card 2: Learner**
    * Title: `"Learner"`
    * Description: `"Join by link or room code, listen, and respond Red / Yellow / Green."`
    * Navigation element: `ButtonLink` to `/room/demo` (variant="secondary").
  * **Card 3: Admin**
    * Title: `"Admin"`
    * Description: `"Prepare sentence resources, CVR Ω, audio, and CCI standards."`
    * Navigation element: `ButtonLink` to `/admin` (variant="secondary").
