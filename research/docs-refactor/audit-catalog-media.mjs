#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const root = resolve(import.meta.dirname, "../..");
const docsRoot = join(root, "docs");
const outputDir = join(root, "research/docs-refactor/catalog-media-qa");
const indexPath = join(docsRoot, "public/catalog-index.json");
const baseMediaUrl = "https://static.heygen.ai/hyperframes-oss/docs/images/catalog";
const concurrency = 6;

await mkdir(outputDir, { recursive: true });

const items = JSON.parse(await readFile(indexPath, "utf8"));

function catalogSource(item) {
  return join(docsRoot, "catalog", `${item.type}s`, `${item.name}.mdx`);
}

function parseExpected(source) {
  const dimensions = source.match(/\|\s*Dimensions\s*\|\s*(\d+)[×x](\d+)\s*\|/i);
  const duration = source.match(/\|\s*Duration\s*\|\s*([\d.]+)s\s*\|/i);
  return {
    width: dimensions ? Number(dimensions[1]) : null,
    height: dimensions ? Number(dimensions[2]) : null,
    duration: duration ? Number(duration[1]) : null,
  };
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: "follow", ...options });
      if (response.ok) return response;
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await new Promise((done) => setTimeout(done, attempt * 250));
  }
  throw lastError;
}

async function probeVideo(url) {
  const { stdout } = await execFileAsync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "stream=codec_type,codec_name,width,height,duration:format=duration",
      "-of",
      "json",
      url,
    ],
    { maxBuffer: 1024 * 1024, timeout: 30_000 },
  );
  const result = JSON.parse(stdout);
  const stream = result.streams?.find((candidate) => candidate.codec_type === "video");
  return {
    codec: stream?.codec_name ?? null,
    width: Number(stream?.width ?? 0),
    height: Number(stream?.height ?? 0),
    duration: Number(stream?.duration ?? result.format?.duration ?? 0),
  };
}

async function openingMotion(url) {
  const { stdout } = await execFileAsync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      url,
      "-vf",
      "fps=1,scale=160:90:force_original_aspect_ratio=decrease,pad=160:90:(ow-iw)/2:(oh-ih)/2,format=gray",
      "-frames:v",
      "4",
      "-f",
      "rawvideo",
      "pipe:1",
    ],
    { encoding: "buffer", maxBuffer: 160 * 90 * 6, timeout: 45_000 },
  );
  const frameBytes = 160 * 90;
  if (stdout.length < frameBytes * 2) return null;
  const sampleCount = Math.floor(stdout.length / frameBytes);
  let maximumDifference = 0;
  let maximumChangedRatio = 0;
  for (let sample = 1; sample < sampleCount; sample += 1) {
    let difference = 0;
    let changedPixels = 0;
    for (let index = 0; index < frameBytes; index += 1) {
      const delta = Math.abs(stdout[index] - stdout[index + sample * frameBytes]);
      difference += delta;
      if (delta > 8) changedPixels += 1;
    }
    maximumDifference = Math.max(maximumDifference, difference / frameBytes);
    maximumChangedRatio = Math.max(maximumChangedRatio, changedPixels / frameBytes);
  }
  return { meanDelta: maximumDifference, changedRatio: maximumChangedRatio };
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let next = 0;
  async function run() {
    while (next < values.length) {
      const index = next;
      next += 1;
      results[index] = await worker(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, run));
  return results;
}

