# Salt and Light United — Website Build

## Goal
Build a modern, youthful Next.js website for SLU (Christian youth fellowship for teens and tweens at National University Baliwag Inc), deployed on Vercel. Includes a hidden admin panel for content management, Facebook feed embedding, and a Gemini-powered AI assistant.

---

## Design Read
Reading this as: **Youth fellowship landing site for teens and tweens**, with a **modern, energetic, faith-centered** language, leaning toward **shadcn/ui + Tailwind + Motion** with a blue-dominant palette matching the SLU brand.

## Design Dials

| Dial | Value | Reasoning |
|------|-------|-----------|
| DESIGN_VARIANCE | 7 | Youthful — offset layouts, varied section compositions, not stiff |
| MOTION_INTENSITY | 7 | Teens expect motion — scroll reveals, hover effects, page transitions |
| VISUAL_DENSITY | 4 | Airy, clean, lots of breathing room — not cramped |

## Brand Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--slu-blue` | `#0770BD` | Primary accent, CTAs, links |
| `--slu-offwhite` | `#F0F0F0` | Page backgrounds, cards |
| `--slu-black` | `#0A0A0A` | Text, dark sections |
| Font | Aileron | Headings + body (via `next/font` or self-host) |

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | Vercel-native, RSC, SEO |
| Styling | Tailwind CSS v4 | Utility-first, matches shadcn |
| Components | shadcn/ui | Owned code, accessible, customizable |
| Animation | **Motion** (MIT, 18kb) | Scroll triggers, layout animations, declarative React API |
| Icons | @phosphor-icons/react | Clean, consistent, one family |
| Database | **NeonDB** (Postgres) + **Prisma** | Already configured in Vercel env; Prisma for type-safe queries + migrations |
| File Storage | **Vercel Blob** | Already configured in env.local |
| Auth | **NextAuth.js** + **Authy TOTP** | Admin auth; TOTP triggered only during long inactivity |
| AI | **Gemini API** (Flash free tier) | RAG chatbot — answer questions about SLU |
| Social | **Facebook oEmbed** | Embed page feed, no posting needed |
| Fonts | Aileron (self-host via `next/font`) | Brand requirement |
| Language | TypeScript | Type safety, better DX |
| Deployment | Vercel | Already configured |

---

## Architecture (MVC in Next.js App Router)

```
saltandlightunited/
├── app/                          # Views — Routes + Pages
│   ├── layout.tsx                # Root layout (nav, footer, fonts, theme provider)
│   ├── page.tsx                  # Home
│   ├── about/
│   │   └── page.tsx
│   ├── events/
│   │   └── page.tsx
│   ├── groups/
│   │   └── page.tsx
│   ├── resources/
│   │   ├── page.tsx              # Resources hub
│   │   └── [id]/page.tsx         # Individual resource detail
│   ├── contact/
│   │   └── page.tsx
│   ├── chat/
│   │   └── page.tsx              # Gemini AI chat interface
│   ├── admin/                    # Hidden admin panel
│   │   ├── layout.tsx            # Admin layout (auth gate)
│   │   ├── page.tsx              # Dashboard
│   │   ├── events/
│   │   │   ├── page.tsx          # List events
│   │   │   └── [id]/page.tsx     # Edit event
│   │   ├── devotionals/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── testimonies/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── pubmats/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── groups/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/                      # Controllers — API routes
│       ├── auth/[...nextauth]/route.ts
│       ├── events/route.ts
│       ├── devotionals/route.ts
│       ├── testimonies/route.ts
│       ├── pubmats/route.ts
│       ├── groups/route.ts
│       ├── chat/route.ts         # Gemini API proxy
│       ├── facebook/route.ts     # Facebook oEmbed proxy
│       └── upload/route.ts       # Vercel Blob upload
├── components/
│   ├── ui/                       # shadcn components
│   ├── layout/                   # Header, Footer, MobileNav
│   ├── sections/                 # Page sections (Hero, EventCard, etc.)
│   ├── admin/                    # Admin-specific components
│   ├── chat/                     # AI chat interface components
│   └── animations/               # Motion wrappers (ScrollReveal, etc.)
├── lib/                          # Models — Data + business logic
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth config + Authy TOTP
│   ├── gemini.ts                 # Gemini API client + RAG + scope guard
│   ├── facebook.ts               # Facebook oEmbed helper
│   ├── blob.ts                   # Vercel Blob helpers
│   ├── geo.ts                    # IP geolocation lookup (ip-api/ipinfo)
│   ├── audit.ts                  # Audit logging helper
│   ├── utils.ts                  # cn(), date formatting, general helpers
│   └── animations.ts             # Motion presets and configs
├── types/                        # TypeScript interfaces
│   └── index.ts
├── prisma/                       # Database schema + migrations
│   └── schema.prisma
├── public/                       # Static assets (logo, images)
├── tailwind.config.ts
├── next.config.ts
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

---

## Database Schema (NeonDB + Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  date        DateTime
  location    String?
  imageUrl    String?
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  pubmats     Pubmat[]
}

model Devotional {
  id            String   @id @default(cuid())
  title         String
  content       String
  author        String?
  scriptureRef  String?
  imageUrl      String?
  publishedAt   DateTime?
  createdAt     DateTime @default(now())
}

model Testimony {
  id          String   @id @default(cuid())
  authorName  String
  authorAge   Int?
  content     String
  imageUrl    String?
  approved    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Pubmat {
  id          String   @id @default(cuid())
  title       String
  description String?
  imageUrl    String
  category    String?
  eventId     String?
  event       Event?   @relation(fields: [eventId], references: [id])
  createdAt   DateTime @default(now())
}

model Group {
  id              String   @id @default(cuid())
  name            String
  description     String?
  meetingSchedule String?
  leader          String?
  imageUrl        String?
  createdAt       DateTime @default(now())
}

model Resource {
  id          String   @id @default(cuid())
  title       String
  type        String   // sermon | devotional | media
  content     String?
  fileUrl     String?
  thumbnailUrl String?
  createdAt   DateTime @default(now())
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("editor") // admin | editor
  authyId   String?
  createdAt DateTime @default(now())
  sessions  Session[]
  auditLogs AuditLog[]
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  token        String   @unique
  expiresAt    DateTime
  lastActiveAt DateTime @default(now())
  createdAt    DateTime @default(now())
}

model ChatHistory {
  id        String   @id @default(cuid())
  sessionId String
  role      String   // user | assistant
  content   String
  createdAt DateTime @default(now())
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  action      String   // create | update | delete | login | logout | view
  targetTable String?
  targetId    String?
  ipAddress   String?
  country     String?
  city        String?
  userAgent   String?
  metadata    Json?
  createdAt   DateTime @default(now())
}

model VisitorLog {
  id        String   @id @default(cuid())
  sessionId String?
  path      String?
  ipAddress String?
  country   String?
  city      String?
  referrer  String?
  userAgent String?
  createdAt DateTime @default(now())
}

model SiteSetting {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
}
```

