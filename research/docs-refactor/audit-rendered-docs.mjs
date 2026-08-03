import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "../..");
const inventoryPath = path.join(import.meta.dirname, "current-page-inventory.json");
const outputPath = path.join(import.meta.dirname, "rendered-docs-qa.json");
const markdownPath = path.join(import.meta.dirname, "RENDERED-DOCS-QA.md");
const baseUrl = process.env.DOCS_BASE_URL ?? "http://localhost:3101";
const concurrency = Number(process.env.DOCS_QA_CONCURRENCY ?? 6);
const chromePath = process.env.DOCS_CHROME_PATH;
const generatedDate = new Date().toISOString().slice(0, 10);

const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const routes = [...new Set(inventory.pages.map((page) => `/${page.route}`))].sort();
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({
  headless: true,
  ...(chromePath ? { executablePath: chromePath } : {}),
});
const results = [];

async function auditRoute(context, route, viewportName) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text().slice(0, 500));
  });
  page.on("pageerror", (error) => pageErrors.push(String(error).slice(0, 500)));

  let status = null;
  let navigationError = null;
  try {
    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    status = response?.status() ?? null;
    await page.waitForTimeout(650);
  } catch (error) {
    navigationError = String(error).slice(0, 500);
  }

  const state = navigationError
    ? null
    : await page.evaluate(() => {
        const videos = [...document.querySelectorAll("video")];
        const images = [...document.querySelectorAll("img")];
        const anchors = [...document.querySelectorAll("a")];
        const bodyText = document.body?.innerText ?? "";
        return {
          title: document.title,
          bodyTextLength: bodyText.trim().length,
          looksNotFound: /page not found|404|could not be found/i.test(bodyText.slice(0, 900)),
          overflowPx: Math.max(
            0,
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
          ),
          videoCount: videos.length,
          autoplayAudio: videos.filter(
            (video) => video.autoplay && !video.muted && video.volume > 0,
          ).length,
          videoErrors: videos.filter((video) => video.error).length,
          oversizedPortraitVideos: videos
            .map((video) => {
              const rect = video.getBoundingClientRect();
              return {
                src: video.currentSrc || video.getAttribute("src") || "unknown",
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              };
            })
            .filter((video) => video.height > 620 && video.height > video.width * 1.2),
          imageCount: images.length,
          missingAlt: images.filter((image) => !image.hasAttribute("alt")).length,
          brokenImages: images.filter(
            (image) => image.complete && image.currentSrc && image.naturalWidth === 0,
          ).length,
          emptyLinks: anchors.filter((anchor) => {
            const href = anchor.getAttribute("href");
            return href === "" || href === "#";
          }).length,
        };
      });

  await page.close();
  return {
    route,
    viewport: viewportName,
    status,
    navigationError,
    consoleErrors: [...new Set(consoleErrors)],
    pageErrors: [...new Set(pageErrors)],
    ...state,
  };
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < routes.length) {
      const route = routes[cursor++];
      const result = await auditRoute(context, route, viewport.name);
      results.push(result);
      process.stdout.write(`\r${viewport.name} ${cursor}/${routes.length}`);
    }
  });
  await Promise.all(workers);
  await context.close();
  process.stdout.write("\n");
}

await browser.close();

const findings = results.filter(
  (result) =>
    result.status !== 200 ||
    result.navigationError ||
    result.looksNotFound ||
    result.overflowPx > 1 ||
    result.autoplayAudio > 0 ||
    result.videoErrors > 0 ||
    result.oversizedPortraitVideos.length > 0 ||
    result.missingAlt > 0 ||
    result.brokenImages > 0 ||
    result.emptyLinks > 0 ||
    result.pageErrors.length > 0,
);

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  routeCount: routes.length,
  viewportCount: viewports.length,
  pageChecks: results.length,
  findingCount: findings.length,
  findings,
  results,
};
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

const findingRows = findings.length
  ? findings
      .map(
        (result) =>
          `| ${result.viewport} | ${result.route} | ${result.status ?? "—"} | ${result.overflowPx ?? "—"} | ${result.autoplayAudio ?? "—"} | ${result.oversizedPortraitVideos?.length ?? "—"} | ${result.missingAlt ?? "—"} | ${result.brokenImages ?? "—"} | ${result.navigationError ?? result.pageErrors.join("; ") ?? ""} |`,
      )
      .join("\n")
  : "| — | — | — | — | — | — | — | None |";

const markdown = `# Rendered docs QA\n\nGenerated: ${generatedDate}\n\nBase URL: ${baseUrl}\n\n- Routes: **${routes.length}**\n- Viewports: **${viewports.length}** (1280px desktop and 390px mobile)\n- Rendered page checks: **${results.length}**\n- Findings requiring review: **${findings.length}**\n\n## Findings\n\n| Viewport | Route | HTTP | Overflow px | Autoplay audio | Oversized portrait videos | Missing alt | Broken images | Error |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |\n${findingRows}\n\nThis gate checks route rendering, horizontal overflow, unexpected autoplay audio, video errors, oversized portrait videos, missing image alt attributes, broken images, empty links, and page exceptions. Console errors are retained in the JSON report for diagnosis but are not automatically treated as a page failure because local development tooling and blocked third-party analytics can emit noise.\n`;
fs.writeFileSync(markdownPath, markdown);

console.log(
  JSON.stringify({ root, outputPath, markdownPath, ...report, results: undefined }, null, 2),
);
