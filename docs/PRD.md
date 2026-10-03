# PRD — Basira Provisions mobile app (HNG 15 Task 3)

**Owner:** Bayode Manuel (Zedu: Senior Man, Team Zedu-quetzal) · **Built with:** Claude Code · **Date:** 3 October 2026

## Goal
A phone app for the existing shop that uses the same backend and the same user account, so a
customer can start a cart on the website and finish it on the phone, or the other way round.

## Requirements (from the 2 Oct 2026 briefing)
1. Same API endpoints as the web shop. No second backend.
2. Same account: logging in on web and on mobile shows the same cart and orders.
3. Cart sync: adding on web shows in the mobile cart. Instant update preferred.
4. Installed and tested on a real phone, launched from an icon.
5. Submission: screen recording.

## Solution
- Expo (React Native) app, plain JavaScript, three tabs: Shop, Cart, Orders, plus Checkout and
  a thank-you screen.
- Supabase JS client with AsyncStorage session persistence. Google sign-in via Supabase Auth
  (PKCE) through the system browser; the app owns the `basira://` scheme for the return trip.
- Cart stored in `cart_items` (new table, RLS per user, realtime publication). Web was changed to
  use the same table when signed in, with a merge of the local cart at sign-in.
- Realtime: both clients subscribe to `postgres_changes` on their own rows and reload the cart.
- Orders and the confirmation email reuse the web's tables and `/api/send-confirmation`.

## Out of scope
Push notifications, offline cart, payments, iOS store distribution.

## Success criteria
- Add on web → appears in app cart within ~1 s without manual refresh, and vice versa.
- Place order from the app → row in Supabase, email sent, visible under Orders on web.
- APK installs on an Android phone from the launcher icon.
