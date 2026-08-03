import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const docsRoot = join(root, "docs");
const navigation = JSON.parse(readFileSync(join(docsRoot, "docs.json"), "utf8"));
const generatedDate = new Date().toISOString().slice(0, 10);

function walkNavigation(node, context = {}, rows = []) {
  if (Array.isArray(node)) {
    for (const item of node) walkNavigation(item, context, rows);
    return rows;
  }

  if (!node || typeof node !== "object") return rows;

  const next = {
    tab: node.tab ?? context.tab ?? "",
    group: node.group ?? context.group ?? "",
    section: context.section || (node.group ? node.group : ""),
  };

  if (Array.isArray(node.pages)) {
    for (const page of node.pages) {
      if (typeof page === "string") rows.push({ route: page, ...next });
      else walkNavigation(page, next, rows);
    }
  }

  for (const key of ["tabs", "groups", "anchors", "products", "dropdowns", "versions"]) {
    if (Array.isArray(node[key])) walkNavigation(node[key], next, rows);
  }

  return rows;
}

function listMdx(dir, rows = []) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) listMdx(fullPath, rows);
    else if (name.endsWith(".mdx")) rows.push(fullPath);
  }
  return rows;
}

function resolveRoute(route) {
  const candidates = [join(docsRoot, `${route}.mdx`), join(docsRoot, route, "index.mdx")];
  return candidates.find((candidate) => {
    try {
      return statSync(candidate).isFile();
    } catch {
      return false;
    }
  });
}

function frontmatterValue(source, key) {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? "";
  return frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, "mu"))?.[1]?.trim() ?? "";
}

function countMatches(source, expression) {
  return [...source.matchAll(expression)].length;
}

function uniqueMatches(source, expression, group = 1) {
  return [
    ...new Set([...source.matchAll(expression)].map((match) => match[group]).filter(Boolean)),
  ];
}

function proseWords(source) {
  const cleaned = source
    .replace(/^---\n[\s\S]*?\n---/u, "")
    .replace(/^import .*$/gmu, "")
    .replace(/```[\s\S]*?```/gu, "")
    .replace(/<[^>]+>/gu, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/gu, " ")
    .replace(/[{}_*#>|`~]/gu, " ");

  return cleaned.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu)?.length ?? 0;
}

function inspectPage(navRow, filePath) {
  const source = readFileSync(filePath, "utf8");
  const renderedSource = source.replace(/```[\s\S]*?```/gu, "").replace(/`[^`\n]+`/gu, "");
  const headings = [...source.matchAll(/^(#{2,4})\s+(.+)$/gmu)].map((match) => ({
    level: match[1].length,
    text: match[2].replace(/\{#[^}]+\}/gu, "").trim(),
  }));
  const mediaRefs = uniqueMatches(
    renderedSource,
    /(?:src=|poster=|href=|\]\()["'{(]?([^\s"'})]+\.(?:mp4|webm|mov|gif|png|jpe?g|webp|svg))(?:\?[^\s"'})]*)?/giu,
  );
  const snippetImports = uniqueMatches(renderedSource, /from\s+["']\/snippets\/([^"']+)["']/gu);
  const videoCount = countMatches(renderedSource, /<video\b/gu);
  const imageCount =
    countMatches(renderedSource, /<img\b/gu) +
    countMatches(renderedSource, /!\[[^\]]*\]\([^)]+\)/gu);
  const iframeCount = countMatches(renderedSource, /<iframe\b/gu);
  const diagramCount = countMatches(renderedSource, /<(?:Mermaid|Diagram|Excalidraw)\b/gu);
  const interactiveCount =
    snippetImports.length +
    countMatches(
      renderedSource,
      /<(?:Tabs|Accordion|Slider|ShowcaseWall|StudioOrientation|JourneyFilm)\b/gu,
    );
  const codeFenceCount = countMatches(source, /^```/gmu) / 2;
  const linkCount =
    countMatches(renderedSource, /\[[^\]]+\]\([^)]+\)/gu) +
    countMatches(renderedSource, /href=["'][^"']+["']/gu);
  const proseWordCount = proseWords(source);

  const flags = [];
  if (proseWordCount < 180 && navRow.tab !== "Catalog") flags.push("thin-review");
  if (proseWordCount > 2600) flags.push("long-review");
  if (linkCount >= 8 && proseWordCount < 700) flags.push("router-risk");
  if (
    (navRow.tab === "Studio" ||
      navRow.group === "Workflows" ||
      navRow.group === "Projects and media") &&
    videoCount + imageCount + iframeCount + diagramCount + interactiveCount === 0
  ) {
    flags.push("visual-proof-missing");
  }
  if (videoCount >= 3) flags.push("video-density-review");
  if (countMatches(renderedSource, /<Tabs\b/gu) > 0 && navRow.tab !== "Catalog") {
    flags.push("hidden-choice-review");
  }
  if (countMatches(renderedSource, /<Accordion/gu) > 0) flags.push("accordion-review");

  return {
    ...navRow,
    file: relative(root, filePath),
    title: frontmatterValue(source, "title"),
    description: frontmatterValue(source, "description"),
    proseWords: proseWordCount,
    readingMinutes: Math.max(1, Math.round(proseWordCount / 220)),
    headings,
    headingCount: headings.length,
    linkCount,
    codeFenceCount,
    videoCount,
    imageCount,
    iframeCount,
    diagramCount,
    interactiveCount,
    snippetImports,
    mediaRefs,
    flags,
  };
}