const results = await mapLimit(items, concurrency, async (item, index) => {
  const source = await readFile(catalogSource(item), "utf8");
  const expected = parseExpected(source);
  const posterUrl = item.preview;
  const videoUrl = `${baseMediaUrl}/${item.type}s/${item.name}.mp4`;
  const issues = [];
  let posterBuffer;
  let poster = null;
  let video = null;
  let motion = null;

  try {
    const response = await fetchWithRetry(posterUrl);
    const contentType = response.headers.get("content-type") ?? "";
    posterBuffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(posterBuffer).metadata();
    const stats = await sharp(posterBuffer).stats();
    poster = {
      status: response.status,
      contentType,
      bytes: posterBuffer.length,
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      entropy: stats.entropy,
    };
    if (!contentType.startsWith("image/"))
      issues.push(`poster MIME is ${contentType || "missing"}`);
    if (!metadata.width || !metadata.height) issues.push("poster has no readable dimensions");
    if (stats.entropy < 0.08)
      issues.push(`poster is nearly flat (entropy ${stats.entropy.toFixed(3)})`);
  } catch (error) {
    issues.push(`poster failed: ${error.message}`);
  }

  try {
    const response = await fetchWithRetry(videoUrl, { method: "HEAD" });
    const contentType = response.headers.get("content-type") ?? "";
    const bytes = Number(response.headers.get("content-length") ?? 0);
    video = { status: response.status, contentType, bytes, ...(await probeVideo(videoUrl)) };
    if (contentType !== "video/mp4") issues.push(`video MIME is ${contentType || "missing"}`);
    if (video.codec !== "h264") issues.push(`video codec is ${video.codec || "missing"}`);
    if (
      expected.width &&
      expected.height &&
      Math.abs(video.width / video.height - expected.width / expected.height) > 0.01
    )
      issues.push(
        `video aspect ${video.width}×${video.height} does not match documented ${expected.width}×${expected.height}`,
      );
    if (expected.duration && Math.abs(video.duration - expected.duration) > 0.15)
      issues.push(
        `video duration ${video.duration.toFixed(2)}s does not match documented ${expected.duration}s`,
      );
    motion = await openingMotion(videoUrl);
    if (motion === null) issues.push("video has fewer than two one-second samples");
    else if (motion.meanDelta < 0.35 && motion.changedRatio < 0.005)
      issues.push(
        `opening changes very little in the first 3s (mean delta ${motion.meanDelta.toFixed(2)}, changed pixels ${(motion.changedRatio * 100).toFixed(2)}%)`,
      );
  } catch (error) {
    issues.push(`video failed: ${error.message}`);
  }

  process.stdout.write(
    `\r${String(index + 1).padStart(3)}/${items.length} ${item.name.padEnd(42)}`,
  );
  return {
    name: item.name,
    type: item.type,
    href: item.href,
    expected,
    posterUrl,
    videoUrl,
    poster,
    video,
    motion,
    issues,
    posterBuffer,
  };
});

process.stdout.write("\n");

const failures = results.filter((item) => item.issues.length > 0);
const reportResults = results.map(({ posterBuffer: _posterBuffer, ...item }) => item);
await writeFile(
  join(outputDir, "report.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      total: results.length,
      passed: results.length - failures.length,
      flagged: failures.length,
      items: reportResults,
    },
    null,
    2,
  )}\n`,
);

const rows = failures.length
  ? failures
      .map(
        (item) =>
          `| [${item.name}](${item.href}) | ${item.type} | ${item.issues.join("; ").replaceAll("|", "\\|")} |`,
      )
      .join("\n")
  : "| — | — | No issues found |";

await writeFile(
  join(outputDir, "REPORT.md"),
  `# Catalog media QA\n\nGenerated: ${new Date().toISOString()}\n\n- Items: **${results.length}**\n- Passed: **${results.length - failures.length}**\n- Flagged for review: **${failures.length}**\n\nThe automated gate checks the published poster and MP4, MIME types, H.264 codec, documented aspect ratio and duration, poster entropy, and visible change during the first three seconds. Preview resolution may be lower than the installed composition when the aspect ratio remains correct. A flag is a review signal, not automatically a broken Catalog item.\n\n## Flagged items\n\n| Item | Type | Signal |\n| --- | --- | --- |\n${rows}\n`,
);

const contactItems = results.filter((item) => item.posterBuffer);
const columns = 4;
const rowsPerSheet = 5;
const tileWidth = 320;
const imageHeight = 180;
const labelHeight = 28;
const perSheet = columns * rowsPerSheet;

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

for (let offset = 0; offset < contactItems.length; offset += perSheet) {
  const page = contactItems.slice(offset, offset + perSheet);
  const tiles = await Promise.all(
    page.map(async (item) => {
      const image = await sharp(item.posterBuffer)
        .resize(tileWidth, imageHeight, { fit: "contain", background: "#111111" })
        .jpeg({ quality: 80 })
        .toBuffer();
      const label = Buffer.from(
        `<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111"/><text x="10" y="19" fill="#fff" font-family="Arial, sans-serif" font-size="13">${escapeXml(item.name)}</text></svg>`,
      );
      return sharp({
        create: {
          width: tileWidth,
          height: imageHeight + labelHeight,
          channels: 3,
          background: "#111111",
        },
      })
        .composite([
          { input: image, top: 0, left: 0 },
          { input: label, top: imageHeight, left: 0 },
        ])
        .jpeg({ quality: 82 })
        .toBuffer();
    }),
  );
  const sheetRows = Math.ceil(page.length / columns);
  const sheet = sharp({
    create: {
      width: columns * tileWidth,
      height: sheetRows * (imageHeight + labelHeight),
      channels: 3,
      background: "#090909",
    },
  });
  await sheet
    .composite(
      tiles.map((input, index) => ({
        input,
        left: (index % columns) * tileWidth,
        top: Math.floor(index / columns) * (imageHeight + labelHeight),
      })),
    )
    .jpeg({ quality: 82 })
    .toFile(join(outputDir, `contact-${String(offset / perSheet + 1).padStart(2, "0")}.jpg`));
}

console.log(
  `Catalog QA: ${results.length - failures.length}/${results.length} passed; ${failures.length} flagged.`,
);
console.log(`Report: ${join(outputDir, "REPORT.md")}`);
