# HyperFrames documentation system quality audit

Date: 2026-08-01
Scope: every current navigation destination, its source structure, and the visual
role of each page. Prompt Guide is evaluated but remains frozen by owner decision.

## Verdict

The documentation is substantially better than remote `main`. The authored
Guides, Studio, Developers, journeys, and generated page templates have passed
the final local quality gate. It is not ready to call completely shipped until
the staged Catalog media is published and the owner approves the live preview.

The approved four-journey architecture is sound. The Mintlify chrome is sound.
Workflows, Studio, Developers, and Catalog now have recognizable jobs. A second
total navigation rewrite would create churn without solving the remaining
problems.

The remaining weaknesses are now operational rather than architectural:

1. Prompt Guide is a complete course inside Guides. It has strong material, but
   several pages are dense enough to need a separate future editorial review.
   It remains frozen by owner decision.
2. Seventeen Catalog preview or poster replacements are staged locally but
   cannot be published until the current shell has working AWS credentials.
3. Owner review is still required before commit or push.

Four problems found by this audit were fixed during the same pass: the two
developer entrances now have distinct jobs, workflow endings no longer require
Studio, a substantive creation-surface comparison now exists, and a verified
avatar/presenter task page distinguishes generated media from the HyperFrames
composition layer.

The focused proof pass and the final local gate are complete. All 273 routes
passed at 1280px desktop and 390px mobile: 546 rendered-page checks with zero
findings. The right next move is Catalog publication and owner review, not more
generic shortening or another navigation rewrite.

## What was measured

- 273 navigated destinations
- 275 MDX source pages
- 138 generated Catalog pages
- 135 non-Catalog destinations read as page outlines and classified
- 203 pages with a rendered visual or interactive element
- 70 pages without one
- zero navigation entries without a source file
- two MDX files outside navigation: the old Catalog index and changelog archive

The complete route-level measurements are in `current-page-inventory.json`.
They include title, description, headings, prose words, links, code blocks,
videos, images, imported snippets, media URLs, and review signals.

Word count is not a quality score. A 200-word task page can be complete. An
8,000-word reference can be legitimate. The question is whether the page
finishes its declared job without forcing another unnecessary hop.

## The page contract

Every page must answer four questions:

1. Who arrived here?
2. What are they trying to understand, decide, or finish?
3. What evidence or instruction is necessary for that result?
4. What can be removed without making the result weaker?

A page earns its route when the reader can name its distinct job and success
state. A router earns its route only when choosing is the reader's real task.

Valid routers in the current system:

- `/workflows`: choose by the material already available;
- `/help`: choose by the visible symptom;
- `/developers/cli`: choose a command family;
- `/deploy/overview`: choose who operates the render pipeline.

A page is not a valid router when it only repeats sidebar links as cards.

## Visual doctrine

Not every page needs a visual. Every visual needs a job.

| Page or claim                       | Best evidence                                 | What to avoid                                |
| ----------------------------------- | --------------------------------------------- | -------------------------------------------- |
| Product or journey orientation      | One short complete narrated film              | A decorative loop that explains nothing      |
| Finished creative quality           | A real film with sound and controls           | A screenshot of a different project          |
| One visible interaction             | A compact muted loop from current product UI  | A full narrated feature tour                 |
| A stable UI location or state       | One current annotated screenshot              | Mocked interface or tiny full-window capture |
| A transformation                    | Before/after comparison using the same source | Two unrelated examples                       |
| A system with several relationships | A small diagram that removes prose            | A diagram repeating one sentence             |
| A command, SDK method, or schema    | Copyable verified code and output             | Decorative product video                     |
| Troubleshooting                     | Exact error text, symptom, and recovery       | Generic illustration                         |
| Catalog item                        | Autoplay muted preview, poster, install paths | Narration or unrelated marketing copy        |

Full films use controls and never autoplay. Preview loops autoplay muted and
respect reduced motion. Screenshots and loops must come from the exact product
state the prose describes. Media width follows its role: a journey film may use
the full readable column; a one-control proof should be compact.

## Guides

### Start here

