# Rendered docs QA

Generated: 2026-08-03

Base URL: http://localhost:3101

- Routes: **306**
- Viewports: **2** (1280px desktop and 390px mobile)
- Rendered page checks: **612**
- Findings requiring review: **0**

## Findings

| Viewport | Route | HTTP | Overflow px | Autoplay audio | Oversized portrait videos | Missing alt | Broken images | Error |
| -------- | ----- | ---: | ----------: | -------------: | ------------------------: | ----------: | ------------: | ----- |
| —        | —     |    — |           — |              — |                         — |           — |          None |

This gate checks route rendering, horizontal overflow, unexpected autoplay audio, video errors, oversized portrait videos, missing image alt attributes, broken images, empty links, and page exceptions. Console errors are retained in the JSON report for diagnosis but are not automatically treated as a page failure because local development tooling and blocked third-party analytics can emit noise.
