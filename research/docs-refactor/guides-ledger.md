# Guides route ledger

Status: **66 of 66 current Guides routes classified**

Implementation status: **29 of 29 non-Prompt Guide routes reviewed against the
current product; 32 Prompt Guide routes frozen by owner decision.** Owner review
of the non-Prompt Guides block is the current gate.

Final Guides navigation: **Start here → Create with an agent → Prompt Guide
(frozen) → Workflows → Projects and media → Finish → Explore → Help.**
The 66-route tables below preserve the initial classification, including routes
later merged or moved; the shipped Guides tab now contains 61 destinations.

## Start here — 4

| Route           | Type and decision                      | Destination | Reason                                                                                    |
| --------------- | -------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `/introduction` | Journey · keep, verify film            | Same        | Canonical answer to “What is HyperFrames?” with definition, proof, and one next action.   |
| `/quickstart`   | Journey · keep, strengthen checkpoints | Same        | Canonical beginner path; keep the short request and equal agent/Studio/CLI continuations. |
| `/go-further`   | Journey · keep, expand written model   | Same        | Canonical returning-user path; must work without watching the film.                       |
| `/developers`   | Journey · keep, verify examples        | Same        | Canonical technical journey; it now contains a real model and smallest examples.          |

## Create with an agent — 3

| Route                  | Type and decision                  | Destination | Reason                                                                |
| ---------------------- | ---------------------------------- | ----------- | --------------------------------------------------------------------- |
| `/guides/mcp`          | How-to · keep, continuously verify | Same        | Distinct hosted path with changing host and plan prerequisites.       |
| `/guides/pipeline`     | Explanation · merge                | `/concepts` | The human project loop belongs in the complete project mental model.  |
| `/guides/design-tools` | How-to · keep, demonstrate         | Same        | Distinct job: turn an external design into editable project material. |

## Prompt Guide — 32

**Owner decision: frozen for this pass.** The Prompt Guide was recently added.
Do not change its hierarchy, copy, examples, media, or navigation while the
rest of Guides is consolidated. Preserve existing routes and solve removed-link
compatibility with redirects rather than reopening these pages.

The per-route decisions in this table are the pre-freeze audit record. They are
not active implementation instructions for this pass.

