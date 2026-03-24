# UI Improvement Plan — Visual Content (Images & Video)

## Rationale

The current UI is text-heavy with gradient overlays but no real visual content. For a dance studio, the site should feel kinetic. Dance is inherently visual — the UI should reflect that.

---

## 1. Hero Section (Homepage)

**Current:** Static background with CSS gradient overlay.
**Improvement:** Looping background video (muted, autoplay, loop) with a poster image fallback.

- 10-15s clip of dancers in motion
- `<video>` element with `poster`, `muted`, `autoPlay`, `loop`, `playsInline`
- Cinematic overlay preserved on top
- Fallback to poster image on unsupported browsers / slow connections
- File: `app/components/Hero.tsx`

---

## 2. EventsPreview (Homepage)

**Current:** Hardcoded data with no images. "Join Event" buttons call `bookEvent()` with fake IDs (broken).
**Improvement:** Fetch real events from the DB and display event images.

- Convert to a server component or accept events as props from the homepage
- Show `event.image` with `next/image` on each card
- Link to event detail page instead of booking directly from homepage
- File: `app/components/EventsPreview.tsx`, `app/page.tsx`

---

## 3. Pricing Section

**Current:** Pure text and icons, no visual content.
**Improvement:** Add a subtle background image or short video clip behind the section header.

- Background image with low opacity or a blurred dance photo
- Keep card readability — visuals should enhance, not distract
- File: `app/components/Pricing.tsx`

---

## 4. About Page

**Current:** Instructor section uses OAuth avatars (tiny, generic). Sections are text-only.
**Improvement:** Add a visual gallery / video embed section.

- Instructor portraits (dedicated images, not OAuth avatars)
- Optional: embedded YouTube/Vimeo video of a class or studio tour
- Image grid or masonry layout of studio life
- File: `app/about/page.tsx`

---

## 5. Events Listing Page

**Current:** Event cards in `EventsList` have no images.
**Improvement:** Add event images to the listing cards.

- Show `event.image` with `next/image` as a card header
- Consistent aspect ratio (16:9 or 4:3)
- Fallback placeholder for events without images
- File: `app/components/EventsList.tsx`

---

## What to Avoid

- Video on every section (performance hit, user distraction)
- Stock photos — authentic content matters for a dance studio
- Auto-playing audio
- Large unoptimized media files — use WebM/MP4 for video, WebP for images

---

## Assets Needed

| Asset | Format | Usage |
|-------|--------|-------|
| Hero background video | MP4 + WebM, ~10-15s, 1080p max | Hero section |
| Hero poster image | JPG/WebP, 1920x1080 | Video fallback |
| Instructor portraits | JPG/WebP, 400x400 min | About page |
| Studio/class photos | JPG/WebP, various | About gallery, Pricing bg |
| Event default placeholder | JPG/WebP, 800x600 | Events without images |

> Placeholder images from `/public` will be used initially. Swap with real content later.

---

## Implementation Order

1. Hero video background
2. EventsPreview — real data + images (also fixes the broken fake-ID bug)
3. Events listing — images on cards
4. About page — gallery / video section
5. Pricing — background visual

---

## Config Prerequisite

Before any external images work, `next.config.ts` must be updated with `images.remotePatterns` to allow domains used for event images and user avatars.
