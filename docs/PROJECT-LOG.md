# HNG 15 project log — Bayode Manuel (Zedu: Senior Man, Team Zedu-quetzal)

Kept by Claude Code across sessions. Newest first.

## 9 October 2026 - team moved to Vulcan, tickets re-labelled, redesign + marketing tickets drafted

- TEAM CHANGE: HNG reshuffled teams on 8 Oct. Sheet "Copy of Task 3 - Individual Task (Responses)" (docs.google.com/spreadsheets/d/19N_x8uKyGboALlDc3fhvms2pX57Kn28J2tLPVGgPV2I) row 170: Senior Man, quetzal -> Team Vulcan, lead Dev B (Zedu username Dev_B, Telegram @abrahambishop). Six Quetzal members moved: DGen (Michael), Senior Man, Tasiwewe, Nsisong Uko, gift_olukoju, Paul Folorunsho. Vulcan Telegram: https://t.me/+h3MyH5hRK543M2Q0 (joined 8 Oct). Dev B created a Vulcan GitHub org but has not forked repos; HNG promised a new PR flow; old PRs stay on the Quetzal fork. Daily stand-ups to be voted. User is NOT in #teamless.
- Joined Zedu #announcement-project (channel id 01a0c9f7-2382-7aab-964c-c7b7b737d492). Avi posted the week-2 deliverables there on 8 Oct 06:31/06:53: five tasks due Sunday 12 Oct (approved ticket, redesign, team feature, marketing, mobile/desktop). Redesign workflow: screenshot UI -> AI-improved design -> submit as ticket -> approval -> implement.
- Both ticket docs updated to "Zedu team: Vulcan (moved from Quetzal on 8 Oct 2026)" and renamed: web DM-placeholder ticket https://docs.google.com/document/d/1CvX2dLNBe7hYsT4syh5X8PMqNQTQosyrIKpD8__SMks/edit ; mobile channel-list-time ticket https://docs.google.com/document/d/1Qell_C0thqcmAUyZmLxpBHsGuzKxaOVjbr9s8D5u5gc/edit . Both Anyone-with-link viewer. Both sent to Bigtiffs in her Zedu DM on 9 Oct (web at 11:03, mobile after). Bigtiffs vets tickets in the old Zedu-quetzal Telegram group as @Anniedevkiller.
- Merged: PR zedu-hng/zedu-fe #462 merged 7 Oct 15:55 by mrcoded. Contributor task complete.
- Zedu Mobile (Task 1 / item 5): debug build running on the itel S667LN via USB (wireless kept dropping: phone hops between the Starlink router's 2.4/5 GHz radios and Android disables adbwifi on every hop; proven from logcat). .env needs GOOGLE_CLIENT_ID (public web client id from zedu.chat JS) and CONNECT_URL=wss://api.staging.zedu.chat/centrifugo/connection/websocket or the Login screen and Home screen crash. Evidence video: Downloads/zedu-mobile-task1-evidence2.mp4 (90 s) NOT yet uploaded/posted. Mirror script: Tools/zedu-mirror-loop.ps1 + Desktop shortcut "Zedu Mirror". Bug notes: Downloads/zedu-mobile-bug-notes.md (23 items).
- Redesign ticket (item 2) drafted: "[Mobile][Design] 'Type a message' hint is invisible in light theme", confirmed on the Play Store build; proof pushed to docs/proof/zedu-mobile-hint-light.png and -dark.png; HTML at Downloads/Zedu-Ticket-Mobile-Hint-Redesign.html. Google Doc NOT yet created under seniormanvic419 (two stray copies were accidentally created under other Google accounts in the wrong Chrome profiles; ignore/delete them).
- Marketing ticket (item 4) drafted: "[SEO] Sign-in and sign-up pages have no description, canonical or share image, and both are titled just 'Zedu'" (the og:image/Home-title idea is already issue #296). HTML at Downloads/Zedu-Ticket-Marketing-Auth-Pages-SEO.html. Doc not created yet.
- Desktop (Kon-vos-lee Task 2): Flutter 3.44.8 present, zedu-desktop cloned at C:/Users/goodb/zedu-desktop with .env from template; Visual Studio was NOT installed (only installer remnants). Started `winget install Microsoft.VisualStudio.2022.BuildTools` with the VCTools workload on 9 Oct (log: Downloads/vs-buildtools-install.log). After it finishes: flutter doctor, then flutter run -d windows.
- Chrome profiles: the HNG work lives in the Chrome profile named "Senior" (seniormanvic419). "Goodluck" (goodborbor) and "Omni" (dormammuomnibottetris) profiles are NOT for HNG. Always check the Share dialog owner before sharing a doc.
- 9 Oct later: intro posted in Vulcan Telegram (08:45) and Task 1 video posted there (08:51, Drive link https://drive.google.com/file/d/1TE1PJ3klwl7PqE7qGiGJS2nzmP1ntrm2/view). Megasaurus (Vulcan approver) said "if you need me to approve your ticket, send it here". Both Bigtiffs tickets were also sent in her Zedu DM on 9 Oct. Redesign doc created+shared under seniormanvic419: https://docs.google.com/document/d/1MPlRAh9x6lsIZzuODmHYzwpTA4M6AkmeAgyVyqgjwu4/edit . Marketing doc (sign-in/sign-up metadata): https://docs.google.com/document/d/1NTBccyb5iFHlW-Puli6z16ih34QD5k-OX4qGzA8ZBuI/edit . Google consent screen for Basira (project "popgolden", client 696372713378-...) published: In production. Cloudflare account = seniormanvic419 (Google login). Visual Studio Build Tools 2022 installed (VCTools), Developer Mode turned on, `flutter build windows --release` running in C:/Users/goodb/zedu-desktop. Stage 1 form: no Google Forms receipt in Gmail (copy was off), nothing more to prove from our side.
- Still open: post the 4 ticket links to @Megasaurus in Vulcan Telegram; DM Dev_B on Zedu (People > search Dev_B > Message); DM Dev_B on Zedu (https://zedu.chat/hng-internship/home/people/01a11da0-6d5e-7bf3-aca6-b13258b78ab8/01a0c881-34c8-7817-8077-e6a74c0cff11); upload Task 1 video to Drive and post; create+share the redesign and marketing docs under seniormanvic419; revoke the Cloudflare token (https://dash.cloudflare.com/profile/api-tokens); publish the Basira Google consent screen (project is under seniormanvic419, Google Auth Platform > Audience > Publish app); confirm Stage 1 form submission (check seniormanvic419 Gmail for a Google Forms receipt, or the #announcement responses sheet).

## 7 October 2026 — week 2 tasks clarified (read from the Zedu-quetzal Telegram chat via Chrome, Omni profile)

- Scoring (Kon-vos-lee, 09:03): Task 1 = 1 point, Task 2 = 1 point, Task 3 = 2 points, max 4 per person; 5 helpers can earn a 5th point; the team needs 60 points total to survive. Tracking sheet: https://docs.google.com/spreadsheets/d/1g7__mNeJv-VhSAob6985ykpOpp-pNTN5sTO5wAxphFU/edit
- Task 1 (mobile): every member sets up Zedu Mobile locally (zedu-hng/zedu-mobile, team fork HNG-Zedu-Quetzal/zedu-mobile), runs it on their own phone, records evidence. Team part: one shared small mobile fix made by one person after Bigtiffs pre-approval + GitHub ticket approval; everyone pulls it and shows before/after. Michael is writing a Windows setup guide (lighter than full Android Studio); .env values needed from Mela.
- Task 2 (desktop): same for zedu-hng/zedu-desktop (fork HNG-Zedu-Quetzal/zedu-desktop); one shared desktop fix, may be merged into central; a short team setup guide counts as helping.
- Task 3 (ticketing): one small improvement each, explain why, Bigtiffs pre-approval, then GitHub ticket; PR optional. This is the ticket already drafted (thread timestamp doc).
- Mela 09:02: only Kon-vos-lee's ticket approved so far; Mela asked mentors to clarify. Ticket approvals come by Zedu DM from Bigtiffs, then the person creates the GitHub issue. Anniedevkiller's ticket still waiting after a day.
- Mela told Gift "Fix your commit message" (Gift re-opened as #607). Our #462 commit message passes commitlint (checked). #462 is now "dirty" (conflicts with dev after other contributor entries landed): needs dev merged in, normal push.
- Mela's own PR: zedu-hng #549 (23:09, 6 Oct). Michael's #177 updated and green, waiting lead approval.
- 10:50: Mela asked everyone (and the user directly) to "update your branch" before she approves. Merged upstream/dev into feat/QZ-002-add-bayode-manuel-contributor, resolved the one-line conflict (kept Michael's entry then ours), merge commit authored by Bayode Manuel, normal push 5b57250. Mela's full Lesson 4 text: max 4 points each, 60 team points to survive, top team wins N50k, each team fires its 10 least productive members; tickets must be pre-vetted by Tifanni (Bigtiffs) then approved on GitHub before work.
- 11:07: checked Zedu DMs in the seniormanvic419 profile via Chrome: NO DM to Bigtiffs had been sent. Opened a new DM with her (https://zedu.chat/hng-internship/people/01a115d5-6716-7426-a51c-4cb426386a69/019519be-afda-77d6-8670-26e1400f32a2) and typed the ticket message for the user to send. Zedu Enter sends a message (issue #66), so the message was typed on one line. Announcements today: Mfoniso 08:18 "you have until 12pm to submit your task" + Zoom link; Mark 10:03 "call in one hour, today is a critical day". Many interns are chasing Bigtiffs in #general.

## 6 October 2026 — PRs redone on Mela's instruction


- Ticket process guide received (docs/Ticket_Guide_Stage1.pdf, by Bigtiffs): 1) copy the ticket template into a Google Doc, 2) fill every section (Title "[Type] desc", name, Zedu username, team, summary, why + proof, details, repro steps, acceptance checklist, links), 3) share "Anyone with the link, Viewer", 4) DM bigtiffs on Zedu with doc link + Zedu username + team, 5) after approval create the issue in the PRODUCTION repo under https://github.com/zeduchat (not the team or staging repo), include team name + Zedu username; Mark reviews next. This is how new Zedu work (Task 4 onwards) gets ticketed.
- DEADLINE (Mark, #announcement 6 Oct 14:05): a ticket must be submitted and approved through the official method before Wed 7 Oct 12:00 or the intern is dropped. Teams may vote a new lead within two hours of 15:28.
- Two ticket candidates on 6 Oct: (a) this session: direct load of https://zedu.chat/hng-internship/home returns HTTP 404 and the client shows "Something went wrong / Please restart application" with no recovery button; root cause: src/app/(client)/[org]/home has child routes but no page.tsx; screenshot Downloads/zedu-home-crash.jpg; not in zeduchat/zedu-fe issues. (b) a parallel Claude session (project dir C--Users-goodb): thread panel shows the parent message time as "5:45" without date/AM-PM; Google Doc already written, id 198rkqfrDGwnBWaVEh_yNffWOlJSfhUcDFl1uK_CmlYk, title "Zedu Ticket - Quetzal - Bayode Goodluck - Thread timestamp bug" (name may be wrong), proof PNG on Desktop. That session's notes: ~/.claude/projects/C--Users-goodb/memory/project_hng15.md.
- 6 Oct ~21:30: ticket doc finalised (name fixed to Bayode Manuel, title renamed, proof link added, sharing set to Anyone with the link / Viewer, verified HTTP 200 anonymously): https://docs.google.com/document/d/198rkqfrDGwnBWaVEh_yNffWOlJSfhUcDFl1uK_CmlYk/edit . Proof images published at docs/proof/ in this repo. User to DM bigtiffs on Zedu with doc link + username "senior man" + team Quetzal; after approval create the issue in zeduchat/zedu-fe. Second candidate (home URL 404) kept in Downloads/Zedu-Ticket-Home-404.txt.
- Mentors told Mela not to update members' branches; everyone must close their PR and open a new one from the synced dev (team dev = upstream dev 7a096ef at 15:40). PR #286 was 54 commits behind and failed the 'PR template' check (two boxes unticked; CI requires all 11 template boxes ticked) and 'Relay fork build' (fork build disabled in the team repo, team-lead setting).
- New branch feat/QZ-002-add-bayode-manuel-contributor pushed to HNG-Zedu-Quetzal at 15:42, based on 7a096ef, one line, author Bayode Manuel. New PR body ticks all 11 boxes (verified against .github/pull_request_template.md). #286 to be closed by the user once the new PR exists.
- 15:55: new PR #462 created on zedu-hng/zedu-fe from the team branch (right Chrome profile this time; the extension had reconnected from the goodborbor profile after a Chrome restart): https://github.com/zedu-hng/zedu-fe/pull/462. Supersedes #286.
- 16:03: #286 closed by the user. #462: all checks green (PR rules, Preview status, Relay fork build, Check lead approval, Route to team lead), review requested from Summiedev and prince-tiwaa. Nothing left on our side; waiting for merge.

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

## Open items (as of 6 Oct 2026, 16:10)

1. PR #462 on zedu-hng/zedu-fe awaits merge by Mela (Summiedev) or prince-tiwaa. All checks green. No need to message her.
2. Task 4: Mela said "hold on"; nothing posted yet. Watch Zedu #announcement and the team group.
3. Confirm Task 1 form was submitted (never confirmed).
4. Google consent screen for the shop: click Publish so any Google account can sign in (user's click).
5. Close the old Heron PR #6 (wrong team) and prune stale fork branches on seniormanvic419-netizen/zedu-fe.
6. Name spelling: Telegram and GitHub display show "Baryorde Manuel", forms and contributors entry say "Bayode Manuel".
7. Revoke the Cloudflare API token pasted in chat.
8. Side project: n8n WhatsApp credential still needs Access Token + Business Account ID from the Meta app
   "logistics & shipment" (ID 1102716399015231), WhatsApp > API Setup. Portfolio "Voom" exists.

## Working notes for the next session

- Chrome extension: after a Chrome restart it may connect from the goodborbor profile. Run list_connected_browsers
  and select the seniormanvic419 one (check by opening Gmail) before any GitHub work.
- Zedu PR rules (from .github/workflows/pr-rules.yml): single author per PR, branch from synced dev, PR to zedu-hng/zedu-fe dev
  from the team repo branch (not a personal fork), claim a QZ-xxx ticket in the group first, tick all 11 template boxes.
- User rules: ask before any public action; plain paste-ready text, no blockquotes; no Co-Authored-By lines.