| Route                                   | Type and decision                         | Destination                               | Reason                                                                              |
| --------------------------------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `/prompting/overview`                   | Course overview · frozen                  | Same                                      | Recently added; explicitly excluded from this pass.                                 |
| `/prompting/product-launch`             | Prompt lesson · rewrite/de-duplicate      | Same                                      | Teach which clauses change a launch result; do not repeat the workflow page.        |
| `/prompting/explainers`                 | Prompt lesson · rewrite/de-duplicate      | Same                                      | Keep scene-density, angle, and wording instruction.                                 |
| `/prompting/code-and-prs`               | Prompt lesson · rewrite/de-duplicate      | Same                                      | Keep audience, impact-vs-diff, and code-density guidance.                           |
| `/prompting/captions-and-talking-heads` | Prompt lesson · rewrite/de-duplicate      | Same                                      | Keep prompt decisions around captions, overlays, and untouched footage.             |
| `/prompting/music-and-slideshows`       | Prompt lessons · split                    | Music video + slideshows                  | Beat-synced MP4 and navigable deck have different jobs and outputs.                 |
| `/prompting/motion-graphics`            | Prompt lesson · rewrite/de-duplicate      | Same                                      | Keep duration, alpha, block choice, and motion-language decisions.                  |
| `/prompting/anatomy`                    | Explanation · keep, tighten               | Same                                      | Core reusable model for a useful request.                                           |
| `/prompting/specification-dial`         | Explanation · merge                       | Prompt anatomy                            | Too small and inseparable from prompt anatomy.                                      |
| `/prompting/vocabulary`                 | Prompt reference · keep, verify           | Same                                      | Distinct lookup for motion, camera, pacing, captions, audio, and output language.   |
| `/prompting/visual-specs`               | Prompt lesson · keep, demonstrate         | Same                                      | Turns visual intent into a concrete, testable specification.                        |
| `/prompting/examples`                   | Prompt reference · rewrite                | Same                                      | Preserve verified prompts; replace twenty accordions with visible examples.         |
| `/prompting/motion`                     | Explanation series · split/recompose      | Motion + camera/depth + pacing/continuity | Current 5,000-word multi-video page combines three substantial ideas.               |
| `/prompting/transitions`                | Prompt reference · keep, compact previews | Same                                      | Distinct chooser for meaningful scene transitions.                                  |
| `/prompting/code-blocks`                | Prompt reference · keep/de-duplicate      | Same                                      | Teach how to ask for code motion; exact block facts remain in Catalog.              |
| `/prompting/data-and-maps`              | Prompt reference · keep, demonstrate      | Same                                      | Distinct language for evidence, numbers, and geographic relationships.              |
| `/prompting/overlays-and-lower-thirds`  | Prompt reference · keep, compact          | Same                                      | Distinct chooser for supplemental on-screen information.                            |
| `/prompting/captions-catalog`           | Prompt reference · keep, compact          | Same                                      | Selection guidance stays here; generated details remain in Catalog.                 |
| `/prompting/generated-artwork`          | Explanation · keep, expand example        | Same                                      | Short but potentially complete: when generated artwork adds meaning.                |
| `/prompting/vfx-and-liquid-glass`       | Prompt reference · keep/de-duplicate      | Same                                      | Keep intent language; technical wiring and block facts stay deeper.                 |
| `/prompting/runtimes-and-3d`            | Explanation · split                       | Same + Developers reference               | Keep creator chooser; move runtime contracts and implementation caveats.            |
| `/prompting/media-and-audio`            | Prompt lesson · keep, structure           | Same                                      | Coherent advanced chapter about specifying media, voice, music, SFX, and timing.    |
| `/prompting/design-systems`             | Prompt lesson · keep, demonstrate         | Same                                      | Use brand truth without prescribing every frame.                                    |
| `/prompting/variables-and-templating`   | Prompt lesson · keep, demonstrate         | Same                                      | Ask for reusable, data-driven versions rather than copies.                          |
| `/prompting/storyboards`                | Prompt lesson · keep/de-duplicate         | Same                                      | Teach planning language; Studio owns storyboard controls.                           |
| `/prompting/editing-existing-videos`    | Prompt lesson · keep, verify boundaries   | Same                                      | Distinct vocabulary for revising a project or existing footage.                     |
| `/prompting/iterating`                  | Prompt lesson · keep, strengthen examples | Same                                      | Turn subjective feedback into observable revision targets.                          |
| `/prompting/recreating-references`      | Prompt lesson · keep, remove accordion    | Same                                      | Describe transferable motion and composition rather than blind imitation.           |
| `/prompting/rendering-and-output`       | Prompt lesson/reference · split           | Same + Developers render reference        | Keep creator choices; move flags, codecs, and infrastructure contracts.             |
| `/prompting/remotion-migration`         | Developer migration · move/merge          | HyperFrames vs Remotion                   | Source migration is not a general Prompt Guide lesson.                              |
| `/prompting/capstone`                   | Tutorial · keep, recompose                | Same                                      | A long page is justified for one complete project; media and chapters need control. |
| `/prompting/rules-and-anti-patterns`    | Prompt reference · split                  | Same + lint reference                     | Keep human mistakes here; move lint/render contracts to reference.                  |

## Workflows — 8 task pages + 1 router

| Route                          | Type and decision                         | Destination | Reason                                                                      |
| ------------------------------ | ----------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `/workflows`                   | Visual router · keep, compact             | Same        | Lets a reader choose from the source material they already have.            |
| `/guides/product-launch-video` | Workflow how-to · keep, verify proof      | Same        | Distinct URL/capture input and product outcome.                             |
| `/guides/faceless-explainer`   | Workflow how-to · keep, improve proof     | Same        | Distinct text-only input and invented-visual outcome.                       |
| `/guides/pr-to-video`          | Workflow how-to · keep, verify            | Same        | Distinct PR input, audience choice, and release-state risks.                |
| `/guides/captions-and-recuts`  | Workflow router · keep, clarify           | Same        | Captions, overlays, and footage editing have genuinely different contracts. |
| `/guides/motion-graphics`      | Workflow how-to · keep, verify alpha      | Same        | Distinct short, unnarrated, motion-led output.                              |
| `/guides/music-to-video`       | Workflow how-to · keep, verify beat proof | Same        | Distinct music-led timing model.                                            |
| `/guides/slideshow`            | Workflow how-to · keep, verify limitation | Same        | Distinct live deck and presenter outcome.                                   |
| `/guides/general-video`        | Workflow how-to · keep, clarify fallback  | Same        | Necessary path for mixed-source, longer, unusual, or co-directed work.      |

