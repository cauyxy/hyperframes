# Developers route ledger

Status: **59 of 59 current Developers destinations classified**
The navigation contained 60 before the duplicate SDK overview was merged into
the quickstart.

## Overview and command line — 4

| Route                  | Type and decision                    | Destination | Reason                                                                                                     |
| ---------------------- | ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `/developers/overview` | Technical overview · rewrite/expand  | Same        | Header destination must teach the model and smallest examples, not only route onward.                      |
| `/developers/cli`      | How-to/command chooser · keep/expand | Same        | Useful task entry before exhaustive reference.                                                             |
| `/packages/cli`        | Reference · keep/searchable          | Same        | One exhaustive page avoids command-by-command hops; visible sections and the right TOC make it searchable. |
| `/packages/lint`       | Reference · keep/source-verify       | Same        | Distinct package and rule lookup job.                                                                      |

## SDK — 14

| Route                                | Type and decision                        | Destination | Reason                                                              |
| ------------------------------------ | ---------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `/sdk/quickstart`                    | Tutorial · rewrite/expand                | Same        | Become the SDK front door and smallest open/query/edit/save result. |
| `/sdk/guides/querying-and-editing`   | How-to · keep/verify                     | Same        | Distinct SDK task.                                                  |
| `/sdk/guides/timing-and-animation`   | How-to · keep/verify                     | Same        | Distinct SDK timing and motion task.                                |
| `/sdk/guides/undo-redo-and-patches`  | How-to · keep/verify                     | Same        | Distinct application-state and history task.                        |
| `/sdk/guides/persistence`            | How-to · keep/verify                     | Same        | Distinct save, adapter, and external-storage task.                  |
| `/sdk/guides/embedded-override-mode` | How-to · keep/verify                     | Same        | Distinct source-override integration mode.                          |
| `/sdk/guides/canvas-integration`     | How-to · keep/verify                     | Same        | Distinct editing-surface integration task.                          |
| `/sdk/guides/editing-affordances`    | How-to · keep/verify                     | Same        | Distinct selection and editing-affordance task.                     |
| `/sdk/reference/open-composition`    | Reference · keep/source-verify           | Same        | Exact API lookup.                                                   |
| `/sdk/reference/composition`         | Reference · keep/source-verify           | Same        | Exact composition API lookup.                                       |
| `/sdk/reference/edit-operations`     | Reference · keep/source-verify           | Same        | Exact operations lookup.                                            |
| `/sdk/reference/types`               | Reference · keep/generate where possible | Same        | Exact type lookup.                                                  |
| `/sdk/reference/adapters`            | Reference · keep/source-verify           | Same        | Exact adapter contract lookup.                                      |
| `/sdk/reference/utilities`           | Reference · keep/source-verify           | Same        | Exact utility lookup.                                               |

## Composition and animation — 8

| Route                             | Type and decision                     | Destination           | Reason                                                                    |
| --------------------------------- | ------------------------------------- | --------------------- | ------------------------------------------------------------------------- |
| `/reference/html-schema`          | Reference · keep/add drift checks     | Same                  | Canonical composition contract.                                           |
| `/concepts/compositions`          | Explanation/how-to · keep/verify      | Same                  | Distinct nested-composition model and timing task.                        |
| `/concepts/data-attributes`       | Focused reference · keep/de-duplicate | Same                  | Useful direct timing lookup if it links to rather than clones the schema. |
| `/guides/gsap-animation`          | Tutorial/how-to · keep/verify         | Same                  | Primary supported animation-runtime authoring path.                       |
| `/concepts/frame-adapters`        | Explanation/reference · keep          | Same under Developers | Distinct extension contract for seekable runtimes.                        |
| `/concepts/determinism`           | Explanation · keep/layer              | Same under Developers | Distinct architectural guarantee; consequences first, contract second.    |
| `/guides/html-in-canvas`          | Implementation guide · keep/verify    | Same                  | Distinct custom-render-surface architecture.                              |
| `/guides/hyperframes-vs-remotion` | Comparison/migration · expand         | Same                  | Absorb the useful Remotion-migration lesson and keep tradeoffs honest.    |

## Rendering and deployment — 10

| Route                                     | Type and decision                   | Destination | Reason                                                                             |
| ----------------------------------------- | ----------------------------------- | ----------- | ---------------------------------------------------------------------------------- |
| `/deploy/overview`                        | Technical chooser · keep/strengthen | Same        | Earns a router by distinguishing local, managed, Producer/Engine, AWS, and GCP.    |
| `/guides/rendering`                       | How-to · keep/verify                | Same        | Distinct local CLI rendering task before deployment or infrastructure.             |
| `/deploy/cloud`                           | How-to · keep/verify                | Same        | Distinct managed rendering path.                                                   |
| `/guides/deploy`                          | How-to · keep/rename                | Same        | Distinct hosted preview/render template path; title must not imply all deployment. |
| `/deploy/aws-lambda`                      | Tutorial/how-to · keep/verify       | Same        | Distinct self-hosted provider workflow.                                            |
| `/deploy/gcp-cloud-run`                   | Tutorial/how-to · keep/verify       | Same        | Distinct self-hosted provider workflow.                                            |
| `/deploy/templates-on-lambda`             | How-to · keep deep                  | Same        | Distinct template-at-scale task after Lambda works.                                |
| `/deploy/migrating-to-hyperframes-lambda` | Migration · keep deep               | Same        | Specialized but legitimate migration.                                              |
| `/packages/aws-lambda`                    | Reference · keep/source-verify      | Same        | Exact package/API lookup.                                                          |
| `/packages/gcp-cloud-run`                 | Reference · keep/source-verify      | Same        | Exact package/API lookup.                                                          |

