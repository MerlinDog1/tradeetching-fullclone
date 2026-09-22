# Review handoff — 22 September 2026

## Outcome

Complete 13-page responsive redesign, prepared locally. No push, deployment, DNS change, production settings change, email or customer data write.

- Repository: `MerlinDog1/tradeetching-fullclone`
- Starting commit: `6c92a44` (original mirror, unchanged)
- Working branch: `codex/tradeetching-glowup`
- Working directory: `/home/coding-agent/workspace/projects/tradeetching-glowup`
- Inspiration: `MerlinDog1/trade-etching-remotion`, read-only checkout at `projects/trade-etching-remotion`
- Review server: `http://127.0.0.1:4210`, loopback only. Start again with `npm run preview` after building if stopped.

## Visual direction

Existing TED logo, blue, black and white. Bold typography and a material-photo grid follow the existing film’s visual vocabulary. No generated product pictures or generic replacement brand. The real metalwork carries the design.

Homepage now has an immediately readable trade offer, compact navigation, service cards, the Queen Anne project, manufacturing specifications, process, existing award/press content and FAQ. Interior pages have clear technical information, large photography and related services. Mobile layouts are independently composed rather than shrunk desktop layouts.

The gallery retains every existing image, with accurate captions, category filters, incremental reveal and a keyboard/touch lightbox. Motion is silent, pausable and respects reduced-motion/data-saving preferences.

## Checks

- Static build and route/content checks passed: all 13 live sitemap addresses, case-sensitive `/Contact`, original SEO titles/descriptions/canonicals, legacy `.html` addresses, historical aliases, 667 internal local links and 199 image/video references.
- Actual Chromium: all 13 pages at 1440 × 1000 and 390 × 844.
- Additional width boundaries: 320, 360, 650, 768, 1024 and 1920px.
- No horizontal overflow, broken local images or JavaScript exceptions.
- No axe WCAG 2/2.1 A/AA violations in the checked desktop/mobile pages.
- Desktop/mobile navigation, FAQ pointer/keyboard controls, gallery filtering/show-more/zoom/arrow/Escape/focus restoration, reduced-motion behaviour and manual video playback checked.
- Name/email validation and clear preview-only response checked. **Zero enquiry POSTs sent.**
- A real 404 page is served for unknown paths. Preview pages and server responses are noindex.
- Final screenshots were captured after all lazy images loaded, and visually inspected.

Axe checks are automated coverage, not an accessibility certification. Final live provider delivery has not been tested because this task did not authorise a release or real messages.

## Local review artifacts

- `review/desktop-mobile-review.jpg` — desktop/mobile first-screen presentation.
- `review/screenshots/home-desktop-first-screen.png`
- `review/screenshots/home-mobile-first-screen.png`
- `review/screenshots/home-desktop.png`
- `review/screenshots/home-mobile.png`
- `review/screenshots/architecture-desktop.png`
- `review/screenshots/architecture-mobile.png`
- `review/screenshots/contact-desktop.png`
- `review/screenshots/contact-mobile.png`
- `review/screenshots/gallery-desktop.png`
- `review/screenshots/gallery-mobile.png`
- `review/browser-report.json` — full automated browser results.
- `review/source/` — ignored read-only live-site capture used for content comparison.

## Release boundary

The live site uses IONOS/Duda. This repository originally contained a static mirror, not a deployed application/backend. The new output is `dist/`, not the unchanged raw mirror at the repository root.

The original contact provider’s HTML field/action contract is retained, but preview mode deliberately disables sending. An authorised implementation on the live host must retain/verify the Duda form runtime and its anti-spam context, or implement a replacement backend if hosting changes. No working standalone mail backend or live delivery is claimed. See README.

No production release should be inferred from this local handoff. Existing production remains untouched.
