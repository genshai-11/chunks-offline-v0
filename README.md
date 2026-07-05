# CHUNKS Offline Live Room (Mirror)

**CHUNKS Mirror** is an offline-capable live classroom tool for sentence-based response practice.

Teachers host live rooms, control EN/VI audio playback from their device, and advance rounds using keyboard shortcuts. Learners join via share link or room code, see only the sentence code (not full text), and submit a single Red / Yellow / Green response per round in real time.

Built for focused classroom use with strong accessibility, real-time sync, and a clean geometric design system.

## ✨ Features

- **Multi-role experience**
  - **Admin**: Manage resources, CCI/CVR standards, bulk audio generation
  - **Teacher**: Create rooms, control rounds, play audio, view live responses & analytics
  - **Learner**: Join anonymously, submit exactly one response, see personal progress
- Real-time synchronization via Supabase Realtime
- Teacher keyboard controls (advance after captured response)
- Response scoring: CCI, CPD, reflection time, color distribution
- Audio playback (EN/VI) controlled by teacher
- Multiple visual themes (Bauhaus default)
- Comprehensive test coverage (unit, integration, e2e)

## 🛠 Tech Stack

- **Frontend**: Vite 7 + React 19 + TypeScript + Tailwind CSS
- **UI System**: Custom primitives + Astryx components with theme overrides
- **Backend**: Supabase (Postgres, Realtime, Storage, Edge Functions)
- **Testing**: Vitest + Playwright
- **Theming**: CSS variable-driven (Bauhaus, Calm, Craft)

## 📁 Project Structure

```
.
├── frontend/                 # Main React application
│   ├── src/
│   │   ├── components/       # Layout, primitives, UI
│   │   ├── features/         # Admin / Teacher / Learner
│   │   └── styles/           # tokens + globals (theming)
├── supabase/                 # Migrations, seed data, Edge Functions (TTS)
├── specs/                    # Detailed feature specifications & research
├── scripts/                  # TTS generation & utility scripts
└── DESIGN*.md                # Design system documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm / pnpm
- Supabase CLI (recommended for local development) or a Supabase project

### 1. Clone & Install

```bash
git clone https://github.com/genshai-11/chunks-offline-v0.git
cd chunks-offline-v0/frontend
npm install
```

### 2. Start the Frontend

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 3. Supabase Setup

#### Option A: Local Supabase

```bash
# In project root
supabase start
supabase db reset          # applies migrations + seed.sql
```

#### Option B: Hosted Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Apply migrations from `supabase/migrations/`
3. Run the seed from `supabase/seed.sql`

### 4. Optional: Generate Audio (TTS)

Some scripts are provided in `scripts/` for batch TTS generation.

## 📜 Available Scripts (frontend/)

| Command                | Description                     |
|------------------------|---------------------------------|
| `npm run dev`          | Start Vite dev server           |
| `npm run build`        | Type-check + production build   |
| `npm run test`         | Run unit + integration tests    |
| `npm run test:e2e`     | Run Playwright E2E tests        |
| `npm run storybook`    | Start Storybook                 |
| `npm run lint`         | Type-check only                 |

## 🎭 Roles & Flow

1. **Admin** prepares sentence resources + audio + standards
2. **Teacher** creates a room and chooses scope/scoring
3. **Learner(s)** join via link/code
4. Teacher opens rounds → plays audio → learners respond
5. Real-time updates for everyone

Learners only see sentence **code** during active rounds (text is hidden for focus).

## 🎨 Themes

The app ships with three selectable design themes (switch via the theme control):

- **Bauhaus** (default) — Geometric, hard edges, strong typography
- **Calm** — Soft, editorial console style
- **Craft** — Minimal chunking aesthetic

Theme tokens live in `frontend/src/styles/tokens.css`.

## 🧪 Testing

- Unit & component tests with Vitest
- Integration tests for major flows
- E2E tests with Playwright

```bash
npm run test
npm run test:e2e
```

## 📚 Documentation

- `specs/001-offline-live-room-frontend/` — Core feature spec & quickstart
- `DESIGN.md` + `DESIGN-*.md` — Design system
- `chunks-material/screen/` — Screen inventory & flows

## 🔗 Related

- GitHub: https://github.com/genshai-11/chunks-offline-v0
- Current branch: `001-offline-live-room-frontend`

---

Built as part of the CHUNKS classroom tooling initiative. Focus on clarity, speed, and deliberate design.