## Advanced rendering — 3

| Route                  | Type and decision                       | Destination | Reason                                                         |
| ---------------------- | --------------------------------------- | ----------- | -------------------------------------------------------------- |
| `/guides/4k-rendering` | How-to/explanation · keep/verify        | Same        | Distinct resolution and supersampling constraints.             |
| `/guides/hdr`          | Explanation/reference · keep/verify     | Same        | Distinct color-space, hardware, codec, and source constraints. |
| `/guides/performance`  | Troubleshooting/reference · keep/verify | Same        | Distinct render reliability and optimization job.              |

## Packages — 9

| Route                          | Type and decision                     | Destination | Reason                                                           |
| ------------------------------ | ------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `/packages/core`               | Reference · keep/source-verify        | Same        | Core types, parsing, generation, linting, runtime, and adapters. |
| `/packages/parsers`            | Reference · keep/source-verify        | Same        | Parser and writer package lookup.                                |
| `/packages/studio-server`      | Reference · keep/source-verify        | Same        | Studio persistence/server adapter contract.                      |
| `/packages/sdk`                | Reference · keep/source-verify        | Same        | Package-level SDK exports and operations.                        |
| `/packages/engine`             | Reference · keep/source-verify        | Same        | Frame-capture engine API and responsibilities.                   |
| `/packages/player`             | Reference/quick example · keep/verify | Same        | Embedding and seeking surface; lead with one working use.        |
| `/packages/producer`           | Reference · keep/source-verify        | Same        | Full render pipeline and audio-mix API.                          |
| `/packages/shader-transitions` | Reference · keep/source-verify        | Same        | Shader registry and compositor contract.                         |
| `/packages/studio`             | Reference · keep/source-verify        | Same        | Package exports and application architecture.                    |

## Integrations — 5

| Route                    | Type and decision                       | Destination | Reason                                                                  |
| ------------------------ | --------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| `/guides/authentication` | How-to/explanation · keep/verify        | Same        | Distinct boundary across local work, publishing, cloud, and hosted MCP. |
| `/guides/skills`         | How-to/reference · keep/simplify        | Same        | One authoritative human install and agent lifecycle contract.           |
| `/guides/figma`          | Integration guide · keep/split          | Same        | Technical credentials, tokens, commands, motion, and troubleshooting.   |
| `/guides/antigravity`    | Integration guide · keep while verified | Same        | Host-specific setup has an independent prerequisite and lifecycle.      |
| `/guides/copilot-cli`    | Integration guide · keep while verified | Same        | Host-specific setup has an independent prerequisite and lifecycle.      |

## Contributing — 6

| Route                                 | Type and decision                  | Destination | Reason                                                                |
| ------------------------------------- | ---------------------------------- | ----------- | --------------------------------------------------------------------- |
| `/contributing`                       | Maintainer guide · keep/verify     | Same        | Contributor front door and local development contract.                |
| `/contributing/catalog`               | Maintainer tutorial · keep/verify  | Same        | Distinct registry contribution workflow.                              |
| `/contributing/release-channels`      | Maintainer reference · keep/verify | Same        | Distinct release-channel policy.                                      |
| `/contributing/changelog-process`     | Maintainer procedure · keep/verify | Same        | Distinct publishing workflow.                                         |
| `/contributing/testing-local-changes` | Maintainer procedure · keep/verify | Same        | Distinct external-project validation workflow.                        |
| `/community/adopters`                 | Community proof · keep/source      | Same        | Legitimate proof, but it remains deep and sourced from `ADOPTERS.md`. |

## Target developer sequence

1. Start building — choose CLI, SDK, Player, schema, or rendering by first result.
2. Command line — task entry followed by one searchable command reference.
3. SDK and playback — edit, persist, embed, and seek.
4. Composition and animation — schema, timing, adapters, determinism, GSAP.
5. Rendering and deployment — local, managed, AWS, and GCP.
6. Packages — deep reference, not a primary learning sequence.
7. Integrations — authentication, skills, Figma, and verified agent hosts.
8. Contributing — maintainer-only material last.

The Developers header opens `/developers/overview`. The separate
`/developers` journey remains visible under Guides → Start here.
