# Catalog media staging

Date: 2026-08-01

The published Catalog gate currently passes 119 of 138 items. Fourteen of the
nineteen flags are missing CDN objects. Two more are weak posters. The other
three flags are visually reviewed false positives: intentionally static or
subtle lower-third treatments.

All replacement files below are staged locally under `docs/images/catalog`.
Publishing is blocked only because this shell has no usable AWS credentials.
After upload, rerun `node research/docs-refactor/audit-catalog-media.mjs` against
the CDN before treating the Catalog gate as complete.

## Missing published objects

| CDN-relative path                                       |   Bytes | SHA-256                                                            |
| ------------------------------------------------------- | ------: | ------------------------------------------------------------------ |
| `blocks/code-snippet-apple-terminal-basic.png`          |  38,044 | `e7f3796ec25269198bf45a52625fa46c87d1253c0b47e450455ea5c9b23c69ca` |
| `blocks/code-snippet-apple-terminal-clear-dark.png`     |  53,734 | `14274575cf2e4a7bf48641aaedddd7e34e90955a27f276839bc9b17b8d995132` |
| `blocks/code-snippet-apple-terminal-clear-light.png`    |  43,150 | `e62a2b0b2aac5563e0f77b6a34f82d2053d2dcdec339bdbd1829f1520095019f` |
| `blocks/code-snippet-apple-terminal-grass.png`          |  44,396 | `019257f2a20e08de1726dd670882a3d1f413ccde65317db9e55cf323bf195f4f` |
| `blocks/code-snippet-apple-terminal-homebrew.png`       |  49,934 | `71bebe37fd84e527d30bc6a1ca2dba2472f8a941d9eff935a4131d0e5c9c4f16` |
| `blocks/code-snippet-apple-terminal-man-page.png`       |  35,983 | `7f916a19154608561de26d0979f137ed4b08824891ed8d34f8195ac33e816c43` |
| `blocks/code-snippet-apple-terminal-novel.png`          |  59,733 | `61769bf9e6b920a4219b83578a54c92a6f039680cf81cc470d29d4f542742c16` |
| `blocks/code-snippet-apple-terminal-ocean.png`          |  60,188 | `eae498d1c16c455745f9b2a6a9c10493230b4dd7895fb6f87e39ff49286515ac` |
| `blocks/code-snippet-apple-terminal-pro.png`            |  53,896 | `b2b8a4bfe18126826cb8dd9af718896d481351a7b3c4431c9818fbeeddaf9a53` |
| `blocks/code-snippet-apple-terminal-red-sands.png`      |  59,399 | `460e96be57d714b541258e169a5205ea6623b58946e6123d00d28251bb3c5d6c` |
| `blocks/code-snippet-apple-terminal-silver-aerogel.png` |  48,920 | `625c92a889acde97b25de4679658fc2030b3940ab199389acbeb41320cbb5aaa` |
| `blocks/code-snippet-apple-terminal-solid-colors.png`   |  62,051 | `ea7541c1b35ee1bae3225fadad5789ba02b1cf182e9c5595f1016458bde3bebc` |
| `components/morph-text.png`                             | 166,913 | `5ea149ed161c5b1ee5e1706fe791927ee01f56197aab5e20cd496abc4b32644c` |
| `components/texture-mask-text.mp4`                      | 135,676 | `27154ba1dda92a543ed2dbe6782365dcf09eaea0ae89f6d2577ce6b4f4b4f4db` |

`texture-mask-text.mp4` is H.264, 1920×1080, 24 fps, and 5 seconds. Its
matching poster is also staged as `components/texture-mask-text.png` (SHA-256
`0e44aacf5a2f56b53123e714e0be2868cfd8143aa2dcee9d706d8799164dc1ba`).

## Weak published posters

| CDN-relative path                           |   Bytes | SHA-256                                                            |
| ------------------------------------------- | ------: | ------------------------------------------------------------------ |
| `components/caption-editorial-emphasis.png` |  80,012 | `e5781dcf8244e2d39c38dea555e4ee4d5f3876b74cc5db308063241b1531309d` |
| `components/caption-texture.png`            | 152,151 | `bc7d6033f949d956a45dfcf699ac53401383846a0b4a2aeb10b99c0d2d47a179` |

The Texture poster was regenerated from the real registry component after
fixing the preview builder to materialize every manifest file at its installed
target path. No UI or media was mocked.

## Reviewed false positives

- `lower-third-bild`: intentionally static treatment.
- `lt-mask-reveal`: representative poster; low entropy comes from a restrained
  white lower third.
- `lt-stack-bars`: intentionally subtle movement affecting a small part of the
  frame.
