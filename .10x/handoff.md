# Handoff

**Current:** SDE, Phase 4. A1 done (see `decisions/sde/stage1-foundations.md`).

**Next:** A2 local Supabase (Docker running; `npx supabase init` + `start`, first Payload migration into schema `payload`, first admin sign-in at `/cms`). Then send the E2 stock-photo shortlist to the user for approval, then A3 storage spike.

`.env` exists locally (gitignored) with a generated `PAYLOAD_SECRET` and the local Supabase DB URL.
