# Real-media verification — 6 November 2026

All thirteen page films are rendered, with 1920×1080 and 1080×1920 exports and
WebP/JPEG posters. Each is silent, 12 seconds, 300 frames at 25 fps. Web MP4s
range from 1.01 to 2.79 MB (40.25 MB for all 26; only one loads after Play).

- `npm run build`: PASS, 13 routes, noindex and enquiries disabled.
- `npm run check`: PASS with the full real asset pack installed.
- `PREVIEW_URL=http://127.0.0.1:4226 npm run test:films`: PASS, 52 real-media
  page/viewport/motion cases; 26 MP4 probes; selected source/poster only;
  no pre-play video download; keyboard/native controls; offscreen/hidden pause;
  resize; live reduced motion; decoding/play rejection; no-JS fallback.
- `PREVIEW_URL=http://127.0.0.1:4226 npm run test:browser`: PASS, 26 desktop/phone
  page checks, 19 interaction/boundary checks; zero errors, failed requests or
  automated WCAG A/AA axe violations.
- Existing hero-film modules, CSS, JavaScript and media: byte-identical to
  `3624172` in Git. The legacy hero test's oversized screenshot was changed to
  bounded viewport tiles; its former-layout suite is not a current-layout test
  and was not rerun. Current film/browser suites above are the acceptance proof.
- Contact enquiry details/form precede its optional film. All other film cards
  follow their static hero. No InstaPlaque references in active site source.

## Private media and release boundary

This repository is public. The architecture film and its posters intentionally
remain ignored at `public/media/page-films/architecture/`. Restore these six
files from the private output pack before a strict check or deployment. All
other new page media are committed here. Source/provenance for all films are in
the private `MerlinDog1/trade-etching-remotion` task branch.

Queen Anne photographs: © Tobias Lange-Rüb / CRUCERO. Film-use clearance remains
required before public release. No live tradeetching.com change, production
deployment, stable review alias change or enquiry submission is included.

Evidence pack: `/home/coding-agent/workspace/output/ted-page-films-20261106/`.
`media-manifest.json` contains dimensions/durations and SHA256 hashes.
`acceptance-commands.json`, browser JSON reports and screenshots record the
actual checks. Final protected preview details are in the task REPORT.md and
HANDOVER.md after deployment verification.

## Protected deployment verified

https://tradeetching-review-6ara3j6pv-dullaghan31-3959s-projects.vercel.app

`dpl_9LNHvKh78vCGopubMf2sB6cHpW35` is READY in the existing review project,
non-production with no aliases. Anonymous pages and both architecture MP4s
redirect to sign-in. Authenticated representative HTML matches after removing
only the platform toolbar; both architecture MP4s match exact tested hashes.
The stable review page's baseline hash is unchanged. This is a deployed-content
smoke check; full interactive browser checks ran against the same local build.