---

## Pages & Sections (CCF-inspired, youthified)

### 1. Home (`/`)
| Section | Content | Layout |
|---------|---------|--------|
| Hero | SLU logo + tagline + CTA ("Join Us") | Full-width, split (text left, visual right) |
| About Strip | One-liner about SLU + "Learn More" link | Centered, minimal |
| Upcoming Events | 3 featured event cards (from DB) | 3-col grid (stacks on mobile) |
| Facebook Feed | Recent SLU Facebook posts (oEmbed) | 2-3 column grid |
| Small Groups Preview | 2-3 group cards with images | Bento-style (1 large + 2 small) |
| Scripture Banner | John 3:16 in branded styling | Full-width blue background |
| Call to Action | "Be Part of SLU" + join button | Centered, clean |

### 2. About (`/about`)
| Section | Content |
|---------|---------|
| Hero | "About Salt and Light United" |
| Mission & Vision | Two-column, icon-supported |
| Story | Brief origin/background paragraph |
| Leaders | Leader cards (photo, name, role) |
| Affiliation | National University Baliwag note |

### 3. Events (`/events`)
| Section | Content |
|---------|---------|
| Hero | "Upcoming Events" |
| Event Grid | Cards with date, title, description, image (from DB) |
| Past Events | Collapsed/expandable section |

### 4. Small Groups (`/groups`)
| Section | Content |
|---------|---------|
| Hero | "Our Groups" |
| Group Cards | Image + name + description + meeting schedule (from DB) |
| How to Join | Steps or CTA |

### 5. Resources (`/resources`)
| Section | Content |
|---------|---------|
| Hero | "Resources" |
| Resource Categories | Tabs or grid (Sermons, Devotionals, Testimonies) |
| Featured Items | Cards with title, date, thumbnail (from DB) |

### 6. Contact (`/contact`)
| Section | Content |
|---------|---------|
| Hero | "Get in Touch" |
| Contact Form | Name, email, message (shadcn Form) |
| Location | Map or address (NU Baliwag) |
| Social Links | Facebook, etc. |

### 7. AI Chat (`/chat`)
| Section | Content |
|---------|---------|
| Chat Interface | Gemini-powered Q&A about SLU |
| Suggested Prompts | "What groups are available?", "When's the next event?" |

