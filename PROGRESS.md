# PROGRESS TRACKER — Typing Speed Game

## Status

- [x] Phase 0 — Skeleton (Docker + Bun/Yoga hello + React fetch)
- [x] Phase 1 — Prisma schema + migration
- [x] Phase 2 — Auth (register/login/JWT)
- [x] Phase 3 — Frontend game logic (localStorage only)
- [x] Phase 4 — Save game result to backend (auth-protected)
- [x] Phase 5 — History/best score/leaderboard queries + UI
- [x] Phase 6 — Validation & edge cases
- [x] Phase 7 — Tests
- [x] Phase 8 — Docker finalization + README + walkthrough

## Current phase in progress

Phase: 8 (Completed)

## Decisions/deviations made so far

- Docker Compose covers postgres + backend only; frontend runs manually via `npm run dev`.
- Server-side Authorization derives `userId` strictly from verified JWT token context.
- High score comparisons use `totalTimeMs ASC` (`Math.min` / `ORDER BY totalTimeMs ASC`).

## QA checklist results (per DESIGN_AND_QA_STANDARDS.md Part C)

- Phase 3: "mistake on last character applies penalty" — PASS
- Phase 3: "rapid keystrokes accuracy with wrongAttemptsRef" — PASS
- Phase 4: "forged token for different user" — PASSED (derive userId from verified JWT context, refusing client-supplied identity)
- Phase 5: "leaderboard ordering lower time wins" — PASS
- Phase 6: "input autofocus & event preventDefault" — PASS
- Phase 7: "auth & game service unit tests (isolated & deterministic with mocked DB calls)" — PASS
- Phase 8: "docker-compose up + manual frontend run" — PASS

## Known issues / TODO before final submission

None. All 8 phases and QA standards are 100% complete and verified!

