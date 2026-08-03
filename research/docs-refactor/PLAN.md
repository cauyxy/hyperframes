# HyperFrames documentation refactor

## Current approval gate

Approved by the product owner on 2026-07-29. The four journey pages exist, but
the complete documentation is still in an accuracy, consolidation,
visual-proof, and verification pass. Do not describe the refactor as finished
until every gate at the end of this plan passes.

The product owner refined the information model on 2026-07-30. Four maturity
journeys are now the canonical front doors:

1. **Understand HyperFrames** — `/introduction`
2. **Create a first video** — `/quickstart`
3. **Go further** — `/go-further`
4. **Build on HyperFrames** — `/developers`

Workflows, Studio, Catalog, export, and troubleshooting are destinations inside
these journeys rather than competing front doors.

The product owner reopened the editorial and visual gate on 2026-07-31. Passing
validation and having every route in navigation are not sufficient. The site is
not finished until every Guides, Studio, and Developers page has been judged as
a rendered page, short pages either complete a real task or are consolidated,
and every video uses a size and playback treatment appropriate to its job.

The product owner then reopened the architectural gate on 2026-07-31. Do not
continue treating the existing page inventory as the required final shape. The
documentation must first be designed as a complete editorial system derived
from the real product loop, user jobs, distinct content types, and a deliberate
media grammar. The proposal is recorded in
`DOCS-SYSTEM-BLUEPRINT-2026-07-31.md` and was approved by the product owner on
2026-07-31. It is now the source of truth for the route ledger and broad
implementation.

The approved journeys become the source of truth for:

- canonical starting links;
- page priority and order;
- required videos and diagrams;
- navigation;
- consolidation and removal decisions;
- analytics and usability tests.

The route-to-journey contract is maintained in `JOURNEY-IMPLEMENTATION-MAP.md`.

The external learning and community audit in
`EXTERNAL-LEARNING-AUDIT-2026-08-01.md` validates the four-journey architecture.
It adds one durable editorial rule: the general-audience story is **describe →
build → review → revise**, not “one prompt guarantees a finished professional
video.” Future comparison and avatar guidance should follow the ranked gaps in
that audit without reopening the approved navigation.

Status: local implementation and whole-site QA complete; Catalog publication and owner approval remain
Started: 2026-07-28
Primary audience: people who want to make, edit, and share videos with HyperFrames
Secondary audience: developers integrating or extending HyperFrames

Approved media-player model: complete films use the lightweight `DocsVideo`
player over native `<video>`, including smooth progress and a real frame
preview while scrubbing. A deliberate click starts playback with sound; the
large center action is icon-only. Small proof, chooser, template, Catalog, and
Prompt Guide loops remain ordinary autoplaying muted videos because they are
moving illustrations rather than watchable films.

This is the durable plan for the documentation refactor. Read it before doing docs work, including after a chat compaction or in a future session.

## Goal

Turn the docs from a repository-shaped collection of pages into a useful product guide.

A visitor should quickly understand:

- what HyperFrames does;
- whether they should use an agent, Studio, or both;
- how to complete a real video task;
- where to find a feature they saw in the product;
- what to send someone who asks “how do I do this?”;
- where technical reference lives when they actually need it.

The docs should feel clear, capable, visual, and human. They should not read like an API dump, marketing filler, or instructions written only for framework contributors.

## Current journey rebuild

The four canonical journey pages are being rebuilt as complete front doors:

1. `/introduction` — understand HyperFrames;
2. `/quickstart` — create a first video;
3. `/go-further` — gain more control;
4. `/developers` — build on HyperFrames.

Each page begins with one complete narrated film and continues with a concise
written expansion. The shared film series uses River narration, burned phrase
captions, an intentional music arc, purposeful SFX, real product behavior, and
real HyperFrames source. Long films use controls and do not autoplay or loop.

The approved Mintlify header, left sidebar, right table of contents, theme, and
page-width behavior remain unchanged.

## Current execution order — 2026-07-31

Current checkpoint: the system blueprint and route ledgers are approved. A
second whole-site quality audit on 2026-08-01 confirmed that the architecture
should stay and identified seven concrete finishing gaps. All seven current-UI
and visual proofs are now complete, including Studio Animation and Assets plus
the five media guides. The remaining work is publishing the staged Catalog
media fixes and running the final whole-site gate. The route-level evidence and decisions live in
`FULL-SYSTEM-QUALITY-AUDIT-2026-08-01.md` and
`current-page-inventory.json`.

1. Approve the documentation system: product model, content types, target
   navigation, consolidation rules, and media grammar.
2. Assign a keep, expand, merge, split, redirect, or remove decision to every
   one of the 142 current non-Catalog routes; audit the generated Catalog as a
   separate page class.
