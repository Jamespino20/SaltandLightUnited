# Salt and Light United — Website View Expectations

## 1. Core Design Standards

### 1.1 Mobile-first

The entire website must be designed for mobile first and progressively enhanced for tablet and desktop.

Priority viewports:

- 375px–430px: primary mobile experience
- 768px: tablet
- 1024px: small desktop/tablet landscape
- 1440px+: full desktop

Desktop-specific layouts must never become requirements that compromise the mobile experience.

### 1.2 Visual identity

The site must consistently use the SLU blue-and-white visual language.

- Primary brand blue: `#0770BD`
- Dark surface: `#0A0A0A`
- Off-white/light surface: `#F0F0F0`
- Primary typeface: Aileron SemiBold for major headings and branded statements
- Supporting text may use the appropriate Aileron weight required for readability
- Text must remain solid-color; do not use gradient-filled typography
- Blue and white wave-like shapes should be used as recurring structural elements rather than isolated decoration

### 1.3 Wave language

Wave forms are a core visual motif.

Use them for:

- section transitions
- white-section accent blocks
- side glows
- content dividers
- background masks
- CTA transitions

Wave elements must remain decorative and must not:

- create horizontal overflow
- obscure text
- block buttons
- interfere with scrolling or touch interaction

### 1.4 Full-screen sections

Each major homepage section should occupy approximately one viewport of content.

Use viewport-aware sizing such as `min-height: 100svh` rather than relying exclusively on `100vh`, particularly on mobile where browser UI changes the effective viewport.

Sections may exceed one viewport when their content genuinely requires it. Never force content into a fixed height merely to preserve the visual composition.

### 1.5 Storytelling and motion

The homepage should feel like one continuous visual story rather than a collection of independent cards.

Motion should support:

- spatial continuity
- content hierarchy
- transitions between sections
- visual emphasis
- the recurring SLU light motif

Avoid decorative animation that exists only because an element can move.

All animation must provide:

- a reduced-motion fallback
- no blocking interaction
- no excessive parallax on mobile
- no animation that causes layout shift

---

# 2. Global Navigation

## 2.1 Header

The header begins as a dark/black interface during the Hero.

It contains:

- SLU blue-white pill/logo
- hamburger/navigation control (hamburger during mobile view)
- section navigation when expanded

As the user progresses through the page, the header should automatically transition between dark and light visual states according to the active section.

Header theme states:

- Hero: dark
- About: dark
- Events: transitioning to light
- Facebook: light
- Small Groups: light
- Scripture: transitioning to dark
- CTA: dark

The header must remain readable during every transition.

Do not abruptly swap the header's colors. Animate its surface, icon, logo, and text colors together.

## 2.2 Section sidebar

Desktop:

- Persistent vertical sidebar
- One clickable navigation tab/dot per homepage section
- Active section is visually emphasized
- Clicking a tab smoothly scrolls to the corresponding section
- Sidebar never covers critical content

Sections:

1. Hero
2. About
3. Events
4. Facebook
5. Small Groups
6. Scripture
7. CTA

Mobile:

- Do not force a desktop sidebar into the screen
- Collapse the section navigation into a compact touch-friendly progress/navigation control
- Keep the same section IDs and navigation logic so both layouts use one navigation system

The active section should be determined through `IntersectionObserver` or equivalent section visibility tracking rather than manually updated click state.

---

# 3. Navigation and Page Transitions

## 3.1 In-page transitions

Scrolling between homepage sections should feel continuous.

Use:

- smooth scrolling
- scroll-triggered animation
- section-level color transitions
- coordinated wave movement
- persistent light-motif continuity

The scroll system must not fight native touch scrolling on mobile.

## 3.2 Route transitions

Navigation between separate pages should use seamless View Transition behavior where supported.

Use the View Transitions API as progressive enhancement rather than making the experience dependent on it.

Recommended behavior:

Supported browser:

- View Transition animation

Unsupported browser:

- normal Next.js navigation
- no visual break in layout

The transition must never block route navigation for an extended period.

---

# 4. Homepage — Hero

## Visual state

The site initially opens on:

`#0A0A0A`

The Hero should feel dormant rather than immediately populated.

Sequence:

1. Black screen
2. A subtle blue atmospheric field begins appearing
3. A blue outer / white-centered light core activates near the center
4. The core gently pulses outward
5. The SLU logo fades/scales into view
6. Header controls appear
7. Hero text resolves into place

The opening animation must be short enough that the user is not forced to wait before interacting with the website.

Desktop may use subtle atmospheric movement.

Mobile should use a simplified version of the same effect to minimize GPU load.

When `prefers-reduced-motion: reduce` is active:

- remove pulsing movement
- remove large-scale expansion
- use a simple opacity fade

## Hero content

### Primary statement

**Be the Salt.**
Blue.

**Be the Light.**
White.

### Supporting copy

Salt and Light United is a Christ-centered community of students and young people in Baliwag City, Bulacan, Philippines. We encounter Christ, grow together, and shine His light in our schools and streets.

The copy should remain highly readable on mobile and must not become visually subordinate to the animation.

---

# 5. About Section

## Visual transition

The Hero transitions into About without a hard cut.

A vignetted version of `seventh_pic` appears as the dominant background visual.

The image should:

- remain visually subordinate to text
- use controlled zoom/parallax on desktop
- use minimal movement on mobile
- maintain sufficient contrast for text

## Content

Primary statement:

**We don't walk alone.**

"alone" is blue.

