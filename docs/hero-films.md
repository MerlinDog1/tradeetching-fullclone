# Three service hero films

## Source recovery (5 November 2026)

The supplied `dev/verified-review` baseline `ba059bb` contained **only**
`AGENTS.md`, `HANDOVER.md` and `vercel.json`. Relative to `1a32325`, it had
removed 908 paths (911 changed paths including the three additions), including
all active site source. This was not a runnable website baseline.

Recovery commit `b0d705f` restores exactly the 436 active files under `README.md`,
`docs/`, `src/`, `public/`, `scripts/`, `package*.json` and `.gitignore` from
`1a32325`. Historical mirror captures were deliberately not restored. The
`git.deploymentEnabled: false` guard remains intact. No changes were made in the
read-only reference checkout, and no branch was pushed or site deployed.

## Integration contract

Only these routes load the new CSS/JS and render the film hero:

| Route | Asset folder |
| --- | --- |
| `/flat-cut-metal-letters-brass-stainless-steel` | `flat-cut` |
| `/large-format-chemical-etching-for-architecture` | `architecture` |
| `/metal-patination` | `patination` |

For each folder, supply six files in `public/media/hero-films/FOLDER/`:

```text
landscape-web.mp4
landscape-poster.webp
landscape-poster.jpg
portrait-web.mp4
portrait-poster.webp
portrait-poster.jpg
```

Landscape composition is 16:9, portrait 9:16. Use silent H.264 MP4 (yuv420p,
faststart) for browser compatibility. No duplicate WebM is requested. The
poster must be the intended first film frame/composition. The image and video
fill the same reserved aspect ratio; there are no baked-in headings.

`src/hero-films.mjs` owns the route allowlist, image description and truthful
captions. Flat-cut is explicitly a **material visualisation**; patination is
**genuine finish photography · light study**. The Queen Anne photography credit
**© Tobias Lange-Rüb / CRUCERO** is visible below the architecture hero and
retained in the body. Existing headings, introductory copy, enquiries, facts,
galleries and page metadata remain intact.

At widths <=767px the existing live heading and enquiry are above the 9:16
film. Desktop live copy sits over a controlled dark gradient. Text ends before
the 48% stop, whose opacity is at least 90%; even a white film frame yields a
background no lighter than approximately #222323. Warm white body copy and
brass eyebrow exceed WCAG AA contrast. The button has a solid background and
an explicit high-contrast keyboard focus ring.

The eager, high-priority `<picture>` works without JS. Only its chosen format
and orientation load. Video HTML has no `src`, `<source>` or duplicate poster.
The script waits for the picture decode and two animation frames, then attaches
only the matching MP4 when within 160px of the viewport. Playback requires
actual visibility, and pauses offscreen or when the tab is hidden. A deliberate
pause is retained across scrolling. Reduced motion makes **zero automatic film
requests**; explicit Play remains available. A live change to reduced motion
unloads the video. An orientation breakpoint change replaces, rather than adds,
the video source. Autoplay refusal or decode failure leaves the picture usable.

## Final media handoff and checks

The film owner supplies the actual assets. Do not substitute test doubles in
`public/`. After copying the real files:

```sh
cd /home/coding-agent/workspace/projects/ted-hero-films-site
npm ci --no-audit --no-fund
npm run build
npm run check
PORT=4216 npm run preview
```

In a second terminal (same directory):

```sh
PREVIEW_URL=http://127.0.0.1:4216 npm run test:hero
PREVIEW_URL=http://127.0.0.1:4216 npm run test:browser
```

Keep the preview loopback-only and stop it after checks. `CHROME_PATH` can
replace the default `/usr/bin/google-chrome`. No enquiries are sent.

The dedicated hero suite checks all three pages at **1440×900, 1920×1080,
390×844 and 360×800**. It writes viewport and full-page screenshots plus
`review/hero-films-final/report.json`. It verifies:

- Exactly the selected poster and video orientation is requested.
- Reserved aspect ratio, no horizontal overflow, CLS <0.01, mobile text above film.
- Muted playback, visible keyboard-tab control, Space/Enter, ARIA state, offscreen
  pause/resume and persistent manual pause.
- Twelve reduced-motion scenarios with no automatic MP4 request; explicit play.
- Live resize / reduced-motion change and usable no-JS poster/enquiry fallback.
- WCAG A/AA automated axe checks at all 12 sizes; no JS or HTTP errors.
- All ten unrelated pages render **byte-identical HTML** to the recovered
  `1a32325` templates; no shared CSS or JS changed.
- All 18 actual assets exist and their byte sizes are recorded.
- LCP candidate/time, CLS, resource timing, initial transferred/encoded page
  weight and selected source URLs. Local timings are diagnostic, not field
  Core Web Vitals or proof of mobile-network performance.

Inspect the delivered real-film screenshots, not only test results. The final
suite intentionally fails if media is absent. `npm run check` also fails when
posters are absent; this is a release check, not an error to suppress.

### Before media arrives

```sh
PREVIEW_URL=http://127.0.0.1:4216 npm run test:hero -- --fixtures
```

This explicitly intercepts hero media requests with the existing local lettering
clip/poster **only in the browser test**. It never copies fixtures into site
assets. Receipts are isolated under `review/hero-films-fixtures/`, labelled as
fixtures. They prove component behaviour, not final imagery, final asset sizes,
real orientation exports or real-media performance. Always rerun without
`--fixtures` after the final media copy.

## Release boundary

This branch is source-only handoff. No deploy or push was performed. The
existing noindex, disabled enquiry submission and Git deployment guard remain.
The owner/orchestrator controls review publication and real-media acceptance.

## Integration verification receipt

The recovered baseline passed `npm ci`, `npm run build` and `npm run check`
(13 routes, 667 links and 195 media references). The integration build and JS
syntax/diff checks pass. The fixture browser suite passed 12 requested
route/viewport combinations and 12 reduced-motion scenarios, with zero axe
violations or JS/HTTP errors, negligible CLS (maximum 0.000034), and poster images as every
initial LCP candidate. It also proves ten untouched page documents, keyboard
and offscreen behaviour, resize, no-JS and autoplay-refusal fallbacks. The
first-screen playback control is visible at all four requested sizes.

Desktop and mobile fixture screenshots were visually inspected, including the
long architecture heading at 360px. These are **layout evidence only**: final
films/posters have not been supplied to this checkout at handoff. The current
`npm run check` therefore stops at the first missing architecture poster, as
intended. Final real-media screenshots, actual media weight/performance and the
full site browser suite remain for the film owner's final asset copy. No final
media acceptance or publication is implied by fixture test success.