## Learn — 3

| Route                    | Type and decision                            | Destination                 | Reason                                                                    |
| ------------------------ | -------------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `/concepts`              | Explanation · rewrite/expand                 | Same                        | Become the complete human mental model for project, controls, and render. |
| `/concepts/compositions` | Explanation/reference · merge/split          | Concepts + schema reference | Human model belongs in Concepts; exact contracts belong in reference.     |
| `/concepts/variables`    | Explanation/how-to · keep, connect to Studio | Same                        | Distinct reusable-content concept with human and technical value.         |

## Media — 7

| Route                            | Type and decision              | Destination                 | Reason                                                                             |
| -------------------------------- | ------------------------------ | --------------------------- | ---------------------------------------------------------------------------------- |
| `/guides/media`                  | Section entrance/how-to · keep | Same                        | Teaches the media lifecycle before routing to distinct tasks.                      |
| `/guides/video-components`       | How-to · keep                  | Same                        | Distinct task: import, place, replace, trim, and verify images and video.          |
| `/guides/voice-and-audio`        | How-to · expanded/merged       | Same                        | Complete voice, music, SFX, transcription, caption, and final-listening workflow.  |
| `/guides/transcribe-and-caption` | How-to · merged                | Voice/audio caption section | Too small alone and part of the same audio-to-caption workflow.                    |
| `/guides/remove-background`      | How-to/reference · keep        | Same                        | Sendable task with its own local model, outputs, quality choices, and limitations. |
| `/guides/color-grading`          | How-to/reference · keep        | Same                        | Sendable correction/look task with Studio and agent/CLI paths.                     |
| `/guides/media-effects`          | How-to/reference · keep        | Same                        | Sendable stylization task; different intent and controls from color correction.    |

## Export and share — 4

| Route                       | Type and decision                | Destination                | Reason                                                                        |
| --------------------------- | -------------------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `/guides/export-and-share`  | Tutorial/how-to · rewrite/expand | Same                       | Become the complete normal finish: review, check, render, watch, name, share. |
| `/guides/quality-checklist` | Checklist · merge                | Export/share check section | Quality review is a step in finishing, not another journey hop.               |
| `/guides/publish-and-share` | How-to · merge                   | Export/share share section | Sharing is the final part of the same task.                                   |
| `/guides/rendering`         | How-to/reference · merge/split   | Export/share + Developers  | Keep simple render paths in Guides and technical flags deeper.                |

## Examples, help, and updates — 5

| Route                     | Type and decision                           | Destination | Reason                                                                    |
| ------------------------- | ------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| `/examples`               | Showcase/starter library · keep, clarify    | Same        | Distinct proof and remix job.                                             |
| `/help`                   | Troubleshooting entrance · keep, strengthen | Same        | Earns a router by starting from visible symptoms and returning to a task. |
| `/guides/troubleshooting` | Troubleshooting · keep/de-duplicate         | Same        | Reserve for project/runtime failures.                                     |
| `/guides/feedback`        | How-to · keep, simplify                     | Same        | Distinct action: send enough evidence for useful support.                 |
| `/product-updates`        | Changelog · keep                            | Same        | Human-readable product changes have a distinct job.                       |

## Guides implementation order

1. Preserve the four journey routes and verify their complete films.
2. Build the consolidated project mental model and finishing path.
3. Leave the Prompt Guide untouched; make Workflows independently actionable.
4. Consolidate only inseparable media tasks and preserve old routes with redirects.
5. Audit every Guides video end to end at the real docs width.
