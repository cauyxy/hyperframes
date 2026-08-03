# HyperFrames docs — owner review summary

Status: **implementation and local QA are complete for Guides, Studio,
Developers, and the shared Catalog template. Catalog media publication and
owner review remain before commit or push.**

The Prompt Guide is intentionally frozen. Catalog is governed as a separate,
generated reference surface and was not rewritten in this pass.

## What the new system is for

The docs now start from four real reader questions:

1. **What is HyperFrames?** — `/introduction`
2. **How do I make my first video?** — `/quickstart`
3. **How do I get more control?** — `/go-further`
4. **How do I build on HyperFrames?** — `/developers`

Every deeper page must either help finish a concrete task, explain a necessary
mental model, or provide an exact lookup. Pages that did none of those were
merged instead of being kept as extra clicks.

## Guides

- Reviewed all **29 non-Prompt Guide routes** against the current repository,
  CLI, skills, and product behavior.
- Kept all **32 Prompt Guide routes** unchanged by owner request. Only two links
  were updated so removed routes still land on the current canonical pages.
- Rebuilt the workflow entrance and all eight workflow pages around actual
  inputs and outputs. Removed fake tab-like choices and made every workflow page
  usable without another routing hop.
- Expanded `/concepts` into the human project model instead of keeping a thin
  pipeline page.
- Combined transcription with the complete voice/audio workflow.
- Combined review, checks, render, watch-back, naming, and sharing into one
  complete finish path at `/guides/export-and-share`.
- Kept specialized media tasks, troubleshooting, examples, and feedback as
  independent destinations because they have distinct success states.

Final Guides sequence: **Start here → Create with an agent → Prompt Guide →
Workflows → Projects and media → Finish → Explore → Help.**

## Studio

- Reviewed all **18 original Studio routes** and consolidated them into **13
  complete user jobs**.
- `/studio` now includes the useful orientation that was split into Tour.
- `/studio/canvas` now covers Canvas, Layers, and Design as one selected-element
  editing workflow.
- `/studio/animation` now owns the complete keyframe and motion workflow.
- `/studio/source` now covers source editing, autosave, checks, copied context,
  and agent handoff.
- Rewrote Variables, Captions, and Slideshows from current product source and
  verified UI behavior. Each page now has a real 1280×720 product screenshot,
  not a mockup.

Important product truth discovered during verification: Caption position,
scale, and rotation overrides persist to `caption-overrides.json`. Timing trims,
group splits, and Animation-tab edits are currently preview-only and do not
survive reload. The Captions page says this plainly instead of promising
persistence that the product does not provide.

## Developers

- Classified and rendered all **59 current developer destinations**.
- Made `/developers/overview` the actual Developers-tab entrance. The separate
  `/developers` journey remains in Guides → Start here.
- Replaced the route-only developer journey with a useful written mental model
  and smallest working examples for CLI, SDK, Player, schema, and rendering.
- Removed the duplicate SDK overview; `/sdk/quickstart` is now the one SDK front
  door.
- Kept the CLI reference as one searchable page with visible sections rather
  than forcing command-by-command navigation.
- Corrected SDK, Player, composition/runtime, render, deployment, and package
  claims against current exports, source, tests, and CLI help.

Notable corrections include the Player event contract and same-origin
requirement, valid custom-element usage, zero-or-more animation runtimes, the
human skills installation command, current CLI commands, and the slideshow
presenter command.

## Routes merged without breaking old links

| Previous route                   | Current destination        |
| -------------------------------- | -------------------------- |
| `/guides/pipeline`               | `/concepts`                |
| `/guides/quality-checklist`      | `/guides/export-and-share` |
| `/guides/publish-and-share`      | `/guides/export-and-share` |
| `/guides/transcribe-and-caption` | `/guides/voice-and-audio`  |
| `/studio/tour`                   | `/studio`                  |
| `/studio/layers`                 | `/studio/canvas`           |
| `/studio/design`                 | `/studio/canvas`           |
| `/guides/keyframes`              | `/studio/animation`        |
| `/studio/lint-and-agent`         | `/studio/source`           |
| `/sdk/overview`                  | `/sdk/quickstart`          |

All old routes have permanent redirects and were verified in the live local
site.

## Films and page media

- The four journey pages use purpose-built narrated films with music, sound,
  captions, and real HyperFrames material.
- Full films use controls and never autoplay. Small preview loops autoplay
  muted. There is no unexpected autoplay audio.
- Added real current-product proof for Studio keyframes, Assets/Catalog, media
  placement, audio mixing, background removal, color grading, and media
  effects. No product UI was mocked.
- The current inventory contains **203 destinations with visual or interactive
  evidence** and **70 where text, code, or exact output is the better format**.
- Removed production labels, counters, random caption placement, and unrelated
  screenshots from the journey films and pages.

## Verification completed

- Mintlify validation: pass.
- Broken-link check: pass.
- Desktop and 390px mobile render audit: **273 routes × 2 viewports = 546
  rendered-page checks, 0 findings**.
- No horizontal overflow, empty links, unexpected autoplay audio, or missing
  image alternative text; no broken images, video errors, or page exceptions.
- SDK tests: **507 passed**.
- Player assertions: **249 passed**; one isolated slideshow test suite has an
  existing alias-resolution issue unrelated to these docs.
- Developer TypeScript imports checked: **85 imports, 0 missing**.
- Six complete Developer HTML examples pass `hyperframes lint` with zero errors
  and warnings.
- Current CLI help was checked for the main, render, cloud, Lambda, Cloud Run,
  skills, Figma, add, and preview surfaces.
- Changed files pass formatting and `git diff --check`.

The generated Catalog media gate separately passes **119 of 138 items**. All
17 real replacements are staged and checksummed, but this shell has no AWS
credentials, so those files are not yet published and are not being represented
as complete.

## External learning audit

Official and independent tutorials, community discussions, GitHub issues, and
current creative-product documentation were reviewed after the implementation
pass. The evidence supports the four existing journeys and adds one editorial
rule: teach **describe → build → review → revise**, not one-shot perfection.

That audit produced four small pre-PR corrections:

- Introduction now says explicitly that the agent path does not require the
  reader to write code.
- Quickstart distinguishes the free local framework from optional paid agents
  and hosted or generated-media services.
- Quickstart identifies the first output as an editable version that still
  needs a factual and visual review.
- Two remaining Guide pages no longer claim Studio persists caption wording or
  timing changes that are currently preview-only.

The complete evidence and the ranked post-PR content opportunities are in
`EXTERNAL-LEARNING-AUDIT-2026-08-01.md`.

## What the owner should review

1. Read the four journey pages as four different users.
2. Use Guides to complete one workflow, then finish and share it.
3. Check the new Studio Variables, Captions, and Slideshows pages, especially
   the explicit caption-persistence limitation.
4. Open the Developers header tab and choose the smallest technical surface.
5. Confirm that the merged routes remove unnecessary clicks without hiding a
   distinct user job.

No commit or push should happen until this review is approved.
