# HyperFrames documentation system blueprint

Status: **approved by the product owner on 2026-07-31**

Date: 2026-07-31

## The job of the docs

The docs should let a person move from a real question to a real result without
learning the repository structure first.

The four canonical questions remain:

1. What is HyperFrames?
2. How do I make my first video?
3. How do I get more control over an existing project?
4. How do I build on HyperFrames?

Every other page must support one of those journeys, answer a recurring support
question, or provide required technical reference. A page that does none of
those jobs should not remain in normal navigation.

## Product model the docs must reflect

HyperFrames is not only a renderer and not only Studio. The public product loop
is:

> request or source → agent and skills → editable HyperFrames project → agent,
> Studio, or code → check and render → video, deck, embed, or reusable source

The product surface underneath that loop has six layers:

1. **Creation workflows** — product launch, explainer, PR, captions, recut,
   motion graphics, music, slideshow, general video, and Remotion migration.
2. **Project model** — HTML composition, timing attributes, media, tracks,
   nested compositions, variables, and deterministic animation.
3. **Control surfaces** — agent skills, Studio, source files, and CLI.
4. **Reusable material** — local media, generated media, Catalog blocks,
   components, effects, transitions, and design systems.
5. **Delivery surfaces** — local rendering, Studio export, HeyGen cloud, AWS,
   GCP, Player, publish/share, and interactive presentation.
6. **Extension surfaces** — SDK, Core, Parsers, Engine, Producer, Studio Server,
   Player, rendering adapters, and package APIs.

The navigation should expose the human loop first. Package boundaries belong in
deep technical reference, not in the general-user learning path.

## What is systemically wrong today

The current navigation contains 280 public routes: 66 Guides, 18 Studio, 138
Catalog, and 58 Developers. The non-Catalog audit opened all 142 routes in the
real local Mintlify site.

The main problems are structural:

- landing pages, tutorials, task guides, explanations, and references often use
  the same card-heavy composition;
- several pages exist mainly to send the reader to another page;
- closely related tasks are split into pages too small to complete a useful
  workflow, especially in Studio and finishing;
- some legitimate references are judged like tutorials, while some tutorials
  read like references;
- Prompt Guide repeats parts of Workflows, uses hidden accordions, and lets a
  few videos dominate the whole viewport;
- complete narrated films and tiny demonstration loops do not follow different
  playback or sizing rules;
- technical groups reflect repository packages more strongly than a developer's
  first useful result.

Page length alone is not the issue. A 150-word Catalog item can be complete if
it shows the result and exact install/use contract. A 150-word Studio page is
incomplete if it does not show the interaction, outcome, or recovery path.

## Content types and their contracts

Every page gets one declared type before it is edited.

### Journey

Purpose: orient a person and move them through an end-to-end outcome.

Required:

- one clear promise;
- one complete, narrated proof film when video genuinely helps;
- a concise written path that works without the film;
- one dominant next action and no incidental link cloud.

Allowed only for the four canonical journey routes.

### Tutorial

Purpose: teach through one real project from start to finish.

Required:

- audience and finished result;
- prerequisites only when they are actually required;
- one continuous example;
- visible checkpoints and expected outcomes;
- common failure recovery;
- two or three ranked next steps.

### How-to

Purpose: answer one task question through the shortest truthful path.

Required:

- task outcome in the title and opening;
- minimum essential steps;
- the expected visible result;
- one compact screenshot or UI loop when it reduces uncertainty;
- a short known-pain-point section when relevant.

Related how-tos should be merged when they have the same reader, prerequisite,
and outcome. They stay separate when support needs a stable direct route or the
task has a genuinely different success state.

### Explanation

Purpose: build a mental model.

Required:

- one plain-language claim;
- a diagram or real example when the relationship is easier to see than read;
- why it matters and when the distinction changes a decision;
- technical detail only after the human model is clear.

### Reference

Purpose: provide precise, searchable facts.

Required:

- a short “when to use this” opening;
- scannable syntax, options, types, tables, and examples;
- source-backed completeness and generated content where feasible;
- no narrative film and no artificial word limit.

### Router

Purpose: help a person choose between genuinely different destinations.

Allowed only at a tab or major section entrance. It must teach the distinction
between the choices; a card directory with no decision model is not a page.

### Troubleshooting

Purpose: return a person to the task they were completing.

Structure: visible symptom → likely cause → smallest fix → verification → deeper
diagnostics or escalation.

### Catalog item

Purpose: let a person judge and use one reusable block or component.

Required: truthful preview, what it is good for, install/use contract, variables
or options, and source. These pages should remain compact and generated.

## Target information architecture

The existing Mintlify chrome and the four header tabs remain.

### Guides

1. **Start here**
   - What is HyperFrames?
   - Make your first video
   - Go further
   - Build on HyperFrames
2. **Create with an agent**
   - Connect or prepare an agent
   - How an agent builds a project
   - Bring in a design system or Figma source
3. **Prompt Guide**
   - Preserve the familiar level hierarchy from `main`.
   - Remove duplication with workflow pages.
   - Replace hidden accordions with visible, scannable examples.
   - Recompose the oversized Motion and Capstone chapters instead of flattening
     the entire guide.
4. **Workflows**
   - Keep the eight distinct input/outcome routes.
   - Each route shows one truthful finished result, the minimum useful brief,
     the review loop, and the next relevant control surface.
5. **Projects and media**
   - How a HyperFrames project works
   - Use media in a project
   - Voice, music, and captions
   - Backgrounds, color, and effects
6. **Finish and share**
   - Check, render, and share
   - Advanced output choices only when they matter to a general user
7. **Examples**
8. **Help**
9. **What's new**

### Studio

