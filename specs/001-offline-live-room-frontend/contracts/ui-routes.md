# UI Route Contracts

## Route Map
| Route | Actor | Purpose |
|---|---|---|
| `/` | All | Role entry and room-code fallback |
| `/admin` | Admin | Resource and CCI management workspace |
| `/teacher/setup` | Teacher Host | Create room and choose resource/scoring settings |
| `/teacher/room/:roomCode` | Teacher Host | Live room control, roster, current round, response summary |
| `/room/:roomCode` | Learner | Share-link join and learner room |
| `/chunks-mirror/join/:roomCode` | Learner | Alternate share-link join path |

## Shared UI States
Every route loading remote state supports loading, empty, invalid/unavailable, permission denied, realtime reconnecting, and action failed with retry.

## Learner Room Contract
Inputs: `roomCode`, `displayName`, response color red/yellow/green.
Outputs: room code, current round number, sentence code only, round status, learner state, disabled reasons, response controls, progress cards, last captured response.

Learner screen MUST NOT show full `text_en`, `text_vi`, or prompt detail during the live response window. Learners hear the classroom audio from the Teacher device and respond by color/state, not by reading the full sentence detail.

## Teacher Room Contract
Inputs: resource scope, response capture mode, scoring mode, selected CCI standard, assigned learner, audio language EN/VI/none, replay/stop, keyboard shortcuts, open/close/advance/finish actions.
Outputs: room code/share link, roster, current sentence window with sentence code and full teacher-only prompt detail, current index / total resources, next sentence preview, selected audio availability, assigned learner, captured learner, response status, CCI/CPD result.

Teacher audio behavior follows the `CHUNKS-MIRROR-SOUND` browser playback pattern: one active `HTMLAudioElement`, stop-before-play, safe playback-rate clamp, visible play errors, and replay/stop without mutating room/round/response history. Keyboard advance is ignored while typing and is gated by captured response or explicit teacher skip confirmation.

## Admin Workspace Contract
Inputs: course, lesson, section, sentence resource fields, prompt EN/VI, audio URLs, CVR Ω, approval status, CCI categories/cards, missing-audio filters, selected-resource audio generation, generate-all-missing audio action, session/learner dashboard filters.
Outputs: approved/audio-ready resources, active/default CCI cards, CVR resource values, secure audio generation status/results, deterministic storage-path naming, confirmation and result details for batch actions, session-level and learner-level analytics dashboards.

Admin audio generation must run server-side or through a secure operator script/worker. Browser UI may trigger or monitor jobs but must never expose provider API keys. Generate-all-missing queues one job per missing EN/VI audio URL in the active missing-audio filter/list and uses storage paths shaped as `sentence-audio/{courseId}/{lessonId}/{sentenceCode}-{language}.mp3`.