3. Rebuild the high-traffic front doors and remove router chains that delay the
   first useful answer.
4. Consolidate Studio and the normal check/render/share path around complete
   human tasks while preserving old routes with redirects.
5. Preserve the recently added Prompt Guide unchanged in this pass.
6. Separate developer learning paths from exhaustive CLI, SDK, package, schema,
   and deployment reference.
7. Watch and classify every in-scope unique video end to end, then keep, resize, replace,
   or remove it according to its role.
8. Verify all facts against source, tests, CLI help, skills, and real behavior;
   run editorial, desktop/mobile, accessibility, media, Mintlify, and link QA.

Completed before the reopened architecture gate:

- an earlier action audit for 115 Guides, Studio, and Developers routes; this
  was not the full current navigation because the later Prompt Guide merge and
  route changes brought the non-Catalog total to 142;
- a rendered-page crawl that successfully opened all 142 current non-Catalog
  routes, identified content-length and media outliers, and confirmed that the
  full editorial and end-to-end video audit is still incomplete;
- corrected authentication, variable-binding, and Studio autosave
  contradictions;
- rebuilt Guides and Developers navigation around human tasks and the smallest
  technical surface;
- added a neutral rendering/deployment chooser;
- rewrote the main Media, SDK, Go further, Skills, Design import, Variables,
  and support routes so they perform a task rather than act as directories;
- removed a nonexistent Media Overlays product surface and redirected its old
  route;
- merged duplicate Project Tour and Common Questions routes into their actual
  destinations;
- reduced three oversized media guides from implementation memos to task
  guides.
- corrected the Player page against the current package, including supported
  attributes, controls, and event cadence;
- corrected Studio auto-keyframe and save semantics against current source:
  auto-keyframing starts enabled, Preview edits autosave, and Storyboard drafts
  keep explicit Save actions;
- verified the current `hyperframes media-treatment` command and aligned the
  grading/effects guides with its capability-discovery, local-analysis, apply,
  preview, clear, and `data-color-grading` behavior;
- corrected the CLI skills lifecycle against the current implementation:
  complete bare install, freshness check, and targeted update.
- verified and rebuilt the deployment chooser, hosted templates, AWS Lambda,
  and Google Cloud Run guides against current source, CLI help, and live
  template repositories;
- reduced the advanced 4K, HDR, and performance pages to task-focused
  references and removed volatile benchmark claims;
- rewrote the contributor and Catalog-contribution entry pages against current
  scripts and schemas;
- retired the duplicate Weekly Updates route in favor of Product Updates and
  the release archive;
- removed broken cross-origin TT Norms loading from the Mintlify shell while
  keeping the approved Inter UI and the changelog fonts inside authored films.

Still required:

- publish the checksummed Catalog replacements when AWS credentials are
  available, then rerun the generated media gate;
- publish the staged Catalog media and rerun its CDN gate;
- owner review of the live preview and owner approval before commit or push.

Completed in the 2026-08-01 full-system finishing pass:

- separated the `/developers` journey from `/developers/overview`: the journey
  now teaches manual authoring and the first integration choice, while the
  header destination owns the complete architecture;
- corrected workflow endings so agent, Studio, and CLI are equally valid
  continuations and Studio's Renders panel is not presented as mandatory;
- added a substantive creation-surface comparison instead of another card-only
  router;
- added a verified avatar/presenter task guide that distinguishes HeyGen media
  generation from HyperFrames composition, uses real generated footage, and
  keeps the project path honest.
- added current, source-backed proof for Studio Animation and Assets plus
  images/video, voice/audio, background removal, color grading, and media
  effects;
- corrected the media guide’s false one-click source-replacement claim and the
  transcription guide’s outdated model and translation claims against CLI
  0.7.88.

The exact change, removal, redirect, and verification summary is recorded in
`OWNER-REVIEW-SUMMARY-2026-08-01.md`.

## Navigation decision

Use four top-level header tabs:

1. **Guides** — start here, create with an agent, workflows, core ideas, media, export, troubleshooting, and product updates.
2. **Studio** — the complete visual editor manual.
3. **Catalog** — browsable blocks and components.
4. **Developers** — CLI, SDK, packages, schemas, deployment, integrations, and contributing.

Global header:

- Use Mintlify’s **Aspen** theme. A desktop and mobile preview confirmed that it provides the desired full-width header without custom CSS.
- HyperFrames logo on the left.
- Search remains prominent.
- GitHub link on the right.
- Light/dark theme toggle remains available.
- Primary **Playground** action to the official `hyperframes.dev` browser experience. Studio itself remains project-local through `npx hyperframes preview`.
- Keep Aspen’s full-width top navigation. Use the small desktop-only layout override needed to fit the logo, tabs, search, actions, and theme toggle on one row.
- Keep every left-sidebar group open and non-collapsible. Match the deployed main docs' spacing, group-heading scale, square link treatment, and segmented active-page rail.
- Keep Mintlify’s default right-side **On this page** behavior and styling.
- Align Aspen's sticky sidebar to the actual 56px header, remove its premature scroll fade, keep the GitHub star count, and use main's quieter structural border color.
- Keep the floating agent input easy to notice without making it visually dominant.

