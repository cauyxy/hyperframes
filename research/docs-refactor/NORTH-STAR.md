# HyperFrames docs north star

Read this before any documentation work, including after context compaction.

## What the docs are for

HyperFrames documentation helps a smart general user move from curiosity to a
real result without learning framework internals first.

The product story is:

> Your request or source → an AI agent → an editable HyperFrames project →
> video, deck, embed, or reusable source.

The honest working loop is **describe → build → review → revise**. Never imply
that one prompt guarantees a finished professional result.

## Four canonical journeys

1. `/introduction` — understand what HyperFrames is and want to try it.
2. `/quickstart` — make a valid first request and reach a playable result.
3. `/go-further` — choose the right control surface for a real project.
4. `/developers` — choose the smallest integration surface.

Workflows, Studio, Catalog, export, troubleshooting, and technical references
are destinations inside those journeys, not additional competing front doors.

## Editorial test

Every page must earn its existence by answering a real question or completing a
real task. Every sentence, section, interaction, and visual must do at least one
of these jobs:

- make the outcome clearer;
- remove uncertainty;
- prove a claim;
- help the reader act;
- help the reader recover;
- route to a genuinely different next task.

If it does none of them, remove it. Do not keep empty routers, repeated
introductions, obvious instructions, decorative diagrams, or links that make
the reader click through several pages before learning anything.

## Audience and tone

- General users first; developers are the lowest-priority journey.
- Plain, direct language for intelligent adults.
- No fluff, fake enthusiasm, repetition, or internal terminology without a
  user-facing reason.
- Lead with a visible outcome, then the shortest successful path.
- Be precise about what the agent, Studio, CLI, SDK, Player, and render
  infrastructure each do.

## Visual and media standard

- Keep the approved Mintlify chrome, typography, sidebar behavior, right-side
  table of contents, and content width.
- Use visuals only when they prove an outcome, show a changing interface, or
  remove material uncertainty.
- Complete films use the approved DocsVideo player, narration, music,
  purposeful SFX, stable phrase captions, controls, and no autoplay or loop.
- Small proof loops may autoplay muted without controls.
- Use real current product UI and public presentation-quality HyperFrames work.
  Never mock a command, terminal result, Studio state, or product behavior.
- Reuse the restrained HyperFrames media identity: TT Norms Pro/Mono, rare ABC
  Solar display moments, dark house pattern, and restrained green accent. Do
  not reuse weekly changelog labels, dates, counters, filenames, or chrome.

## Truth standard

Old docs are leads, not proof. Verify every meaningful claim against current
source, tests, CLI help, public types/schema, shipped skills, or a confirmed
product flow. Screenshots and videos are product claims and must be current.

## Hard constraints

- Prompt Guide content and hierarchy are frozen in this pass.
- One page has one main job; length is not a quality target.
- Never more than two hops from a journey front door to a useful answer.
- One visually dominant next action per journey page, with ranked secondary
  actions only when they lead somewhere genuinely useful.
- No accordions, hidden choice tabs, anchor cards, or diagrams that repeat
  adjacent prose.
- Do not call the refactor finished until all gates in `QUALITY-GATES.md` pass.
