# fix/feat PR body — Task 2: API keys for the AI agent + profile screen

Branch: `feat/api-keys-profile` (built locally in C:\Users\goodb\metric-tracker, not yet pushed).
Base: `main` of the team fork `zedu-vulcan/metric-tracker` (parent `zeduchat/metric-tracker`).

## What this adds
Per-user API keys so the Zedu Amp agent can authenticate as a user over HTTP, and a Profile page to manage them and show points.

- **Schema:** new `ApiKey` model (id, userId, name, prefix, keyHash, lastUsedAt, revokedAt, createdAt) with a `User.apiKeys` relation. Only the SHA-256 hash of a key is stored; the raw key is shown once at creation. Additive migration `add_api_keys` is included but **not applied to the shared database** — it needs the team's confirmation first (per AGENTS.md).
- **Auth helpers (`src/lib/api.ts`):** `requireApiKey(request)` reads `Authorization: Bearer zamp_...`, looks up the un-revoked key by hash, bumps `lastUsedAt`, returns the owner's userId. `requireAuthOrKey(request)` accepts either a session or a bearer key, so Tasks 3, 5 and 6 can serve both a human and the agent from the same route.
- **Endpoints (`/api/keys`):** `GET` list (never returns the secret), `POST` create (201 with the raw key once), `POST /{id}/rotate` (revoke old + issue new in a transaction), `POST /{id}/revoke` (deactivate), `DELETE /{id}`. All scoped to the caller; 404 on another user's key.
- **OpenAPI:** the five paths and a `bearerKey` security scheme are registered, so they appear at `/docs`.
- **Profile page (`/dashboard/profile`):** account card, a points card (placeholder until Task 5's allocation lands), and an API-keys manager with create / rotate / deactivate / delete and a one-time copy dialog. Added to the sidebar.

## How to test
1. `npm install`, `npm run db:generate`, `npm run dev`.
2. Sign in, open **Profile** in the sidebar, click **New key**, copy the key from the dialog.
3. `curl -H "Authorization: Bearer <key>" http://localhost:3000/api/keys` — a route wired to `requireApiKey`/`requireAuthOrKey` accepts it; a random string returns 401.
4. Rotate, deactivate and delete from the UI and confirm the list and badges update.

## Checks done
- `npx tsc --noEmit` passes.
- Migration SQL matches `prisma migrate diff` output for the model exactly.
- No `.env` touched; no new dependencies; npm only; no `npm run build`; nothing pushed to main.

## Follow-ups for the sub-team
- Apply the migration to the shared DB only after Paul/Dev B confirm (it is additive, no data loss).
- When Task 5 adds the points model, swap the placeholder points card for the real total.
- Task 4 can document "get a key on the Profile page, send it as a Bearer token" from this.