Navigation behavior:

- Every tab uses ordinary top-level groups, matching `origin/main`.
- Group labels are static section headings; only actual pages navigate.
- Do not add `root`, `directory`, `expanded`, or drilldown behavior.
- Keep Mintlify's default sidebar and **On this page** rendering unchanged.
- Human-facing labels describe tasks, not repository packages.
- Updates is not a top-level tab.

## Target information architecture

### Guides

- Start here
  - What HyperFrames is
  - Make your first video
  - Go further
  - Build on HyperFrames
- Create with an agent
  - Choose a workflow
  - Give the agent a useful brief
  - Review and improve a result
  - Product and website videos
  - Explainers
  - PR and changelog videos
  - Captions and talking-head recuts
  - Motion graphics
  - Music-driven videos
  - Slideshows
- Learn
  - Composition basics
  - Timing and tracks
  - Animation basics
  - Reusable variables
  - Nested compositions
  - Deterministic rendering
- Media
  - Images and video
  - Voice and audio
  - Captions and transcription
  - Background removal
  - Color grading
- Export and share
  - Choose a format
  - Export from Studio
  - Render from the CLI
  - 4K and HDR
  - Publish and share
- Help
  - Troubleshooting
  - Common questions
  - Give feedback
- What’s new
  - Product updates
  - Detailed release archive

### Studio

- Studio overview and tour
- Storyboard
- Canvas editing
- Layers and groups
- Timeline editing
- Animation and keyframes
- Assets and reusable blocks
- Text, layout, style, media, 3D, and color controls
- Captions
- Variables and templates
- Slideshows
- Source editor
- Lint and fixing issues
- Export queue
- Keyboard shortcuts
- Troubleshooting

### Catalog

- Visual catalog home
- Blocks
- Components
- Categories and search
- Add an item
- Customize an item
- Build and contribute an item

Individual item pages stay concise and visual. Their shared generator owns the agent prompt, install path, and progressive disclosure of technical details.

### Developers

- Developer overview
- CLI
- SDK
- Player
- Packages
- HTML schema
- Advanced rendering
- Deployment
- MCP and integrations
- Contributing
- Release process

## Content decisions

- Rewrite Introduction and Quickstart around outcomes and user paths.
- Create real Studio documentation from current product behavior.
- Move user-facing Studio material out of Contributing.
- Merge Packages, SDK, and Reference into Developers.
- Remove Weekly updates until it has real content and an owner.
- Keep one human-readable product updates page and one detailed release archive.
- Merge Showcase and Launch Videos into one examples area.
- Merge overlapping Claude Design and Open Design guidance.
- Replace the stale Website to Video workflow with the current Product Launch workflow.
- Merge Common Mistakes into a useful troubleshooting hub.
- Replace the giant CLI wall with task guides plus a searchable command reference.
- Add the MCP guide to navigation.
- Correct installation guidance:
  - Agent/non-interactive default: `npx hyperframes skills update`
  - Interactive picker: `npx skills add heygen-com/hyperframes --full-depth`

## Writing principles

- Lead with the result, not setup.
- Use “you” and name visible controls exactly as they appear.
- One page, one main job.
- Prefer short sentences and meaningful headings.
- Show a successful path before edge cases.
- Explain technical vocabulary the first time it appears.
- Do not make humans learn internal architecture unless it helps them act.
- Do not hide important caveats.
- No filler introductions, fake enthusiasm, or repetitive summaries.
- Use screenshots, short clips, diagrams, and examples when they reduce uncertainty.
- Technical detail belongs in a Developer section or a clearly labeled advanced section.

## Evidence standard

Every feature claim must come from at least one current source:

- shipped product code;
- tests;
- CLI help/output;
- schemas and public types;
- current agent skills;
- a confirmed live product flow.

Old docs and changelogs are leads, not proof.

## Execution phases

### Phase 1 — Foundation

- [x] Audit public pages and product capabilities.
- [x] Produce a visual coverage report.
- [x] Approve the product model, page contracts, consolidation rules, and media grammar.
- [x] Classify all 142 non-Catalog routes and the 138-page generated Catalog class.
- [x] Agree on four top-level tabs.
- [x] Create persistent plan, notes, and docs rules.
- [x] Implement the header/navigation shell.
- [x] Add overview pages required by the new hierarchy.

