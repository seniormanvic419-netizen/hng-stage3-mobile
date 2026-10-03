# Basira Provisions — Mobile app (HNG 15 Task 3)

The Android/iOS companion to the shop at https://basira-provisions.pages.dev. Same Supabase
backend, same Google account, same cart: add an item on the website and it appears in the app's
cart within a second, and the other way round.

- Web shop repo: https://github.com/seniormanvic419-netizen/hng-stage2-shop
- App code: `app/` (Expo / React Native, JavaScript, no navigation library)

## How it is wired

| Concern | Web | Mobile | Shared piece |
| --- | --- | --- | --- |
| Products | `products` table via Supabase REST | same | Supabase project `xmxwbcemtzntkgueiwon` |
| Login | Supabase Auth, Google provider, PKCE | same provider, PKCE, returns to `basira://auth/callback` | one `auth.users` row per Google account |
| Cart | `cart_items` (user_id, product_id, quantity) | same table | Realtime channel on `cart_items` filtered by `user_id` |
| Orders | `orders` + `order_items` | same tables | RLS: `auth.uid() = user_id` |
| Confirmation email | `POST /api/send-confirmation` (Pages Function → Mailgun) | calls the same endpoint with the user's JWT | one backend |

The cart is the only thing that moved for Task 3. Before, the web cart lived in `localStorage`.
Now a signed-in user's cart is a set of `cart_items` rows; the website merges any local cart
into those rows at sign-in. Both clients subscribe to Postgres changes on their own rows, so
every add/remove on one device re-renders the other.

## Run it

```bash
cd app
npm install
npx expo start          # press a for the Android emulator, or scan with Expo Go
```

Sign-in in Expo Go works through the system browser and the `basira://` scheme. For a real
installable build see below.

## Build the APK (Windows, local)

Requires JDK 17 and the Android SDK (platforms 34+, build-tools, platform-tools).

```bash
cd app
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
npx expo prebuild --platform android --no-install
cd android && gradlew assembleRelease
```

The APK lands in `app/android/app/build/outputs/apk/release/app-release.apk`. Copy it to the
phone (USB, Drive, WhatsApp "document"), open it, allow "install from this source", and the
Basira Provisions icon appears in the launcher. The release build is signed with the debug
keystore, which is fine for sideloading and testing.

## Test the sync

1. Sign in with the same Google account on https://basira-provisions.pages.dev and in the app.
2. Add rice on the website. Open the app's Cart tab: rice is there, with the "Live" indicator.
3. Change the quantity in the app. The website drawer updates without a refresh.
4. Place the order on either side. Both carts empty; the order shows under Orders on both.

## Docs

- `docs/PRD.md` — requirements
- `AGENTS.md` — notes for agents and humans working here