Reduce eighteen small destinations to approximately thirteen complete jobs:

1. Studio overview and tour
2. Review a storyboard and leave feedback
3. Edit the frame — merge Canvas, Layers, and Design
4. Edit timing on the timeline
5. Animate — merge Animation and the Studio part of Keyframes
6. Use assets and Catalog blocks
7. Edit captions
8. Create variables and reusable versions
9. Build and present slideshows
10. Work with source and an agent
11. Check, render, and export
12. Keyboard shortcuts reference
13. Troubleshoot Studio

Old routes remain as redirects or anchor-compatible support links.

### Catalog

Keep generated item pages. Rebuild the Catalog entrance into a usable visual
finder with search, category filters, aspect/format cues, and clear Studio and
CLI install paths.

Rename internal-facing categories such as “HTML-in-Canvas” if the public label
does not help a creator choose an effect. Generated item pages stay short; their
quality comes from truthful preview and precise use instructions, not prose.

### Developers

The header tab opens the technical overview. The separate “Build on
HyperFrames” journey remains under Start here.

1. **Start building** — choose CLI, SDK, Player, schema, or rendering by first
   useful result.
2. **Command line** — task entry plus exhaustive generated command reference.
3. **SDK** — quickstart, editing workflows, and API reference.
4. **Composition and animation** — schema, timing, adapters, determinism,
   GSAP, HTML-in-canvas, and migration.
5. **Playback** — Player embedding and seeking.
6. **Rendering and deployment** — local/Producer/Engine/cloud/AWS/GCP chooser
   followed by provider guides.
7. **Packages** — deep package reference, not a primary learning sequence.
8. **Integrations** — authentication, skills lifecycle, agent hosts, Figma.
9. **Contributing** — maintainer-only material at the end.

The developer front door must contain enough explanation and a smallest working
example. It cannot be only a film followed by routing cards.

## Major consolidation decisions

- Merge Studio Canvas, Layers, and Design into one “Edit the frame” how-to.
- Merge Studio Animation with the Studio-facing Keyframes material; keep schema
  and runtime contracts in Developers.
- Merge Concepts, Project Tour, and the human part of Pipeline into one project
  mental-model page. Preserve deep contracts in Developers.
- Merge normal quality, export, render, and sharing into one complete finishing
  path. Keep 4K, HDR, cloud, and infrastructure as technical or advanced
  destinations.
- Merge voice/audio and transcription/captions into one creator-facing media
  chapter unless direct-route evidence shows the tasks need separate pages.
- Keep all eight creation workflow routes because their inputs, agent workflows,
  and successful outputs are meaningfully different.
- Keep Prompt Guide as a course, but remove workflow-level repetition and
  convert giant or hidden media patterns.
- Keep CLI, SDK, package, schema, and generated Catalog reference pages even
  when long or short. They have a distinct lookup job.
- Remove or redirect pages that only restate a parent and route elsewhere.

## Media system

Video is used when it demonstrates motion, a UI interaction, a first-time
workflow, or a concept that is materially easier to understand visually. It is
not used for flags, API fields, copyable commands, or facts that scan faster as
text.

| Media role                | Playback                           | Size                               | Audio                           |
| ------------------------- | ---------------------------------- | ---------------------------------- | ------------------------------- |
| Journey film              | controls, no autoplay, no loop     | full content width, 16:9           | narration, BGM, SFX, captions   |
| Finished workflow example | controls, no autoplay, no loop     | full or approximately 80% width    | original mix available          |
| UI or motion proof loop   | autoplay, muted, loop, no controls | one or two compact columns         | none                            |
| Portrait example          | same as its role                   | centered, capped around 560px high | role-dependent                  |
| Before/after              | paired or interactive comparison   | never two giant stacked players    | muted unless sound is the point |

All complete films receive a transcript or chapter summary. Captions use one
consistent safe-area position and typography unless the composition itself is
teaching caption design. Every video gets an owner, source project, poster,
versioned URL, and product-version verification note.

## Editorial rules

- One page, one job. One section, one reason to exist.
- Do not repeat a heading in the sentence below it.
- Explain why only when it changes a decision.
- Do not introduce internal terminology before the task needs it.
- Keep the primary answer in the main flow, not behind an accordion.
- Use one recommended path; present alternatives only when they are genuinely
  equivalent or serve different constraints.
- Links inside a procedure exist only when needed to complete it. Discovery
  links belong in a ranked ending.
- Every example uses real HyperFrames behavior, real commands, and internally
  consistent project footage.
- Short is good only when complete. Long is good only when scannable and
  reference-worthy.

## Verification and maintenance

Every factual edit is checked against README, CLI help, package exports, tests,
Studio source, shipped skills, or real product behavior.

Before a section is called complete:

1. every page has an assigned content type and owner;
2. every route has a keep/expand/merge/split/redirect/remove decision;
3. every command and UI claim has a source pointer;
4. every video is watched at the real docs width and classified by media role;
5. desktop and 390px mobile layouts pass;
6. Mintlify validation and broken-link checks pass;
7. redirects preserve existing support and external links;
8. a reader test confirms the page's declared outcome.

## Implementation order

1. Approve this system and target navigation.
2. Finish the route ledger for all 142 non-Catalog routes and the generated
   Catalog class.
3. Rebuild the high-traffic front doors and remove empty router hops.
4. Consolidate Studio and Finish/Share pages with redirects.
5. Rework Prompt Guide duplication, accordions, and media sizing.
6. Separate developer learning paths from exhaustive references.
7. Audit all unique videos end to end and replace or resize them by role.
8. Run factual, editorial, visual, accessibility, mobile, and link QA.

No section should be called finished merely because it builds or because every
route opens.
