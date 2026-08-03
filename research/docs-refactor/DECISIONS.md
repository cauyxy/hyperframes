# Documentation decisions

This file records settled decisions so they are not reopened accidentally.

## Information architecture

- Header tabs remain **Guides, Studio, Catalog, Developers**.
- Guides “Start here” contains all four journey pages, including Developers.
- The Developers header tab opens `/developers/overview` and switches to the
  Developers sidebar; `/developers` remains the general journey page.
- Left sidebar grouping, active vertical rail, right-side “On this page,”
  header row, theme behavior, borders, content width, GitHub star treatment,
  and agent input keep the approved Mintlify UX.
- No nested/collapsible sidebar groups.

## Page system

- Canonical journeys are Introduction, Quickstart, Go further, and Developers.
- Workflows is a visual source/outcome router; destination guides contain the
  useful answer rather than another routing layer.
- Studio pages are task centers, not one page per control.
- Technical learning paths precede exhaustive reference; CLI reference remains
  searchable and complete.
- Prompt Guide is frozen in content, structure, media, and navigation for this
  pass. Only site-wide presentation behavior may affect it.

## Media and player

- Full films use `DocsVideo`; user click starts with sound.
- Small ambient/proof loops stay native autoplay-muted videos.
- Scrubbing uses a real frame preview and smooth progress.
- Portrait video is capped and centered rather than filling the viewport.
- Captions stay on one stable lower rail unless a real product control occupies
  that area.
- No journey counters, scene counters, filenames, debug labels, redundant
  HyperFrames labels, or weekly changelog chrome.
- Versioned immutable CDN names only; never overwrite an existing media URL.

## Product framing

- Agent, Studio, CLI, and source are valid continuations from the same editable
  project. No page implies Studio or the Renders panel is mandatory.
- Beginner installation uses the human-facing interactive README command:
  `npx skills add heygen-com/hyperframes --full-depth`, then Core Skills.
- `npx hyperframes skills update` belongs in agent/non-interactive lifecycle
  documentation, not the beginner first path.
- HyperFrames owns composition, editing, playback, and rendering; HeyGen may
  generate presenter/avatar media that HyperFrames then uses.

## Delivery

- Preserve the giant checkpoint only as recovery.
- Ship four stacked PRs: foundation/journeys; Guides/Studio;
  Developers/reference; Catalog/media/QA.
- Do not ask for review until each PR passes its own gates.
- Slack review request goes to `hyperframes-squad-internal`, tags Magi and
  Rames Jusso, and follows the user's existing review-message style.
