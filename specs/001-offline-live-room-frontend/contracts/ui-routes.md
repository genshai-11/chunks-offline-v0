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
Outputs: current sentence, prompt EN/VI, audio availability, round status, learner state, disabled reasons, progress cards, last captured response.

## Teacher Room Contract
Inputs: resource scope, response capture mode, scoring mode, selected CCI standard, assigned learner, open/close/advance/finish actions.
Outputs: room code/share link, roster, current sentence window, assigned learner, captured learner, response status, CCI/CPD result.

## Admin Workspace Contract
Inputs: course, lesson, section, sentence resource fields, prompt EN/VI, audio URLs, CVR Ω, approval status, CCI categories/cards.
Outputs: approved/audio-ready resources, active/default CCI cards, confirmation and result details for batch actions.
