# Studio route ledger

Status: **18 of 18 current Studio routes classified**

The target is thirteen complete user jobs. Small pages merge only when they share the same reader, selected object, and success state.

| Route                       | Type and decision                   | Destination                                    | Reason                                                                          |
| --------------------------- | ----------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `/studio`                   | Overview/tutorial · rewrite/expand  | Same                                           | Combine the film with a real annotated orientation and first useful edit.       |
| `/studio/tour`              | Tutorial · merge                    | Studio overview                                | The tour repeats the front door and should become its written continuation.     |
| `/studio/storyboard`        | How-to · keep/expand                | Same                                           | Distinct review and agent-feedback job with its own outcome.                    |
| `/studio/canvas`            | How-to · rewrite/expand             | Same, retitled “Edit the frame”                | Complete selected-element workflow across Canvas, Layers, and Design.           |
| `/studio/layers`            | How-to · merge                      | Canvas layers section                          | Same reader, selection, and frame-editing outcome.                              |
| `/studio/timeline`          | How-to · keep/expand                | Same                                           | Distinct time job: seek, move, trim, split, snap, zoom, and beats.              |
| `/studio/design`            | How-to · merge                      | Canvas design section                          | Same selected-element workflow; incomplete alone.                               |
| `/studio/animation`         | How-to · rewrite/expand             | Same                                           | Complete motion workflow: keyframes, easing, auto-keyframe, gestures, paths.    |
| `/guides/keyframes`         | How-to/reference · merge/split      | Studio Animation + Developers                  | Studio interactions stay with Animation; runtime/source contracts move deeper.  |
| `/studio/assets-and-blocks` | How-to · keep/expand                | Same                                           | Distinct import, reuse, proxy, and Catalog insertion job.                       |
| `/studio/captions`          | How-to · keep/expand                | Same                                           | Distinguish durable word transforms from timing, split, and animation previews. |
| `/studio/variables`         | How-to · keep/expand                | Same                                           | Complete binding, preview, default, handoff, and fallback-testing workflow.     |
| `/studio/slideshows`        | How-to · keep/expand                | Same                                           | Distinct deck, fragment, branch, hotspot, notes, and presenter job.             |
| `/studio/source`            | How-to · rewrite/expand             | Same, retitled “Work with source and an agent” | Complete source, autosave, context copy, and agent handoff workflow.            |
| `/studio/lint-and-agent`    | How-to · merge                      | Studio Source check/agent section              | Lint findings and agent handoff are one source/recovery loop.                   |
| `/studio/export`            | How-to · rewrite/expand             | Same                                           | Complete format, quality, queue, cancel, download, and watch-back path.         |
| `/studio/shortcuts`         | Reference · keep/generate           | Same                                           | Compact lookup is justified; every shortcut must come from source.              |
| `/studio/troubleshooting`   | Troubleshooting · keep/de-duplicate | Same                                           | Keep only Studio state, save, UI, and render-queue failures.                    |

## Target Studio sequence

1. Studio overview and tour
2. Review a storyboard and leave feedback
3. Edit the frame
4. Edit timing on the timeline
5. Animate
6. Use assets and Catalog blocks
7. Edit captions
8. Create variables and reusable versions
9. Build and present slideshows
10. Work with source and an agent
11. Check, render, and export
12. Keyboard shortcuts
13. Troubleshoot Studio

## Required proof

- real current projects or focused fixtures that prove the exact task shown;
- compact real UI loops for the important visual interactions;
- no invented controls, fake output, or stale screenshots;
- exact save/autosave behavior verified from current source;
- desktop and 390px mobile review;
- redirects for Tour, Layers, Design, Keyframes, and Lint/Agent before removal
  from navigation.

## Verified implementation — 2026-08-01

- All thirteen current Studio destinations were rendered and checked at the
  desktop docs width; no overflow, missing alternative text, empty controls, or
  unexpected autoplay audio remains.
- Variables was verified against the current panel, SDK persistence path, and
  render-command handoff. The page now covers binding, preview overrides,
  defaults, copied values, and realistic fallback testing.
- Captions was verified against the current store and `useCaptionSync` path.
  Position, scale, and rotation overrides persist to
  `caption-overrides.json`. Timing trims, group splits, and Animation-tab edits
  are live previews today and do not survive reload; the page now states this
  limitation explicitly.
- Slideshows was verified against the current panel, manifest writer, helpers,
  and `hyperframes present` command. Main-line order, notes, fragment
  hold-points, branches, and hotspots persist to the slideshow island; deleting
  a branch also removes hotspots that target it.
- Added one real 1280×720 current-product screenshot to each of Variables,
  Captions, and Slideshows. The images show the exact UI described on the page,
  not mockups or unrelated projects.
