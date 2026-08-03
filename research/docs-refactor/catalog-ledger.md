# Catalog content-class ledger

Status: **138 of 138 current generated Catalog routes covered**

Catalog pages are generated from `registry/registry.json` and each item's
`registry-item.json`. They are one governed content class, not 138 separately
authored editorial pages. The generator owns item pages, the JSON search index,
and the Catalog groups in `docs.json`.

## Current generated inventory

| Group              |  Routes | Content decision                                                                                           |
| ------------------ | ------: | ---------------------------------------------------------------------------------------------------------- |
| Code Animations    |       9 | Keep as generated item pages; verify the preview and installed block against its manifest.                 |
| Captions           |      15 | Keep as generated item pages; make the visible caption behavior clear before installation details.         |
| HTML-in-Canvas     |      13 | Keep as generated item pages with the real Chrome-flag warning and renderer behavior.                      |
| Social Overlays    |       9 | Keep as generated item pages; distinguish communication overlays from decorative effects.                  |
| Lower Thirds       |      12 | Keep as generated item pages; preview must make hierarchy and safe placement visible.                      |
| Shader Transitions |      14 | Keep as generated item pages; preview first, then agent and terminal installation paths.                   |
| CSS Transitions    |      14 | Keep as generated item pages; avoid duplicating transition-selection advice from Prompt Guide.             |
| Showcases          |      31 | Keep as generated item pages; label these as adaptable starting scenes, not finished templates.            |
| Data               |       7 | Keep as generated item pages; examples must preserve honest values, labels, and geographic meaning.        |
| Effects            |      10 | Keep as generated item pages; show the effect at a readable final size.                                    |
| Blocks             |       4 | Keep as generated item pages; improve tags so useful blocks do not fall into an unhelpful remainder group. |
| **Total**          | **138** | Generated from the registry; no manual route list should compete with the source of truth.                 |

## Catalog root

`/catalog` remains the human front door, but it should become a searchable visual
finder rather than a card page that sends people into the sidebar. It must let a
reader choose by communication job, inspect a preview, filter by type or tag,
and open the item without learning registry terminology first.

The root should explain `block` versus `component` once, provide the shortest
agent path, and keep terminal installation secondary. It should not repeat the
Prompt Guide's advice about when a transition, caption, chart, or overlay is a
good storytelling choice.

## Generated item contract

Every item page must be produced from verified manifest data and contain, in
this order:

1. a concrete title and one-sentence communication job;
2. the real muted preview loop and poster;
3. the shortest agent request and terminal install command as parallel paths;
4. generated type, dimensions, duration, files, and dependencies when present;
5. the smallest correct usage example;
6. item-specific warnings or related skills only when they materially affect use.

Do not manually patch generated MDX. Change the manifest or
`scripts/generate-catalog-pages.ts`, regenerate, then review representative
output from every content branch.

## Generator and quality gates

- generated route count equals the block and component items discoverable from
  `registry/registry.json`;
- every generated route exists in `docs.json`, and no deleted registry item
  leaves a stale page;
- every preview URL resolves to an MP4 and poster, and motion is reviewed at the
  real docs width;
- `npx hyperframes add <name>` installs the files shown on the page;
- dimensions, duration, type, files, dependencies, warnings, author, prompt,
  and related skill come from the current manifest;
- all tag-derived groups are useful to a human; the generic Blocks group is a
  signal to improve metadata, not a permanent taxonomy;
- test one normal block, one component, one HTML-in-Canvas item, and every
  special generator branch after generator changes.

## Current structural findings

- The generated detail template is fundamentally useful: proof, two install
  paths, facts, then usage.
- The Catalog root is still too static for 138 items; discovery needs search,
  filters, and visual comparison.
- Several generated descriptions are fragments or implementation-led. The
  manifest descriptions need an editorial pass, not one-off MDX rewrites.
- A full-width 16:9 loop is justified for an item whose purpose is motion, but
  the preview should not dominate long texture or reference variants.
- Category ownership is currently inferred from tags. Bad tags therefore become
  bad navigation and must be checked as product data.