### 8. Admin Panel (`/admin`) — HIDDEN
| Page | Functionality |
|------|---------------|
| Dashboard | Overview — recent content, quick actions |
| Events CRUD | Create, edit, delete events |
| Devotionals CRUD | Create, edit, publish devotionals |
| Testimonies CRUD | Manage testimonies, approve/reject |
| Pubmats CRUD | Upload and manage publication materials |
| Groups CRUD | Manage small group info |
| Settings | Site settings, admin management |

---

## Shared Components

| Component | Purpose |
|-----------|---------|
| `Header` | Responsive nav — logo left, links right, hamburger on mobile |
| `Footer` | Site links, social icons, copyright, SLU branding |
| `Hero` | Reusable hero section (title, subtitle, CTA, optional image) |
| `EventCard` | Event preview card |
| `GroupCard` | Small group preview card |
| `LeaderCard` | Leader profile card |
| `ScriptureBanner` | Branded scripture display |
| `FacebookFeed` | oEmbed-based Facebook post grid |
| `ScrollReveal` | Motion scroll-triggered entrance wrapper |
| `PageTransition` | Route change animation |
| `ChatInterface` | Gemini AI chat UI |
| `AdminSidebar` | Admin panel navigation |
| `DataTable` | Reusable admin data table (shadcn) |
| `FileUploader` | Vercel Blob file upload component |
| `ContentEditor` | Rich text editor for devotionals/testimonies |
| `AuditTable` | Filterable audit log viewer (admin) |
| `ScopeGuard` | AI chat scope validation wrapper |

---

## API Integrations

### Facebook oEmbed
- Route: `GET /api/facebook`
- Fetches embed HTML for SLU's Facebook Page posts
- Proxied server-side to avoid CORS + token exposure
- No App Review needed for read-only oEmbed (Meta oEmbed Read)

### Gemini AI Chat
- Route: `POST /api/chat`
- Model: Gemini Flash (free tier — 5-15 RPM, ~1000 req/day)
- RAG approach: system prompt includes SLU content (events, groups, beliefs, schedule)
- Token usage: low — simple Q&A, no complex generation
- Fallback: polite "I don't have that information" when unsure

### Vercel Blob (File Upload)
- Used for: pubmat images, testimony images, devotional images
- Admin uploads via `/api/upload` → stored in Vercel Blob
- Public URLs stored in NeonDB

### Auth (NextAuth + Authy)
- NextAuth handles session management
- Authy TOTP only triggered during long inactivity (not every login)
- Admin roles: `admin` (full access), `editor` (content only)
- Hidden admin route — not linked in navigation

### Audit Logging + IP/Geo Tracking
- **Middleware**: `middleware.ts` captures IP + user-agent on every request
- **Geo lookup**: Free `ip-api.com` batch endpoint (no key needed, 45 req/min limit) — or `ipinfo.io` (50k req/month free)
- **Admin actions**: Every CRUD operation in admin panel writes to `audit_logs` with user, action, target, IP, geo
- **Visitor tracking**: Page views logged to `visitor_logs` with IP, geo, path, referrer
- **Admin audit viewer**: `/admin/audit` page — filterable table of all logged actions
- **Privacy**: IPs hashed after 30 days, visitor logs auto-purged after 90 days
- **Implementation**: `lib/audit.ts` helper + `lib/geo.ts` IP lookup utility

### AI Assistant Scoping (SLU-Only)
- **System prompt lock**: Gemini receives a system prompt that explicitly restricts it to SLU-related topics only
- **Scope definition**: The system prompt includes all SLU content (events, groups, beliefs, schedule, mission, contact info) and instructs the model to refuse anything outside this scope
- **Refusal response**: When asked about non-SLU topics, the assistant responds with a polite redirect: "I'm here to help with Salt and Light United questions. For other topics, I'd recommend searching the web."
- **Pre-filter layer**: Before sending to Gemini, a lightweight keyword check filters obviously off-topic queries (politics, other organizations, personal advice, etc.)
- **No chaining**: The chat is stateless per request — no conversation history that could drift the model off-topic
- **Rate limiting**: Max 20 messages per session to prevent abuse
- **Implementation**: `lib/gemini.ts` — system prompt template + pre-filter + scope guard

---

## Implementation Order

### Phase 1: Scaffold
- [ ] Initialize Next.js project with TypeScript + Tailwind
- [ ] Install and configure shadcn/ui
- [ ] Install Motion, @phosphor-icons/react, prisma, @prisma/client
- [ ] Set up brand tokens in `tailwind.config.ts`
- [ ] Self-host Aileron font via `next/font`
- [ ] Configure Prisma with NeonDB connection
- [ ] Create initial schema + run migration

### Phase 2: Layout Shell
- [ ] Build `Header` component (responsive nav, hamburger)
- [ ] Build `Footer` component (links, branding, social)
- [ ] Create `app/layout.tsx` with Header + Footer + theme provider