Supporting copy:

Salt and Light United is a family of young believers in Baliwag City — united by faith, growing together in Christ, and carrying His light into our schools, homes, and streets. You were never meant to follow Him by yourself.

CTA:

**Learn more about us →**

The CTA must remain an actual accessible link rather than a purely decorative interaction.

---

# 6. Upcoming Events Section

## Transition

While leaving About:

- `seventh_pic` gradually zooms forward
- a white wave enters the viewport
- the visual center transitions from photographic/dark to clean/light
- the header transitions from dark to light

The white state established here persists through Events, Facebook, and Small Groups.

## Desktop layout

Left:

- interactive calendar

Right:

- three upcoming events

Events must be ordered:

1. nearest upcoming event
2. second upcoming event
3. third upcoming event

The calendar should provide a visual date context rather than functioning as a full external scheduling application.

Selecting a date should reveal the associated event information.

The event cards should visually separate from the calendar with a controlled staggered entrance.

## Mobile layout

Do not place the calendar and three events permanently side-by-side.

Preferred structure:

1. compact calendar/date selector
2. selected/upcoming event
3. remaining upcoming events stacked vertically

Touch targets must be large enough for comfortable use.

No event interaction should require hover.

---

# 7. Facebook Feed Section

Maintain the white visual state.

Layout:

Desktop:

- left: SLU-specific contextual copy
- right: official Facebook oEmbed content

Mobile:

- contextual copy first
- Facebook content second

The embedded content must remain contained within the site layout.

Do not allow Facebook's embedded content to:

- create horizontal overflow
- dominate the visual hierarchy
- become the primary call to action

The website remains the primary SLU experience; Facebook is supporting content.

---

# 8. Small Groups Section

The section should emphasize belonging and community.

## Visual

Use a photo carousel featuring real SLU groups and activities.

Photos transition approximately every 4 seconds.

Each slide includes:

- image
- group/category label where relevant
- short caption

Transition:

- smooth crossfade or controlled horizontal movement
- no aggressive 3D effects
- no layout jump

## Interaction

The carousel must support:

- automatic rotation
- manual previous/next controls
- swipe gestures on mobile
- pause on user interaction
- pause when the carousel is not visible
- pause while a user is interacting with it

Automatic movement must stop for users who enable reduced motion.

Real SLU photography should replace temporary imagery when available. The current project already identifies worship, fellowship, Bible study, outreach, camp, and candid photography as required official assets.

---

# 9. Scripture Section

## Transition

The white interface gradually returns to the dark SLU visual language.

The header must transition with the section rather than changing independently.

A wave or light-based transition should visually connect the white sections to the dark Scripture section.

## Content

Display:

- three verses related to the current message/content
- SLU's primary/ministry verse

Each verse appears as an individual card.

Cards enter through:

- fade
- slight scale-up
- subtle positional movement

Do not use excessive card movement.

Cards should remain readable and usable on mobile.

The Scripture section should feel like a deliberate pause in the site's narrative rather than another content grid.

---

# 10. CTA Section

The existing CTA implementation should remain structurally intact, with the following visual corrections.

## Primary visual

Use the SLU blue-white badge/pill logo as the main brand mark.

Do not substitute plain "SLU" text for the primary branded mark.

## Text treatment

White:

**You've seen who we are**

**Be the Light**

Blue:

**Now come be part of it**

**Be the Salt**

The color contrast should remain solid and high-contrast; no gradient typography.

The CTA should feel like the culmination of the entire homepage story.

The final visual relationship should communicate:

**Encounter → Community → Growth → Gathering → Mission → Invitation**

This follows the existing homepage storytelling direction.

---

# 11. Responsive Rules

Every desktop interaction must have a mobile equivalent.

Never rely exclusively on:

- hover
- cursor position
- precise pointer movement
- desktop-only parallax
- side-by-side layouts

Mobile substitutions should include:

- tap
- swipe
- vertical stacking
- simplified animation
- touch-friendly navigation

The site should be tested at minimum at:

- 375px
- 390px
- 430px
- 768px
- 1024px
- 1440px

---

# 12. Performance Requirements

Animations must not cause measurable layout instability.

Avoid animating:

- `top`
- `left`
- `width`
- `height`

when equivalent `transform` or `opacity` animations can be used.

Prefer:

- `transform`
- `opacity`
- compositor-friendly effects

Lazy-load non-critical images.

Prioritize only the Hero's critical visual assets.

Do not load every section's animation or image at initial page load.

The website must remain usable even when animation assets fail to load.

---

# 13. Accessibility Requirements

All navigation controls must be keyboard accessible.

All interactive controls must have:

- visible focus states
- appropriate labels
- sufficient touch targets
- semantic button/link behavior

Every image requires appropriate alternative text unless it is genuinely decorative.

Animation must respect:

`prefers-reduced-motion: reduce`

Reduced-motion mode should preserve:

- section order
- visual hierarchy
- navigation
- content
- functionality

while removing unnecessary motion.

Color should never be the only method of communicating an active state.

---

# 14. Implementation Principle

The website should feel like **one continuous SLU experience**, not seven unrelated sections.

The recurring visual system is:

**Light → Wave → Blue/White → Community → Scripture → Light**

Every animation, transition, image treatment, and layout decision should reinforce that system.

The design should prioritize:

**clarity > spectacle**
**storytelling > decoration**
**real SLU content > placeholders**
**mobile usability > desktop complexity**
**purposeful motion > constant motion**