| Route           | Decision | Visual role                                          | Remaining work                                                                                    |
| --------------- | -------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/introduction` | Keep     | Complete narrated definition plus finished-film wall | Ship after final media and mobile gate                                                            |
| `/quickstart`   | Keep     | One complete first-video film                        | Ship; do not add more screenshots or steps                                                        |
| `/go-further`   | Keep     | Complete film plus four compact task previews        | Ship after checking each tile still matches its destination                                       |
| `/developers`   | Keep     | Complete developer-journey film                      | Manual authoring and first integration choices are now separate from the deeper architecture page |

The first three are intentionally concise after their films. Expanding them
with another generic workflow explanation would make them worse, not better.

### Create with an agent

| Route                          | Decision       | Visual role                                                    | Remaining work                                                                                                               |
| ------------------------------ | -------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `/guides/choose-creation-path` | Keep           | No decorative media; the decision itself is the task           | Distinguishes local project, hosted MCP, design-first handoff, and HeyGen-produced media without becoming a card-only router |
| `/guides/mcp`                  | Keep           | No decorative media; current host-specific steps are the proof | Continue verifying host plan and UI claims; tabs are justified because the hosts are mutually exclusive                      |
| `/guides/design-tools`         | Keep and prove | One real design-to-editable-project comparison                 | Add proof only when a truthful Figma or design-tool handoff can be shown from source to project                              |

### Prompt Guide

All 32 destinations remain frozen for this pass.

The course has useful verified examples and unusually strong motion vocabulary.
Its risk is density, not emptiness:

- `/prompting/motion` is about 5,000 prose words and 12 videos;
- `/prompting/capstone` is about 3,900 prose words with 49 links;
- `/prompting/examples` and `/prompting/vocabulary` each place 18 videos on one page;
- the first-level lessons still use accordions;
- `/prompting/specification-dial` is a very small lesson between larger chapters.

These are future course-design questions. They are not permission to casually
rewrite the recently added guide now.

### Workflows

`/workflows` is a justified visual router. The eight destinations are one hop
away, always visible, and based on source material the reader already has.

| Route                          | Decision | Visual role                              | Remaining work                                                               |
| ------------------------------ | -------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| `/workflows`                   | Keep     | Eight small muted result previews        | Ship                                                                         |
| `/guides/product-launch-video` | Keep     | One real narrated product film           | Complete; ends with task-specific review and equal continuation paths        |
| `/guides/faceless-explainer`   | Keep     | One representative result loop           | Complete; Storyboard and Studio are optional control surfaces                |
| `/guides/pr-to-video`          | Keep     | One real PR film                         | Complete; proof review remains and Studio export is optional                 |
| `/guides/captions-and-recuts`  | Keep     | Same-footage proof                       | Keep the three contracts explicit: captions, overlays, or an actual recut    |
| `/guides/motion-graphics`      | Keep     | One short motion-led result              | Ship                                                                         |
| `/guides/music-to-video`       | Keep     | One beat-led result with sound available | Complete; direct Studio timing is an option                                  |
| `/guides/slideshow`            | Keep     | One real navigable-deck proof            | Keep the current linear-MP4 limitation prominent                             |
| `/guides/general-video`        | Keep     | One complete mixed-source film           | Complete; preserves the custom-work boundary without mandatory Studio/export |

The workflow pages are short because they answer four narrow questions: what
to bring, what to ask, which decision changes the result, and what to verify.
They should not duplicate the Prompt Guide or Studio manual.

### Projects and media

This is the weakest general-audience block today.

| Route                       | Decision | Visual role                                                            | Remaining work                                                                      |
| --------------------------- | -------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `/concepts`                 | Keep     | One small project-model diagram already present                        | Verify that the diagram reduces prose rather than repeats it                        |
| `/concepts/variables`       | Keep     | Default/override result plus current Variables panel                   | Complete: two real override loops and the current Variables panel                   |
| `/guides/media`             | Keep     | One source-to-project-to-render lifecycle                              | Add only if the lifecycle can be shown more clearly than the existing four sections |
| `/guides/video-components`  | Keep     | Import, Fit/Position, and crop loop from current Studio                | Complete; the page now states that Inspector has no one-click source replacement    |
| `/guides/avatar-presenter`  | Keep     | Real generated presenter footage after HyperFrames captions/graphics   | Complete; generation, composition, and existing-footage paths remain distinct       |
| `/guides/voice-and-audio`   | Keep     | Same clip with a poor mix and an intelligible mix, plus caption result | Complete; controlled 10-second render uses stable captions and user-initiated audio |
| `/guides/remove-background` | Keep     | Before/after from the exact same frame                                 | Complete; the real soft hair and hand edges remain visible                          |
| `/guides/color-grading`     | Keep     | Before/after from the same source                                      | Complete; one restrained current-render correction                                  |
| `/guides/media-effects`     | Keep     | Compact grid from one source across named effects                      | Complete; original, Pixelate, Two-Ink Print, and ASCII are shown together           |

### Finish, Explore, and Help

| Route                      | Decision | Visual role                                | Remaining work                                              |
| -------------------------- | -------- | ------------------------------------------ | ----------------------------------------------------------- |
| `/guides/export-and-share` | Keep     | Compact real check/render loop             | Ship                                                        |
| `/examples`                | Keep     | Finished films and template loops          | Ship after media gate                                       |
| `/product-updates`         | Keep     | Media only when an update is itself visual | Add an owner and cadence; do not add decorative release art |
| `/help`                    | Keep     | None by default                            | Ship; symptom text is the useful interface                  |
| `/guides/troubleshooting`  | Keep     | Exact output only where it aids diagnosis  | Ship after final factual pass                               |
| `/guides/feedback`         | Keep     | None                                       | Ship                                                        |

## Studio

The consolidated 13-page structure is coherent. Each route now maps to one
human job. The pages are not too short merely because some take two minutes to
read; they are task guides, not chapters.

| Route                       | Decision | Visual role                                                 | Remaining work                                                             |
| --------------------------- | -------- | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| `/studio`                   | Keep     | Current River-narrated film, orientation still, three loops | Ship after final audio and current-build check                             |
| `/studio/storyboard`        | Keep     | Current annotated Storyboard state                          | Ship                                                                       |
| `/studio/canvas`            | Keep     | Selected element and Inspector state                        | Ship                                                                       |
| `/studio/timeline`          | Keep     | Real timeline state                                         | Ship                                                                       |
| `/studio/animation`         | Keep     | Current keyframe creation loop                              | Complete; the real project mutation and current Studio state were verified |
| `/studio/assets-and-blocks` | Keep     | Import media and add one Catalog item                       | Complete; both actions persisted real project changes                      |
| `/studio/captions`          | Keep     | Current Captions panel                                      | Preserve the documented persistence limitation                             |
| `/studio/variables`         | Keep     | Current Variables panel                                     | Ship                                                                       |
| `/studio/slideshows`        | Keep     | Current Slideshow panel                                     | Ship                                                                       |
| `/studio/source`            | Keep     | Current source/agent surface                                | Ship                                                                       |
| `/studio/export`            | Keep     | Current Renders panel                                       | Ship                                                                       |
| `/studio/shortcuts`         | Keep     | No visual needed                                            | Reference table is the correct format                                      |
| `/studio/troubleshooting`   | Keep     | No decorative visual                                        | Add a screenshot only for a stable error state that text cannot identify   |

The Studio front-door film has already been rebuilt correctly: current Studio
0.7.88 captures, the exact River voice, one real project, no fake UI, equal
Studio/agent/CLI finishes, narration, BGM, SFX, captions, and full verification.

## Developers

Technical pages should prefer examples and exact contracts over marketing
visuals. The current lack of videos here is mostly correct.

### Entry and command line

- `/developers` remains the fourth journey and now teaches manual authoring
  plus the first integration choice.
- `/developers/overview` remains the detailed application architecture.
- `/developers/cli` earns its route as a command chooser.
- `/packages/cli` is legitimate exhaustive reference, but at roughly 8,200
  prose words it needs generated maintenance and a usable command index. Do
  not split it into dozens of hand-maintained tiny pages.
- `/packages/lint` remains separate reference.

### SDK

The SDK structure is healthy: one quickstart, seven task guides, and six
reference pages. Code and expected results are the evidence. A diagram is
useful only on Canvas Integration, where click → scoped element → draft →
persisted edit is otherwise hard to hold in working memory.

The deleted `/sdk/overview` router should remain redirected to the quickstart.

### Composition and animation

The eight routes are distinct and belong together. No page needs a generic
film. Add diagrams only for nesting or the frame-adapter contract if reader
testing shows the prose and code are insufficient.

`/guides/hyperframes-vs-remotion` answers one technical comparison. The new
`/guides/choose-creation-path` page owns the broader choice between local
HyperFrames, hosted MCP, HeyGen avatar/video services, and design tools.

### Rendering and deployment

The route hierarchy is justified:

- `/deploy/overview` chooses the operator and layer;
- `/guides/rendering` handles a normal local render;
- `/deploy/cloud`, Lambda, Cloud Run, and hosted templates have different
  prerequisites and ownership;
- package pages are API reference.

These pages do not need decorative infrastructure diagrams. AWS Lambda may
earn one small architecture diagram because several services and storage
boundaries are involved; it must be sourced from the actual implementation.

### Packages, integrations, and contributing

The package pages are compact reference and may remain text-and-code only.
Antigravity and Copilot CLI are short but earn searchable, sendable routes
because their host-specific installation steps differ. Figma is long because
it covers authentication, assets, components, motion, provenance, and
troubleshooting; it needs a future real handoff example rather than more prose.

Contributing pages need no product media. Commands and repository state are the
evidence.

## Catalog

All 138 current item pages come from one generator and share the correct
reference shape:

1. exact item description and tags;
2. autoplay muted loop with poster;
3. two genuinely parallel install paths: ask the agent or use the terminal;
4. visible metadata and installed files;
5. a short usage contract.

The install tabs are justified here. They hide equivalent implementation
methods, not product choices the reader must compare.

The Catalog does not need 138 bespoke page designs. It needs a generator-level
content contract and a media gate for every item:

- preview and poster return 200;
- frame is not blank;
- motion starts quickly enough to understand the item;
- text is readable at the real docs width;
- loop seam is acceptable;
- no unexpected audio;
- dimensions, duration, files, command, and related skill match the registry.

The repeatable gate now exists and has been run against all 138 published
items. It currently passes 119. Fourteen published objects are missing, two
posters need stronger representative frames, and three flags are reviewed
false positives caused by intentionally static or subtle treatments. All real
replacements are staged and checksummed in
`CATALOG-MEDIA-STAGING-2026-08-01.md`; publication is waiting on AWS
credentials in this shell.

## What to learn from outside material

Strong independent tutorials get three things right: show a result immediately,
follow one project from request to file, and show a real correction instead of
pretending the first result is perfect.

`hyperframes.app` is better than many docs pages at putting an apparent action
above the fold. It is much worse at trust: it repeats the same claims, presents
an unofficial cloud interface, uses unsupported guarantees, and publishes
anonymous testimonials as proof. The useful lesson is directness, not its
copy or product claims.

The official documentation should own the honest loop:

```text
describe → build → review → revise → render
```

It should never inherit “instant,” “flawless,” “guaranteed,” or “one prompt
replaces every editor” language unless the repository and product can prove it.

## Implementation order

1. Differentiate `/developers` from `/developers/overview`. **Complete.**
2. Correct mandatory Studio/export wording across workflow guides. **Complete.**
3. Build the media proofs and two missing Studio loops from real current
   product behavior. **Complete.**
4. Add one honest product-surface comparison page and one verified avatar or
   generated-presenter guide. **Complete.**
5. Add a generated Catalog media QA script and inspect its failures.
   **Complete; 17 real replacements are staged pending AWS publication.**
6. Run complete desktop, 390 px mobile, facts, links, media, and accessibility
   gates before the owner-review checkpoint.

No commit or push should happen until those visible changes are reviewed.