### Phase 3: Home Page
- [ ] Build `Hero` section (split layout, CTA)
- [ ] Build About Strip section
- [ ] Build Upcoming Events section (data from DB)
- [ ] Build Facebook Feed section (oEmbed)
- [ ] Build Small Groups Preview (bento layout)
- [ ] Build Scripture Banner (John 3:16)
- [ ] Build CTA section

### Phase 4: Inner Pages
- [ ] About page (mission, vision, leaders)
- [ ] Events page (event grid from DB)
- [ ] Groups page (group cards from DB)
- [ ] Resources page (categorized grid from DB)
- [ ] Contact page (form + info)

### Phase 5: Admin Panel
- [ ] Set up NextAuth with credentials provider
- [ ] Build admin layout (auth gate, sidebar)
- [ ] Build admin dashboard
- [ ] Build CRUD pages for events, devotionals, testimonies, pubmats, groups
- [ ] Build file upload component (Vercel Blob)
- [ ] Build content editor (rich text)

### Phase 6: API Integrations
- [ ] Facebook oEmbed proxy route
- [ ] Gemini AI chat endpoint + RAG system prompt + SLU-only scope guard
- [ ] Chat interface UI
- [ ] Authy TOTP integration for long inactivity
- [ ] IP/Geo lookup utility (`lib/geo.ts`)
- [ ] Audit logging helper (`lib/audit.ts`)
- [ ] Middleware for visitor tracking + IP capture
- [ ] Admin audit log viewer (`/admin/audit`)

### Phase 7: Animation
- [ ] Create `ScrollReveal` wrapper (Motion)
- [ ] Add entrance animations to all sections
- [ ] Add hover effects to cards and buttons
- [ ] Add page transition animations

### Phase 8: Content & Polish
- [ ] Add placeholder images (Picsum or generated)
- [ ] Fill in real copy content
- [ ] Dark mode support
- [ ] Mobile responsiveness audit
- [ ] Accessibility check (contrast, focus states, labels)

### Phase 9: Verification
- [ ] `npm run build` — no errors
- [ ] `npm run lint` — clean
- [ ] Lighthouse audit (Performance, A11y, SEO)
- [ ] Test all routes on mobile viewport
- [ ] Verify animations work, respect reduced-motion
- [ ] Test admin CRUD operations
- [ ] Test audit logging — verify CRUD actions appear in audit log
- [ ] Test visitor logging — verify page views tracked with IP/geo
- [ ] Test Gemini chat — SLU questions answered correctly
- [ ] Test Gemini chat — non-SLU questions refused with redirect
- [ ] Test Facebook feed rendering
- [ ] Verify auth flow + TOTP trigger

---

## Done When
- [ ] All 8 pages render correctly (6 public + chat + admin)
- [ ] Admin panel functional with full CRUD
- [ ] Audit logging captures all admin actions with IP/geo
- [ ] Visitor tracking logs page views with IP/geo
- [ ] Audit log viewer accessible in admin panel
- [ ] Facebook feed embeds successfully
- [ ] Gemini chat answers SLU questions accurately
- [ ] Gemini chat refuses non-SLU questions with polite redirect
- [ ] Responsive across mobile, tablet, desktop
- [ ] Animations are smooth and purposeful
- [ ] Brand tokens applied consistently
- [ ] Auth flow works, TOTP triggers on long inactivity
- [ ] Build passes without errors
- [ ] Deployed to Vercel successfully

---

## Notes
- **POTENTIAL NAME CHANGE**: "Salt and Light United" may become "Salt and Lamp United". All branding strings MUST be in a single config file (`lib/brand.ts`) for easy swap. Do NOT hardcode the name in components.
- Aileron font: check Google Fonts availability or self-host from brand assets
- Placeholder images: use `https://picsum.photos/seed/{section}/{w}/{h}` until real assets provided
- Keep Motion usage restrained — scroll reveals + hover effects, not overwhelming loops
- The current Vercel deployment is empty (404) — this will be the first real deploy
- Logo files available in `Salt Light United (SLU) Branding Asset Guide/` — multiple formats (SVG, PNG, WebP)
- NeonDB + Vercel Blob already configured — check `.env.local` for connection strings
- Facebook oEmbed requires Meta Developer account + App (free, but needs App Review for production)
- Gemini free tier is sufficient for this use case — monitor usage, no immediate cost concern
- **IP/Geo**: ip-api.com is free (45 req/min, no key), ipinfo.io has 50k req/month free tier. Use batch endpoint to stay under limits
- **Audit logs**: Auto-purge visitor logs after 90 days, hash IPs after 30 days for privacy compliance
- **AI scope**: System prompt is the primary guard. Pre-filter is a lightweight secondary check. Neither is foolproof — monitor chat logs periodically for scope drift
