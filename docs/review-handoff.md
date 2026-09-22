# Trade Etching Direct — gold revision handoff

22 September 2026. Review only; **tradeetching.com is unchanged**.

## Review

- Review URL: https://tradeetching-review.vercel.app
- Repository: `MerlinDog1/tradeetching-fullclone`
- Working directory: `/home/coding-agent/workspace/projects/tradeetching-glowup`
- Branch: `codex/tradeetching-gold-revision`
- Previous design: `e7ea70d`, superseded by this revision after owner feedback.
- Local review: `http://127.0.0.1:4210`, loopback only.

## Design response

The owner wanted the film’s gold accent, stronger trade-supplier positioning, and the high-end signage brought into the offer.

The homepage is now led by **“Metal signage. Made for the trade.”** alongside a real, large-scale photograph of TED’s laser-cut brass letter with etched detail and patina. The original blue/black logo is retained. UI colour follows the original film: brass `#c7a05a`, near-black `#090a0a` and warm white `#f3f0e8`; blue survives in the brand mark and a small manufacturing detail.

Finished etched signs, architectural letters and patina details appear immediately after the hero. “Your own etching department” explains the supplier relationship without positioning TED against its customers. Manufacturing capacity, practical service links, the Queen Anne installation, a silent lettering clip, fulfilment, existing awards/press content and FAQs follow. The Queen Anne photographs retain the original credit.

All 13 pages share the refined palette, CTA system, calmer surfaces and material-focused presentation. Service-page gallery captions now describe the actual pieces, replacing imported SEO fragments and missing labels. Original source text remains unchanged in `src/source-content.json`.

No generated product images, new customer claims, invented reviews, replacement brand, web font service, tracking, model calls or application backend were added.

## Preserved

- All 13 current sitemap routes, exact case-sensitive `/Contact`, `/new-page-2`, `.html` variants and older aliases.
- Original SEO titles, descriptions and canonical addresses.
- All **59 gallery photographs**, category filters, show more, keyboard/touch lightbox and focus restoration.
- All service-page galleries and core service/technical content.
- Navigation, native FAQ interaction, email/phone links, form validation and reduced-motion-safe manual video playback.
- Original IONOS/Duda form field/action contract, with preview sending disabled.
- Original static mirror directories, unchanged.

## Checks

`npm run build`, `npm run check` and actual Chromium browser checks. The static check covers 13 routes, canonicals, metadata, one H1, legacy aliases, **667 local links and 195 media references**.

Final local run passed: **26 page/viewport checks, 19 interaction/boundary groups, zero JavaScript errors, zero failed requests and zero axe violations.**

Browser coverage: every page at 1440 × 1000 and 390 × 844, plus 320/360/650/768/1024/1920px boundaries. Menus, service navigation, FAQ pointer/keyboard, gallery filtering/show-more/image loading/lightbox arrows/Escape/focus, video reduced-motion/play/pause, native name/email validation and explicit review-only response. **Zero enquiry POSTs.** A real 404 is retained. Automated axe WCAG A/AA checks are not a full accessibility certification.

Screenshots in ignored `review/screenshots/` show full-page and first-screen desktop/mobile layouts. `review/browser-report.json` contains the browser results. The initial design critique was a separate, read-only review of copied screenshots; it confirmed the direction and prompted the service-caption cleanup.

## Deployment boundary and target

The owner authorised updates to **only the isolated Vercel review project**:

- Project: `tradeetching-review`
- Project ID: `prj_3wo9LAlJeyhhq5Q6w6rtUDJv0Ihi`
- Team: `dullaghan31-3959s-projects`
- Team ID: `team_ixtKhYUPfpSnMuyaBrzYUQQe`

Deploy the generated **preview-mode `dist/`**, not the repository root or original mirror. The Vercel production alias is this review URL only; it is not the live business site. Building removes `dist/.vercel`, so recreate the link only with the fixed review identifiers above before deploying. No Git push or automatic Git integration is required.

Review output remains `noindex` with enquiries disabled. The live business site remains on IONOS/Duda. Before any separately authorised live release, verify that provider’s runtime/anti-spam/delivery integration or implement a replacement backend if changing hosts. The retained HTML contract alone is not proof of message delivery.

Rollback the isolated review to the previous deployment `dpl_6ZyQoeB54CWCa3QSnEbrfQq3PLPp`, or build commit `e7ea70d` in a separate checkout and redeploy its preview `dist/` to the same fixed review project. Never change the live domain, production provider, database or email settings for this review.
