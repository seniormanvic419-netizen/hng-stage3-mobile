# HNG 15 project log — Bayode Manuel (Zedu: Senior Man, Team Zedu-quetzal)

Kept by Claude Code across sessions. Newest first.

## 6 October 2026 — PRs redone on Mela's instruction

- Mentors told Mela not to update members' branches; everyone must close their PR and open a new one from the synced dev (team dev = upstream dev 7a096ef at 15:40). PR #286 was 54 commits behind and failed the 'PR template' check (two boxes unticked; CI requires all 11 template boxes ticked) and 'Relay fork build' (fork build disabled in the team repo, team-lead setting).
- New branch feat/QZ-002-add-bayode-manuel-contributor pushed to HNG-Zedu-Quetzal at 15:42, based on 7a096ef, one line, author Bayode Manuel. New PR body ticks all 11 boxes (verified against .github/pull_request_template.md). #286 to be closed by the user once the new PR exists.

## 5 October 2026 — Task 3 form posted, GitHub invite arrived, team task opened

- Mela posted the Task 3 submission form (4 Oct 22:11):
  https://docs.google.com/forms/d/e/1FAIpQLSeAkkPmPHtuHhP7JIUnXmMxv4lxARw1GOjvuWMAdxpAqX5CBQ/viewform
  Required: APK download link (Drive), repo link, and ONE continuous video (no edited clips) showing:
  web sign-in, add item on web, open mobile app, log in same account, item visible in mobile cart,
  add another item on mobile, back to web, item visible there. Both directions, physical device.
  Also required: GitHub PR link of the team contribution.
- GitHub org invite from Summiedev received 05:28; user must accept it.
- Mela 05:53: dev branch synced with upstream, everyone can clone dev and start the team task.
- Opened PR #3 https://github.com/HNG-Zedu-Quetzal/zedu-fe/pull/3 (contributors line, branch add-senior-man-quetzal-v2 -> dev) with the full template. One-word-only branch kept in reserve.
- 5 Oct evening: user accepted the repo collaborator invite; branch feat/QZ-002-quetzal-contributor-update pushed to HNG-Zedu-Quetzal/zedu-fe. Mela's rules: state the ticket ID first (done, QZ-002); PR goes to zedu-hng/zedu-fe dev from the team-repo branch, not from a fork (PR #3 from the fork was closed for that reason).
- PR #286 opened on zedu-hng/zedu-fe (feat(QZ-002), from HNG-Zedu-Quetzal branch into dev): https://github.com/zedu-hng/zedu-fe/pull/286. This is the team-task PR link for the Task 3 form.
- Task 3 form SUBMITTED by the user on 5 Oct ~20:30 WAT: PR #286 link, APK Drive link, repo link, video uploaded as a file (Basira-Task3-demo-final.mp4), login Yes, Mailgun Yes, Claude / Claude Code, lost count, hardest-part text. Co-Authored-By trailers stripped from all three HNG repos the same evening at the user's request.
- scrcpy installed via winget (%LOCALAPPDATA%MicrosoftWinGetPackagesGenymobile.scrcpy_*scrcpy-win64-v4.1)
  so the phone can be mirrored on the PC and one continuous Win+Alt+R recording shows both.

## 3 October 2026 — Task 3 (mobile app) done, Task 2 submitted

- **Task 3 built and tested.** Expo app in `app/`, same Supabase project as the web shop, Google
  sign-in via PKCE with `basira://auth/callback`, cart moved to a new `cart_items` table with RLS
  and realtime. Web shop updated to use the same table for signed-in users. Release APK built
  locally (JDK 17 + Android SDK), installed on the user's Android phone, two-way sync confirmed.
  APKs: `Downloads\BasiraProvisions-v1.0.0.apk`, `v1.0.1.apk` (adds refetch on tab/foreground,
  pull-to-refresh, explicit realtime auth).
- **Demo video** (PC and phone side by side, 38 s) at
  https://drive.google.com/file/d/1MHg4TJDt7C8w6MJfFkKaVmj4UB9uZZDt/view — built from the user's
  two clips with ffmpeg; also linked in README.
- **Task 3 form: confirmed NOT posted as of 13:30.** Read every link in Zedu #announcement from the
  browser: only the Task 2 form, the Lesson 3 call recording (75 MB mp4, the "HNG15 - Lesson 3"
  card is its file name), an audio recording and one more large Drive file. No written task, no form.
  Mark's 9:51 message today: the Zedu PR "is not a requirement"; what matters is having built the
  mobile app; everyone should join #zedu-contributors. Deadline Monday 6 Oct 11:59 PM.
- **Task 2 form submitted** (Task Two - Individual Task (Shop Website)): email, Zedu username
  Senior Man, team Zedu-quetzal, live link, Supabase, Mailgun yes, Claude / Claude Code, lost
  count, hardest part text. No receipt email; confirmation page was observed and is logged in the
  session transcript. Google consent screen branding completed; Publish button is unlocked but the
  user must click it (Google Cloud → Auth Platform → Audience).
- **Mailgun**: account activated, sandbox domain, sending key as Pages secrets, owner email is an
  authorized recipient. Gmail files sandbox mail in Spam (DMARC quarantine). Confirmed delivered.
- **Real product photos** from Wikimedia Commons (attribution in web repo `docs/IMAGES.md`).
- **Zedu contribution**: PRs #1 (contributors line) and #2 (one-word change, later extended with a
  greeting + empty states feature on the Get started page) in HNG-Zedu-Quetzal/zedu-fe were closed
  by team lead Summiedev (Mela on Telegram): wait for her process before opening PRs. Branches
  `add-senior-man-quetzal` and `one-word-change` remain on seniormanvic419-netizen/zedu-fe. The
  earlier Heron PR #6 is in the wrong team's repo and should be closed by the user.
- **Call transcript** (2 Oct Zoom Q&A, transcribed locally with faster-whisper):
  `Downloads\HNG15_call_2026-10-02_transcript.txt`.

## 2 October 2026 — Task 2 shop built, Task 1 done earlier

- Task 2: Basira Provisions, https://basira-provisions.pages.dev, repo hng-stage2-shop. Supabase
  schema + RLS, Google OAuth client, Pages Function for Mailgun, 17 tests, PRD + AGENTS.md.
- Task 1: Ledger to-do app, https://hng-stage1-todo.pages.dev, repo hng-stage1-todo. Form
  submission status unconfirmed.

## Open items (as of 5 Oct 2026, evening)

1. PR #286 on zedu-hng/zedu-fe awaits Mela's (Summiedev) review and merge. Nothing to do; optionally post the link in Zedu-quetzal.
2. Confirm Task 1 form was submitted (never confirmed).
3. Google consent screen for the shop: click Publish so any Google account can sign in (user's click).
4. Close the old Heron PR #6 (wrong team) and the stale fork branches on seniormanvic419-netizen/zedu-fe.
5. Name spelling: Telegram and GitHub display show "Baryorde Manuel", forms and contributors entry say "Bayode Manuel".
6. Revoke the Cloudflare API token pasted in chat.
7. Side project: n8n WhatsApp credential still needs Access Token + Business Account ID from the Meta app
   "logistics & shipment" (ID 1102716399015231), WhatsApp > API Setup. Portfolio "Voom" exists.
