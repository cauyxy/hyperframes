# Catalog media QA

Generated: 2026-08-02T05:13:33.669Z

- Items: **138**
- Passed: **119**
- Flagged for review: **19**

The automated gate checks the published poster and MP4, MIME types, H.264 codec, documented aspect ratio and duration, poster entropy, and visible change during the first three seconds. Preview resolution may be lower than the installed composition when the aspect ratio remains correct. A flag is a review signal, not automatically a broken Catalog item.

## Flagged items

| Item                                                                                                     | Type      | Signal                                                                              |
| -------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| [caption-editorial-emphasis](/catalog/components/caption-editorial-emphasis)                             | component | poster is nearly flat (entropy 0.064)                                               |
| [caption-texture](/catalog/components/caption-texture)                                                   | component | poster is nearly flat (entropy 0.000)                                               |
| [code-snippet-apple-terminal-basic](/catalog/blocks/code-snippet-apple-terminal-basic)                   | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-clear-dark](/catalog/blocks/code-snippet-apple-terminal-clear-dark)         | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-clear-light](/catalog/blocks/code-snippet-apple-terminal-clear-light)       | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-grass](/catalog/blocks/code-snippet-apple-terminal-grass)                   | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-homebrew](/catalog/blocks/code-snippet-apple-terminal-homebrew)             | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-man-page](/catalog/blocks/code-snippet-apple-terminal-man-page)             | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-novel](/catalog/blocks/code-snippet-apple-terminal-novel)                   | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-ocean](/catalog/blocks/code-snippet-apple-terminal-ocean)                   | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-pro](/catalog/blocks/code-snippet-apple-terminal-pro)                       | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-red-sands](/catalog/blocks/code-snippet-apple-terminal-red-sands)           | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-silver-aerogel](/catalog/blocks/code-snippet-apple-terminal-silver-aerogel) | block     | poster failed: 403                                                                  |
| [code-snippet-apple-terminal-solid-colors](/catalog/blocks/code-snippet-apple-terminal-solid-colors)     | block     | poster failed: 403                                                                  |
| [lower-third-bild](/catalog/blocks/lower-third-bild)                                                     | block     | opening changes very little in the first 3s (mean delta 0.00, changed pixels 0.00%) |
| [lt-mask-reveal](/catalog/blocks/lt-mask-reveal)                                                         | block     | poster is nearly flat (entropy 0.072)                                               |
| [lt-stack-bars](/catalog/blocks/lt-stack-bars)                                                           | block     | opening changes very little in the first 3s (mean delta 0.19, changed pixels 0.40%) |
| [morph-text](/catalog/components/morph-text)                                                             | component | poster failed: 403                                                                  |
| [texture-mask-text](/catalog/components/texture-mask-text)                                               | component | video failed: 403                                                                   |