### Phase 2 — Critical truth fixes

- [x] Remove the “no timeline editor” claim.
- [x] Correct timeline splitting guidance.
- [x] Correct skills installation commands in the main user paths.
- [x] Add MCP to navigation.
- [x] Remove or redirect the empty Weekly Updates page and stale Website to Video and Timeline Editing pages.

### Phase 3 — Human starting experience

- [x] Rewrite Introduction.
- [x] Rewrite Quickstart.
- [x] Add Choose your path.
- [x] Add workflow chooser.
- [x] Rebuild examples around real outcomes.

### Phase 4 — Studio

- [x] Create the first complete Studio section.
- [x] Verify each control and workflow in current code.
- [x] Add the first real Studio workspace visual.
- [x] Add focused visuals for difficult interactions.
- [x] Move or redirect the buried manual-editing page.
- [x] Replace the Studio front-door film with a current narrated product walkthrough.
- [x] Recapture the Studio stills and four task loops from the same real project.
- [x] Publish the final Studio media under immutable versioned CDN URLs.
- [x] Merge Tour into the Studio overview.
- [x] Merge Canvas, Layers, and Design into one complete visible-edit workflow.
- [x] Merge user-facing Keyframes into the Animation workflow.
- [x] Merge Lint and agent handoff into the Source workflow.
- [x] Receive owner approval for the consolidated Studio pages.

### Phase 5 — Consolidation

- [x] Re-evaluate every consolidation against the approved system blueprint.
- [x] Consolidate the human project loop into `/concepts` and the normal
      review/check/render/share task into `/guides/export-and-share`.
- [x] Consolidate the highest-impact overlapping guides without creating empty
      router pages or destroying useful direct support routes.
- [x] Reorganize developer material under one top-level section.
- [x] Add a task-based CLI guide in front of the complete command reference.
- [x] Separate product updates from raw release history.
- [x] Improve catalog browsing and repeated item content.

### Phase 6 — Quality and maintenance

- [x] Run Mintlify validation and broken-link checks.
- [x] Review desktop and mobile navigation.
- [x] Add and visually review sendable routes for common user questions.
- [x] Add page ownership and freshness rules.
- [x] Merge the current `main` prompting guide and product changes before final QA.
- [ ] After release, use Mintlify analytics to inspect real searches, no-result queries, and weak result ranking.

### Current implementation block — Guides

- [x] Freeze the recently added Prompt Guide: no structure, copy, media, or
      navigation changes in this pass.
- [x] Make all eight workflow pages directly actionable with one short,
      truthful first request.
- [x] Replace the workflow pseudo-tabs and generated prompt panels with
      always-visible comparisons; rebuild `/workflows` as a compact visual
      router that works in both themes.
- [x] Apply the final non-Prompt Guides grouping while preserving the frozen
      Prompt Guide in its existing position and hierarchy.
- [x] Merge transcription and caption setup into the complete voice, sound,
      and captions guide.
- [x] Finish factual and UX review of every remaining non-Prompt Guide page.
- [x] Validate links, desktop, and mobile for the first Guides consolidation.
- [x] Re-run theme and responsive QA after the final workflow/navigation pass.
- [ ] Present the concrete Guides change list and receive owner review.

### Current implementation block — Developers

- [x] Classify all 59 current Developers destinations by page job and evidence.
- [x] Merge the duplicate SDK overview into one complete SDK quickstart and
      preserve the old URL with a permanent redirect.
- [x] Verify 85 TypeScript value-import examples against current package
      exports and verify every SDK composition method used in the docs.
- [x] Run the current CLI help for the main command, render, cloud, Lambda,
      Cloud Run, skills, Figma, add, and preview surfaces.
- [x] Verify the SDK suite (507 assertions) and the Player package suite (249
      assertions; the separate slideshow alias suite remains an isolated
      worktree-resolution limitation).
- [x] Lint every complete Developer HTML composition example with the current
      HyperFrames linter; six of six pass without errors or warnings.
- [x] Review the main Developers, SDK, Player, CLI, timing, and deployment
      pages at desktop and 390 px with no horizontal overflow.
- [x] Complete final theme, accessibility, Mintlify, and link QA with the rest
      of the site.

## Deliverables

- Visual audit: `../docs-audit/report.html`
- Audit data: `../docs-audit/audit-data.json`
- Working notes: `NOTES.md`
- System blueprint: `DOCS-SYSTEM-BLUEPRINT-2026-07-31.md`
- Complete route ledger: `ROUTE-LEDGER-2026-07-31.md`
- Visual architecture proposal: `../docs-audit/target-architecture-v2.html`
- Documentation rules: `../../docs/AGENTS.md`
- Refactored Mintlify site: `../../docs/`