const navRows = walkNavigation(navigation.navigation);
const pages = navRows.map((row) => {
  const filePath = resolveRoute(row.route);
  if (!filePath) return { ...row, missing: true, flags: ["missing-source"] };
  return inspectPage(row, filePath);
});

const navigatedFiles = new Set(pages.filter((page) => page.file).map((page) => page.file));
const orphaned = listMdx(docsRoot)
  .map((filePath) => relative(root, filePath))
  .filter((filePath) => !navigatedFiles.has(filePath));

const groups = [];
for (const tab of navigation.navigation.tabs) {
  for (const group of tab.groups ?? []) {
    const groupPages = pages.filter((page) => page.tab === tab.tab && page.section === group.group);
    groups.push({
      tab: tab.tab,
      group: group.group,
      pages: groupPages.length,
      proseWords: groupPages.reduce((sum, page) => sum + (page.proseWords ?? 0), 0),
      pagesWithVideo: groupPages.filter((page) => page.videoCount > 0).length,
      pagesWithImages: groupPages.filter((page) => page.imageCount > 0).length,
      pagesWithAnyVisual: groupPages.filter(
        (page) =>
          (page.videoCount ?? 0) +
            (page.imageCount ?? 0) +
            (page.iframeCount ?? 0) +
            (page.diagramCount ?? 0) +
            (page.interactiveCount ?? 0) >
          0,
      ).length,
      pagesFlagged: groupPages.filter((page) => page.flags?.length > 0).length,
    });
  }
}

const summary = {
  generatedAt: generatedDate,
  navigatedPages: pages.length,
  mdxFiles: listMdx(docsRoot).length,
  missingSources: pages.filter((page) => page.missing).map((page) => page.route),
  orphaned,
  pagesWithVideo: pages.filter((page) => page.videoCount > 0).length,
  pagesWithImages: pages.filter((page) => page.imageCount > 0).length,
  pagesWithAnyVisual: pages.filter(
    (page) =>
      (page.videoCount ?? 0) +
        (page.imageCount ?? 0) +
        (page.iframeCount ?? 0) +
        (page.diagramCount ?? 0) +
        (page.interactiveCount ?? 0) >
      0,
  ).length,
  pagesWithoutAnyVisual: pages.filter(
    (page) =>
      (page.videoCount ?? 0) +
        (page.imageCount ?? 0) +
        (page.iframeCount ?? 0) +
        (page.diagramCount ?? 0) +
        (page.interactiveCount ?? 0) ===
      0,
  ).length,
  pagesFlagged: pages.filter((page) => page.flags?.length > 0).length,
};

const output = { summary, groups, pages };
writeFileSync(join(here, "current-page-inventory.json"), `${JSON.stringify(output, null, 2)}\n`);

const tableRows = groups
  .map(
    (group) =>
      `| ${group.tab} | ${group.group} | ${group.pages} | ${group.pagesWithAnyVisual} | ${group.pagesFlagged} |`,
  )
  .join("\n");

const flagged = pages
  .filter((page) => page.flags?.length > 0)
  .map(
    (page) =>
      `| /${page.route} | ${page.title || "—"} | ${page.proseWords ?? "—"} | ${page.flags.join(", ")} |`,
  )
  .join("\n");

const markdown = `# Current page inventory\n\nGenerated: ${generatedDate}\n\nThis is a measurement layer, not an editorial verdict. A short page is not automatically bad, and a page without media does not automatically need decoration. Flags identify pages that require human review.\n\n## Summary\n\n- Navigated destinations: **${summary.navigatedPages}**\n- Documentation source files: **${summary.mdxFiles}**\n- Pages with at least one visual or interactive element: **${summary.pagesWithAnyVisual}**\n- Pages with no visual or interactive element: **${summary.pagesWithoutAnyVisual}**\n- Pages with one or more review flags: **${summary.pagesFlagged}**\n- Missing navigation sources: **${summary.missingSources.length}**\n- Source files outside navigation: **${summary.orphaned.length}**\n\n## Coverage by navigation group\n\n| Tab | Group | Pages | With visual/interactive proof | Flagged for review |\n| --- | --- | ---: | ---: | ---: |\n${tableRows}\n\n## Pages requiring human review\n\n| Route | Title | Prose words | Signals |\n| --- | --- | ---: | --- |\n${flagged}\n\nRun \`bun run docs:inventory\` to regenerate the full route-level dataset, including headings, links, code blocks, media references, and imported interactive snippets.\n`;

writeFileSync(join(here, "CURRENT-PAGE-INVENTORY.md"), markdown);
console.log(JSON.stringify(summary, null, 2));
