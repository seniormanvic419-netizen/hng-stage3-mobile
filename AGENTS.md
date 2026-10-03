# AGENTS.md — Basira Provisions mobile

- `app/App.js` is the whole UI; `app/src/supabase.js` the client; `app/src/money.js` formatting.
- Never put a service-role key here. The publishable key is public by design; RLS protects rows.
- The cart lives in Supabase `cart_items`. Do not reintroduce a local-only cart for signed-in users.
- Realtime relies on `cart_items` being in the `supabase_realtime` publication with
  `replica identity full` (see `supabase/schema.sql` in the web repo).
- Deep link scheme is `basira` and the redirect `basira://auth/callback` is on Supabase's allow list.
- Build: `npx expo prebuild --platform android` then Gradle `assembleRelease` with JDK 17. The
  `android/` folder is generated and git-ignored; regenerate rather than hand-edit it.
- Keep the look aligned with the website: green `#1b5e3b`, warm off-white `#f7f6f2`.
