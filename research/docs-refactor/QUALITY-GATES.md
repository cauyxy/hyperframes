# Documentation quality gates

The refactor is complete only when every applicable gate passes.

## Page purpose

- [ ] The page answers one real question or completes one real task.
- [ ] A reader gets useful information before being routed elsewhere.
- [ ] The first screen makes the page's value clear.
- [ ] Every section and visual has a specific job.
- [ ] No filler, repeated conclusion, obvious instruction, or unnecessary
      “start here” label remains.
- [ ] Short pages are complete; long pages are scanable and properly
      chaptered.

## Product truth

- [ ] Commands match current CLI help and README behavior.
- [ ] UI labels and persistence behavior match current Studio.
- [ ] SDK, Player, package, schema, and deployment claims match current source
      and public types.
- [ ] Workflow guidance matches the shipped skill.
- [ ] Limitations and optional paths are stated honestly.
- [ ] No screenshot, capture, or terminal output is mocked.

## Journey UX

- [ ] A new visitor can explain HyperFrames after `/introduction`.
- [ ] A beginner can make a valid request after `/quickstart` without writing a
      production specification.
- [ ] An experienced user can immediately choose agent, Studio, CLI, or source
      for the change they need.
- [ ] A developer can choose the smallest useful integration surface.
- [ ] No success path requires more than two navigation hops.

## Media

- [ ] Complete films have narration, intentional music, purposeful SFX, stable
      phrase captions, controls, and no autoplay/loop.
- [ ] Proof loops are short, legible at their rendered size, muted, and do not
      pretend to be full instruction.
- [ ] No random labels, counters, debug text, filenames, or redundant branding.
- [ ] Posters match the exact project shown.
- [ ] H.264 1080p video and AAC stereo audio where applicable.
- [ ] Mean volume is above −26 dB with safe peaks.
- [ ] No blank frames, missing media, flash frames, illegible text, or stale UI.
- [ ] Full films are watched end to end; contact sheets are reviewed at the
      real approximately 700px docs width.

## Design and accessibility

- [ ] Approved Mintlify chrome and navigation behavior are unchanged.
- [ ] Desktop and 390px layouts have no horizontal overflow.
- [ ] Portrait media does not dominate the viewport.
- [ ] Interactive choices are keyboard accessible with visible focus.
- [ ] Reduced motion is respected.
- [ ] Images have meaningful alt text; video has a useful title/caption.
- [ ] No unexpected autoplay audio.
- [ ] Light and dark themes both have adequate contrast.

## Technical verification

- [ ] `mint validate`
- [ ] `CI=1 mint broken-links`
- [ ] Changed source passes oxlint and oxfmt.
- [ ] `git diff --check`
- [ ] Full rendered route crawl passes desktop and mobile.
- [ ] LFS contains large docs video assets.
- [ ] No credentials or generated secrets are staged.
- [ ] Every redirect and navigation target resolves.

## Delivery

- [ ] Each PR has one coherent purpose and a bounded diff.
- [ ] Each PR includes test evidence and visual evidence where relevant.
- [ ] PR review order and dependencies are explicit.
- [ ] Slack review request is sent only after all PRs are ready.
- [ ] Standup summary shows user-visible outcomes, not file-count activity.
