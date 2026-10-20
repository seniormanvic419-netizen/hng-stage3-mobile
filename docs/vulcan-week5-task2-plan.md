# Vulcan 2.0, week 5: Task 2 plan (API keys for the AI agent + profile screen)

Written 20 Oct 2026 09:40 from the zeduchat/metric-tracker repo (main at bfa62c6) and Bebz's task split in Team Vulcan (19 Oct 22:33-22:52). Sub-team lead for Task 2: Paul. Live app: https://metrics.zedu.chat/ (Zedu Amp).

## What Task 2 asks for (Bebz's words, tidied)
- API keys so the AI agent can identify the unique user and act for them. Build the endpoint.
- Security: users create, rotate (new key replaces the old one) and deactivate keys from their profile.
- Endpoints to create, invalidate and delete an API key. Buttons for the same.
- Profile screen: the user sees all points allocated so far, sees the API key and can copy it.

## What the repo already gives us
- Next.js 14 App Router, Prisma 5 on shared Neon Postgres, NextAuth v4 Google sign-in with database sessions, Zod + zod-to-openapi (/docs).
- `requireAuth()` in src/lib/api.ts reads the session cookie only. Nothing accepts a bearer key yet.
- `User` model: id, name, email, image, accounts, sessions, contentItems, seoChecks. No keys, no points.
- Route handler pattern: src/app/api/content/route.ts (requireAuth, safeParse, prisma, force-dynamic, 400/401/404 shapes). Schemas in src/lib/schemas/<feature>.ts with z from @/lib/zod. Register paths in src/lib/openapi.ts.
- Dashboard pages: src/app/dashboard/<feature>/page.tsx with PageHeader + PageContent; add to CHANNELS in SidebarNav.tsx.
- Hard rules in AGENTS.md: never reset the DB, never edit old migrations, create migrations with --create-only and show the SQL before applying, never npm run build locally, npm only, feature branch, no changes to auth foundations without saying so.

## Proposed design
### Schema (additive, one migration)
```
model ApiKey {
  id         String    @id @default(cuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name       String    @default("default")
  prefix     String                      // first 8 chars, shown in the UI
  keyHash    String    @unique           // sha256 of the full key; raw key never stored
  lastUsedAt DateTime?
  revokedAt  DateTime?
  createdAt  DateTime  @default(now())
  @@index([userId])
}
```
Plus `apiKeys ApiKey[]` on User (one-line relation add, touches the NextAuth model so say so in the PR). Points can be left to Task 5 (their model) and the profile reads them when it exists; until then the profile shows the points block with a `PointsLedger` stub or a server-computed 0.

Key format: `zamp_` + 32 random bytes base64url. Shown once at creation. Rotate = create new, revoke old, in one transaction.

### Endpoints (session auth, src/app/api/keys)
- `GET /api/keys` -> list of the caller's keys (id, name, prefix, createdAt, lastUsedAt, revokedAt). Never the hash.
- `POST /api/keys` body {name?} -> 201 {key (raw, once), id, prefix}. Deactivate any active key first if we keep "one active key per user".
- `POST /api/keys/[id]/rotate` -> 201 new key, old one revoked.
- `POST /api/keys/[id]/revoke` -> 200 record with revokedAt set (= "invalidate/deactivate").
- `DELETE /api/keys/[id]` -> 204.
All 404 if the key is not the caller's.

### Agent auth helper (the piece the other tasks need)
- `requireApiKey(request)` in src/lib/api.ts: reads `Authorization: Bearer zamp_...`, sha256, finds an unrevoked ApiKey, bumps lastUsedAt, returns {userId}. 401 `{ error: "Invalid API key" }` otherwise.
- `requireAuthOrKey(request)`: session first, then bearer. Tasks 3, 5 and 6 can call this so the agent hits the same routes a human does.
- Register a `bearerKey` security scheme in openapi.ts next to the existing sessionCookie one.

### Profile screen (src/app/dashboard/profile/page.tsx)
- PageHeader "Profile". Card 1: name, email, avatar from the session. Card 2: Points (total + small table by task when Task 5 lands). Card 3: API key: prefix + created + last used, buttons Create / Rotate / Deactivate / Delete, and a one-time dialog that shows the full key with a Copy button and the note that it will not be shown again.
- Add `{ href: "/dashboard/profile", label: "Profile", icon: UserIcon }` to CHANNELS, or put it under the user menu if Paul prefers.

## Work split suggestion for Paul's sub-team
1. Schema + migration + requireApiKey helper (one PR, small, unblocks everyone).
2. /api/keys routes + openapi entries.
3. Profile page UI.
4. Docs snippet for Task 4's agent documentation: how to get a key and send it.

## Checks before any PR
`npx tsc --noEmit`, `npx next build` (no migrations), screenshots of the profile page, migration SQL shown in the PR body, no .env touched.
