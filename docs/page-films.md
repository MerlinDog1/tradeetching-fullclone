# Thirteen page films — 6 November 2026

This branch replaces the three animated service heroes with their static-photo
layouts and adds one standalone, below-hero film card to every sitemap route.
`src/page-films.mjs` is the route-to-slug, heading and accessible-summary contract.
The card uses H2; the existing page H1, canonical URLs and legacy aliases remain.

## Playback contract

- 16:9 above 767px; 9:16 at 767px and below. Only the selected poster is fetched.
- No video `src`, child `source`, autoplay, loop or preload on initial render.
  `preload="none"` is retained. Only an explicit Play action attaches the MP4.
- Native video controls plus a persistent keyboard-operable Play/Pause button.
- Offscreen/tab-hidden playback pauses. Returning onscreen never starts it.
- Crossing the orientation breakpoint pauses and unloads; another explicit Play
  selects the new orientation. Enabling reduced motion also pauses/unloads.
- Errors restore the still and announce a retry message. No JavaScript leaves a
  poster, summary and explanatory note, without a dead play control.
- The old homepage workshop video is a static still in this preview, preventing
  any unrelated automatic video fetch when scrolling down the homepage.

Queen Anne imagery/copy is restricted to the architecture page. The homepage’s
architectural teaser now uses the existing generic etched-pattern photograph.
The architecture card retains **© Tobias Lange-Rüb / CRUCERO** and the explicit
private-preview clearance note. No clearance is asserted.

## Media handoff (parent supplies real renders)

For all 13 keys in `src/page-films.mjs`, copy:

```
public/media/page-films/<key>/landscape-web.mp4
public/media/page-films/<key>/portrait-web.mp4
public/media/page-films/<key>/landscape-poster.webp
public/media/page-films/<key>/portrait-poster.webp
public/media/page-films/<key>/landscape-poster.jpg
public/media/page-films/<key>/portrait-poster.jpg
```

Each MP4 is silent, 12 seconds and the stated aspect ratio. There are no fake
media files in public. Yesterday’s `public/media/hero-films/`, source module,
CSS and player are retained, but no longer referenced by generated pages.
`test:hero` is historical and expects the old three-hero layout, so use
`test:films` for this branch. Its blur call is guarded and its formerly unbounded full-page screenshot is
now viewport-tiled, avoiding a giant Chromium raster allocation. This historical
suite is not run against the new layout.

## Local verification

```sh
npm ci
npm run build
npm run check
PORT=4226 npm run preview
PREVIEW_URL=http://127.0.0.1:4226 npm run test:films
PREVIEW_URL=http://127.0.0.1:4226 npm run test:browser
```

The film suite checks all 13 pages at 1440px/390px in ordinary/reduced-motion
modes (52 cases), poster orientation, zero video requests before Play, keyboard
play/pause, native controls, offscreen pause without restart, one H1, overflow,
axe, resize, preference changes, tab visibility, error recovery and no-JS.
The non-fixture run also uses ffprobe to check the 26 real files for duration,
aspect and absence of audio. Reports/screenshots go in ignored `review/`.

Before real renders arrive, these explicit modes check integration only:

```sh
npm run check -- --allow-pending-page-films
PREVIEW_URL=http://127.0.0.1:4226 npm run test:films -- --fixtures
PAGE_FILM_FIXTURES=1 PREVIEW_URL=http://127.0.0.1:4226 npm run test:browser
```

Fixtures intercept browser requests in memory using existing TED media; they
never create or modify public media. They do **not** prove final typography,
poster composition, video quality, actual duration, download cost or clearance.
Strict `npm run check` intentionally fails until real posters are installed.

Preview indexing and enquiry submission stay disabled. Git deployment stays
disabled. No push or deployment is part of this source handoff.

## Private architecture media

This GitHub repository is public. New Queen Anne film MP4s and posters are
intentionally ignored at `public/media/page-films/architecture/`. Restore them
from the private output pack before strict build/check/deploy. The complete pack
is deployed only to a protected Vercel preview, not the stable review alias.
The private film-source repository retains its asset provenance and source.

Contact is the deliberate ordering exception: its enquiry form and contact
details precede the optional film card, keeping the enquiry task primary.
