# Salt and Light United — Project Checklist

> Living tracker for outstanding work. Tick boxes as items land. Keep this file in sync with PRs/commits.

## How to read
- **[ ]** = todo | **[x]** = done | **◐** = in progress / partial
- Sections match the phases in `saltandlightunited-website.md` plus new features added since.

---

## 0. Homepage presentation & storytelling

**Done so far (see git history):**
- [x] Scripted, animated homepage — LIGHT → COMMUNITY → GROWTH → GATHER → MISSION → INVITATION
- [x] GSAP + ScrollTrigger + Lenis smooth scroll, `prefers-reduced-motion` respected
- [x] Recurring warm "light" motif travels the page; scroll-progress light bar
- [x] Group cards with per-group treatments (Teens glow / Worship waveform / Tweens particles)
- [x] Events as a scroll-lit timeline; Scripture as a cinematic pause

**Waiting on James — homepage expectations (basis for the "done" definition):**
- [ ] **HOME PAGE EXPECTATIONS** — James to author his own list of how each homepage section should present (feel, order, imagery, copy). Template below.

> ### Homepage — James's expectations (self-author here)
> - Hero:
> - About / Community:
> - Groups:
> - Events:
> - Scripture:
> - CTA / Footer:
> - Overall mood (1 line):
> - "Done when" for the homepage:
- [ ] QA re-review of the redesigned homepage after photos land

---

## 1. Brand assets, imagery & favicon

- [x] **Migrate brand assets → `public/images/`** (moved `public/brand/*` → `public/images/`; `.assets/` was already empty)
- [x] Update references from `/brand/...` → `/images/...` (CallToAction)
- [x] Add a **favicon** (`app/icon.svg` — blue tile + warm "light" mark on brand)
- [ ] **Official SLU photos** — James to obtain (worship, fellowship, Bible study, outreach, camp, candid)
- [ ] Upload official photos to **Vercel Blob** (`/api/upload`) and store URLs in the DB (events, groups, testimonies, devotionals, pubmats)
- [x] Swap placeholder graphics on homepage/leaders with real photos (About, carousel)
- [ ] Keep placeholders marked clearly until real assets land

---

## 2. Authentication (large gap — not started)

Current: `src/lib/auth.ts` has `providers: []` — empty. No login route, no session, no gate.

- [x] Implement NextAuth v5 Credentials provider (scrypt-hashed password, `src/lib/auth.ts`)
- [x] Add password hashing (`src/lib/password.ts`, node crypto — no new dep) + seed admin account (`prisma/seed.ts`, run `npm run db:seed`)
- [x] Build `/login` page (design-matched, hidden — not linked in nav)
- [x] Build **sign-out** (real — admin layout now shows the session user + Sign out button)
- [x] Protect `/admin/**` with an auth gate (`src/middleware.ts` → redirect to `/login` when no session)
- [x] Role handling: `admin` vs `editor` is on the session token; CRUD-by-role gating not yet enforced in APIs
- [ ] Authy TOTP on long inactivity (planned; optional now)
- [ ] Audit-log login/logout events (`lib/audit.ts`)

**Runtime setup still required (cannot run without the DB/env):**
- [ ] Set `AUTH_SECRET` in `.env.local` + Vercel (middleware + JWT sessions need it)
- [ ] `npm run db:push` (or `db:migrate`) to add `User.passwordHash`
- [ ] `npm run db:seed` to create the first admin (override with `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` / `ADMIN_ROLE`)

---

## 3. Complete the admin panel

The UI shell + CRUD pages exist, but several are not wired to real data/API.

- [ ] Verify each admin CRUD page actually calls `/api/...` and updates the DB (events, devotionals, groups, testimonies, pubmats)
- [ ] Admin dashboard — summary stats from DB (counts, recent items, quick actions) instead of static numbers
- [ ] **File upload UI** (Vercel Blob) wired into pubmats/testimonies/devotionals forms (a `FileUploader` component)
- [ ] **File download/list** endpoint (Blob list + download link) for resources/pubmats
- [ ] Rich-text editor for devotionals/testimonies content (`ContentEditor`)
- [ ] Testimony **approve/reject** workflow
- [ ] Settings page — real `SiteSetting` CRUD (contact info, social links, featured content)
- [ ] Audit log viewer — wire to real `/api` data (currently placeholder search)

---

## 4. Make public pages database-driven

Currently the public pages use hardcoded arrays.

