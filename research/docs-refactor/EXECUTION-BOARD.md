# Documentation ship board

**Deadline:** 2026-08-03 10:00 PT

**Recovery checkpoint:** `0dc737074`

**Durable worktree:** `/Users/ularkimsanov/Desktop/hyperframes-docs-ship`

**Working branch:** `codex/docs-refactor-ship`

This board is operational. Update it whenever a meaningful result, failure,
decision, or risk changes.

## Current state

- [x] Entire pre-ship state committed locally.
- [x] Large docs MP4 files routed through Git LFS.
- [x] Durable worktree created outside temporary storage.
- [x] Existing four-journey architecture and Mintlify chrome preserved.
- [x] Current rendered crawl: 306 routes × desktop/mobile = 612 checks, zero
      findings.
- [x] Mintlify validation and broken-link checks pass on the final tree.
- [x] Final owner-facing editorial, factual, and visual pass is complete.
- [x] Changes are separated into four reviewable stacked PRs.
- [ ] Slack review request is sent.
- [x] Standup walkthrough is ready; PR links remain to be inserted.

## Work sequence

### 00:00–01:00 — lock scope and packaging

- [x] Create checkpoint and durable worktree.
- [x] Write north star and quality gates.
- [x] Compare checkpoint with current `origin/main` and record merge risks.
- [x] Define exact 2–4 PR boundaries before further edits.
- [ ] Inspect prior Slack PR-review messages and identify exact user IDs for
      Magi and Rames Jusso. Do not send yet.

Current-main comparison: 46 commits on main and 56 commits on the docs branch
since merge base `a3c8f897f`. Only five changed paths overlap:
`docs/community/adopters.mdx`, `docs/contributing/catalog.mdx`,
`docs/contributing/changelog-process.mdx`, `docs/docs.json`, and
`docs/guides/color-grading.mdx`.

Planned stacked PR order:

1. Foundation, Mintlify navigation/chrome, and the four journeys.
2. General Guides and Studio task documentation with current visual proof.
3. Developers learning paths, technical references, and factual corrections.
4. Generated Catalog presentation, shared media/player normalization, and
   reproducible QA tooling.

Generated crawl JSON and contact sheets remain in the recovery checkpoint but
will not be included in review unless they are needed to prove a specific
claim. Concise reports and reproducible scripts are the review artifacts.

### 01:00–04:00 — editorial and factual ship pass

- [x] Re-read every changed Guides, Studio, and Developers page in rendered
      reading order.
- [x] Remove filler, repeated route copy, misleading mandates, and shallow
      pages that do not complete their job.
- [x] Verify all changed commands and product claims against current source,
      CLI help, tests, skills, or live product behavior.
- [x] Preserve Prompt Guide copy and hierarchy.

### 04:00–06:30 — visual and media pass

- [x] Watch every complete in-scope journey/front-door film end to end.
- [x] Inspect short proof loops at their actual docs size.
- [x] Normalize full-film player use and portrait-media sizing.
- [x] Confirm captions, narration, music, SFX, posters, labels, and UI captures
      follow the approved media grammar.
- [x] Replace only proven gaps; do not create decorative media.

The corrected Developers journey film is committed as a versioned local LFS
asset because the AWS SSO session expired. It passed the media gates and can be
moved to the immutable CDN later with a one-line URL change.

### 06:30–08:00 — rendered QA

- [x] Mintlify desktop and 390px review of all 306 navigated routes.
- [x] Full route crawl, accessibility checks, overflow checks, and autoplay
      audio checks.
- [x] Mintlify validation, broken links, formatting, lint, and diff checks.
- [x] Record remaining risks honestly.

### 08:00–09:15 — PR construction

- [x] Rebase/sync each PR branch from current remote main.
- [x] Split the checkpoint into four coherent stacked PRs.
- [x] Give each PR one purpose, clear evidence, and its own test
      report.
- [x] Open each PR as draft after its individual local gates pass.

Review order:

1. [#2961 — journeys, Guides, and Studio](https://github.com/heygen-com/hyperframes/pull/2961)
2. [#2962 — developer and rendering reference](https://github.com/heygen-com/hyperframes/pull/2962)
3. [#2963 — Catalog presentation](https://github.com/heygen-com/hyperframes/pull/2963)
4. [#2964 — documentation quality system](https://github.com/heygen-com/hyperframes/pull/2964)

### 09:15–10:00 — review handoff

- [ ] Prepare the standup walkthrough and concise before/after summary.
- [ ] Post one Slack review message linking the ordered PRs, tagging Magi and
      Rames Jusso, matching the user's established tone.
- [ ] State what changed, how it was verified, review order, and any honest
      residual risk.

## Stop conditions

Stop and ask the owner only for a real product decision, expired credentials
that block required publication, or a material conflict with current product
truth. Do not stop for routine implementation choices.

Current non-blocking limitation: the Slack connector returns `is not
connected`. Prepare the final message and exact review order anyway; reconnect
only when the PRs are ready to send.
