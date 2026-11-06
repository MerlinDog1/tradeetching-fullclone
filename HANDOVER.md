# tradeetching-fullclone cross-machine handover — 26 September 2026

Repository: https://github.com/MerlinDog1/tradeetching-fullclone

Agreed source/development branch: dev/verified-review; source 1a32325721b30fe0af7d7607f58aeafe13cb4dec. GitHub default remains unchanged during this audit; use this explicit component branch.

URL: https://tradeetching-review.vercel.app

Platform: Vercel tradeetching-review / dpl_6LEUtrGL7i1V9jmpuLMS8xkVcuR8

Alias metadata identifies code 8e8884fc1b3f97592f20f0d0a1c51c00c8a1efe6; 1a32325 adds review notes. Separate from real tradeetching.com IONOS/Duda production, which remains unverified. Three formerly VPS-only commits scanned with no findings. Preserve the old fullclone website capture and Windows staged deletions. Windows audit worktree is sparse to avoid nonportable URL-named legacy captures; Linux full clone is required to inspect all archived assets. Read README and docs review records. Install dependencies independently and run documented static build/check locally. No enquiry/customer messaging during checks.

Source environment NAMES: none detected; inspect setup documentation for optional settings. Retrieve any required values independently from the existing project/service secret store or hosting account. Never commit/copy .env files.

Housekeeping checks: instructions and publishing workflows reviewed, documentation diff inspected and scanned for secrets. No application code or runtime configuration changed. Historical build/test claims in existing docs are not rerun claims. Outstanding test results and machine paths are in the central audit.

Deployment/rollback: requires a new explicit request. Use the existing project's documented release process, confirm current alias/revision first, then record the emitted deployment and verify alias assignment. For the named Vercel deployment, a future code rollback uses vercel rollback DEPLOYMENT_ID --scope dullaghan31-3959s-projects with the exact recorded ID above after reviewing storage/payment compatibility. Do not run deploy or rollback during housekeeping.

Git-triggered Vercel deployment is disabled on this source branch. Existing production configuration remains separate from GitHub defaults. Keep this guard on task/WIP descendants; check any new integration before pushing. Follow AGENTS.md.

## 5 November 2026 — local three-film integration

Task branch `codex/ted-hero-films`, isolated checkout `ted-hero-films-site`. The supplied `ba059bb` tree had deleted all active site files; `b0d705f` restores only active source from `1a32325`, retaining the no-auto-deploy guard. See [hero film handoff](docs/hero-films.md) for the exact scope, asset contract, verification commands and outstanding real-media acceptance. No push/deployment performed; main film owner owns final asset copy and publication.

## 6 November 2026 — thirteen standalone page films (local source handoff)

Branch `codex/ted-page-films-20261106`, isolated checkout
`ted-page-films-site-20261106`, base `3624172`. All 13 routes now have poster-first,
click-to-play film cards below static heroes. Yesterday’s hero films remain
intact but inactive. Queen Anne imagery is restricted to architecture with
credit and private-preview clearance note. No push/deployment performed.

See [page-film media contract and acceptance commands](docs/page-films.md).
Real renders are supplied separately by the parent task; browser fixture mode
is integration evidence only. Final commit/check details are recorded in the
local parent handoff `output/ted-page-films-20261106/site-integration.md` in the
shared workspace. Rebuild only while the local preview is stopped, or after
browser checks finish: this simple server reads directly from `dist`.