- [ ] Home "Upcoming Events" + `events/page.tsx` — pull from DB via `/api/events` (or server-side Prisma)
- [ ] `groups/page.tsx` + homepage groups — pull from DB
- [ ] `resources/page.tsx` — pull resources from DB; build missing `resources/[id]` detail page
- [ ] About page leaders — photo + name + role (from DB or static asset, per James's expectations)
- [ ] Contact form — actually submit (store in DB or email) instead of dead inputs

---

## 5. AI assistant (Gemini)

`src/lib/gemini.ts` exists; the chat page exists; needs the missing pieces.

- [ ] Add `GEMINI_API_KEY` to `.env.local` **and** to Vercel env vars (not configured yet)
- [ ] Confirm `chat/page.tsx` calls `/api/chat` and renders streaming/plain responses
- [ ] **SLU-only scope guard**: pre-filter off-topic queries + refusal message (system prompt exists; tier-2 filter not built)
- [ ] Rate limiting / max 20 messages per session
- [ ] Suggested prompts UI ("What groups are available?", "When's the next event?")
- [ ] Optional: pull live DB context (events/groups) into the RAG prompt

---

## 6. Auto-translation — Tagalog / English (NEW)

Not in the original plan — scoping needed.

- [ ] Decide approach: Google Translate API, Gemini translate, or `next-intl`/ICU with manual strings
- [ ] Language toggle (EN ↔ Taglish) persisted (localStorage/cookie)
- [ ] Translate homepage + key pages; admin-authored content stays as-is or gets on-the-fly translate
- [ ] Decide: full bilingual routes (`/tl`) or in-page toggle
- [ ] (Recommended before building: pick approach + list which strings/pages are in scope)

---

## 7. Bible feature — NIV / ESV (NEW)

- [ ] Decide translation source: public domain (WEB/KJV) vs licensed (NIV/ESV need licenses) vs Bible API (e.g. API.Bible with key)
- [ ] Build a `/bible` page — book/chapter picker + reading view
- [ ] NIV/ESV toggle (respect the license if using those — may need `biblica`/Bible Gateway API key)
- [ ] Optional: search + daily verse widget
- [ ] (Recommended before building: settle the translation source/licensing — this is the main risk)

---

## 8. Files — upload / download

- [ ] `/api/upload` — used by admin forms (exists; wire into UI)
- [ ] Add **list/download** endpoints over Vercel Blob (fetch file metadata + signed/public URL)
- [ ] File-uploader component + "delete file" (delete Blob) in admin
- [ ] Resources admin → upload sermon/media files, expose download on `resources/[id]`

---

## 9. Facebook feed

- [ ] `lib/facebook.ts` oEmbed helper to fetch SLU page posts
- [ ] `FacebookFeed` section on homepage (planned in the doc, not built)
- [ ] Handle API key / App Review requirement for production oEmbed

---

## 10. Analytics, audit & privacy (planned, not wired)

- [ ] `middleware.ts` — capture IP + user-agent, log visitors to `visitor_logs` (+ geo)
- [ ] `lib/audit.ts` — call on every admin CRUD (routes don't write audit logs yet)
- [ ] Admin audit-log viewer reads real data
- [ ] Privacy: hash IPs after 30 days, purge visitor logs after 90 days

---

## 11. Deployment & environment

- [ ] Add env vars to **Vercel** (Project Settings → Environment Variables):
  - `SALTANDLIGHTUNITED_DATABASE_URL`, `SALTANDLIGHTUNITED_DATABASE_URL_UNPOOLED`
  - `BLOB_STORE_ID`, `BLOB_READ_WRITE_TOKEN`
  - `GEMINI_API_KEY`
  - NextAuth secret (`AUTH_SECRET`/`NEXTAUTH_SECRET`)
- [ ] Rotate the DB/blob secrets that appeared in this chat (defensive)
- [ ] `prisma generate` on every Vercel build (verify it's automatic for this project)
- [ ] Confirm `.env.local` stays out of git (already gitignored)
- [ ] Re-run the QA review after auth + assets land

---

## 12. Polish & QA (phase 8/9 from the planning doc)

- [ ] Dark mode support
- [ ] Accessibility pass (contrast, focus rings, labels, keyboard nav) — Lighthouse
- [ ] Mobile audit 375/768/1024/1440
- [ ] Animations reviewed again after content changes (reduced-motion is covered)
- [ ] Final walkthrough of every route incl. admin + chat

---