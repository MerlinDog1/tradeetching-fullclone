# Trade Etching Direct — website redesign

A complete, static, responsive redesign of **tradeetching.com**, prepared for review. It keeps TED’s original blue/black logo, real metalwork photography, service information and public page addresses. The revised composition uses the warm brass, near-black and warm-white palette from `MerlinDog1/trade-etching-remotion`, with trade supply leading and finished architectural signage showing the quality of the work.

**Isolated review:** https://tradeetching-review.vercel.app. This is not the live business website. The live website remains on IONOS/Duda; tradeetching.com, production settings, provider accounts, customer data and messages are untouched.

## Run the review build

Requires Node 24 and npm. No application secrets or cloud access are needed.

```sh
npm ci
npm run build
npm run check
npm run preview
```

Open **http://127.0.0.1:4210** on the VPS, or access it through an authenticated operator tunnel. The server deliberately binds only to loopback. Choose another port with `PORT=4211 npm run preview` if necessary.

The default build is **noindex** and **cannot submit enquiries**. It retains native required-name/email validation and shows an explicit “not sent” message. The original email and telephone links work normally.

## What is here

- `src/content.mjs` — curated, factual service content and page configurations.
- `src/source-content.json` — text, metadata and image inventory from the 13 live sitemap pages, captured 22 September 2026. Repeated responsive text blocks were deduplicated. Original source wording remains available for comparison.
- `src/templates.mjs` — shared header/footer, homepage, service, gallery and contact layouts.
- `src/gallery-content.mjs` — descriptive captions/categories for the existing 59 gallery images.
- `src/contact-provider.json` — public form field names and encoded routing values from the existing IONOS/Duda contact form, not account credentials.
- `public/` — progressive-enhancement JavaScript, responsive CSS, optimised local images and an 8-second silent lettering clip from the existing TED film assets.
- `scripts/build.mjs` — dependency-free static generator. Outputs to `dist/`.
- `scripts/serve.mjs` — loopback-only review server with a real 404 response and all POST requests rejected.
- `scripts/check.mjs` — route, SEO, link, image and form-contract checks.
- `scripts/browser-check.mjs` — real Chromium/Playwright + axe checks.
- `review/` — local screenshot/test artifacts, deliberately untracked.
- Historical mirror captures remain in Git history; they are not materialised in this active-source checkout. Serve **`dist/`**, not the repository root.

## URL preservation

All 13 current sitemap routes retain their exact names and case, including `/Contact` and `/new-page-2`. Each non-root page also has its original mirror’s `.html` variant. Older `/page-1`, `/page-2`, `/index` and `/metal-patinationb8754569` addresses are retained as aliases. No new public page addresses are required. Canonicals point to the existing `www.tradeetching.com` URLs.

See [route and content inventory](docs/route-content-inventory.md).

## Contact integration: important release boundary

The current website’s form depends on **IONOS/Duda**, not a backend in this repository. The redesign retains the original visible field names, hidden routing fields and `/_dm/s/rt/widgets/dmform.submit.jsp` action. No live submission was made to “test” it.

The review build intentionally does not send anything. The form’s native provider submission is only enabled by an explicit `node scripts/build.mjs --production` build **on the existing tradeetching.com host**. The original provider’s runtime context, anti-spam requirements and successful delivery still need to be verified during an owner-authorised integration on that host. The retained HTML contract alone is **not evidence of delivery**. If hosting changes, a replacement backend must be implemented and verified before release; do not redirect production form posts blindly or claim the form is connected.

A release must also use the original host’s route/canonical handling and retain the existing domain. `--production` merely changes generated files; it does not deploy, integrate the provider, or authorise release. The local preview server continues to block POSTs and indexing even with those files.

## Verification

```sh
npm run build
npm run check
npm run test:browser
```

The browser check expects the preview at port 4210 and `/usr/bin/google-chrome`. Set `PREVIEW_URL` and `CHROME_PATH` if needed. On the shared VPS, use `flock /tmp/cody-glowup-heavy.lock npm run test:browser` to avoid overlapping other website review jobs.

Checks cover all 13 pages at 1440px and 390px, extra 320/360/650/768/1024/1920px boundaries, local image loads, no horizontal overflow, canonical URLs, WCAG A/AA axe rules, menus, FAQs, video playback/reduced motion, gallery filtering/lightbox/focus, form validation with zero POSTs, and 404 handling. Axe is an automated check, not a claim of a full accessibility certification.

`node scripts/capture.mjs` records desktop/mobile full-page and first-screen review screenshots. It loads lazy images before capture so the screenshots show the actual complete layout.

## Assets and credits

Images belong to the existing Trade Etching Direct site and brand-film project. The flat-cut hero film is labelled as a material visualisation; the patination film uses genuine finish photography with a light study. No invented customers, fabricated reviews or new business claims were added. Queen Anne photographs retain **© Tobias Lange-Rüb / CRUCERO** credit. The silent lettering clip is sourced from the TED film repository; no review soundtrack is included.

No scheduler, background model loop, paid API, analytics tracker, web font service or application database was added.

## Service hero films

Three service routes have responsive poster-first hero films. See [source recovery, media contract and final verification](docs/hero-films.md). Actual film assets are supplied separately; the final checks must pass with those files before publication. The other ten page heroes are unchanged.
