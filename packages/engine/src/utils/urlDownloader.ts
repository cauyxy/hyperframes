import {
  closeSync,
  createReadStream,
  createWriteStream,
  existsSync,
  fsyncSync,
  linkSync,
  mkdtempSync,
  mkdirSync,
  lstatSync,
  openSync,
  rmSync,
  statSync,
  unlinkSync,
} from "fs";
import { createHash } from "crypto";
import { BlockList, isIP } from "node:net";
import { dirname, extname, join } from "path";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";

const inFlightDownloads = new Map<string, Promise<string>>();
const signalScopes = new WeakMap<AbortSignal, number>();
let nextSignalScope = 1;

function signalScopeKey(signal: AbortSignal | undefined): string {
  if (!signal) return "none";
  let scope = signalScopes.get(signal);
  if (scope === undefined) {
    scope = nextSignalScope;
    nextSignalScope += 1;
    signalScopes.set(signal, scope);
  }
  return String(scope);
}

export type UrlDownloadFailureKind =
  | "cancelled"
  | "timeout"
  | "http_not_found"
  | "http_rejected"
  | "http_transient"
  | "network"
  | "empty_body"
  | "range_protocol"
  | "length_mismatch"
  | "hash_mismatch"
  | "invalid_payload"
  | "filesystem";

export type UrlDownloadTelemetryOutcome =
  | "attempt_failed"
  | "cache_hit"
  | "published"
  | "race_reused"
  | "retrying";

export interface UrlDownloadTelemetry {
  urlFingerprint: string;
  initialHost?: string;
  finalHost?: string;
  attempt: number;
  outcome: UrlDownloadTelemetryOutcome;
  status?: number;
  expectedBytes?: number;
  receivedBytes?: number;
  rangeDisposition?: "none" | "malformed_206" | "unsolicited_206" | "content_range_on_200";
  etagFingerprint?: string;
  etagWeak?: boolean;
  localSize?: number;
  localSha256?: string;
  failureKind?: UrlDownloadFailureKind;
}

export interface UrlDownloadOptions {
  /** Require a recognized media container/file signature. Content-Type remains advisory. */
  expectedContent?: "media" | "opaque";
  /** Optional strong checksum supplied by a trusted caller. */
  expectedSha256?: string;
  onTelemetry?: (event: UrlDownloadTelemetry) => void;
}

export interface SafeDownloadUrlIdentity {
  urlFingerprint: string;
  host?: string;
}

/** Query-free, non-reversible URL identity suitable for logs and metrics. */
export function safeDownloadUrlIdentity(url: string): SafeDownloadUrlIdentity {
  let canonical = url;
  let host: string | undefined;
  try {
    const parsed = new URL(url);
    canonical = `${parsed.origin}${parsed.pathname}`;
    host = parsed.hostname.toLowerCase();
  } catch {
    // Invalid input is still fingerprinted; never echo it in diagnostics.
  }
  return {
    urlFingerprint: createHash("sha256").update(canonical).digest("hex"),
    host,
  };
}

/** Default safe structured sink for engine media call sites without a logger. */
export function writeUrlDownloadTelemetry(event: UrlDownloadTelemetry): void {
  try {
    process.stderr.write(`[hyperframes:download] ${JSON.stringify(event)}\n`);
  } catch {
    // Observability must never change download correctness.
  }
}

export class UrlDownloadError extends Error {
  constructor(
    readonly kind: UrlDownloadFailureKind,
    readonly retryable: boolean,
    message: string,
    readonly status?: number,
    readonly telemetry?: Partial<UrlDownloadTelemetry>,
  ) {
    super(message);
    this.name = "UrlDownloadError";
  }
}

function classifyHttpFailure(status: number): UrlDownloadError {
  // Response.statusText is remote-controlled and some CDNs/proxies echo the
  // signed request URL into it. The numeric status is sufficient and bounded.
  const message = `HTTP ${status}`;
  if (status === 404 || status === 410) {
    return new UrlDownloadError("http_not_found", false, message, status);
  }
  if (status === 408 || status === 429 || status >= 500) {
    return new UrlDownloadError("http_transient", true, message, status);
  }
  return new UrlDownloadError("http_rejected", false, message, status);
}

function classifyDownloadFailure(error: unknown): UrlDownloadError {
  if (error instanceof UrlDownloadError) return error;
  let current: unknown = error;
  // Undici often wraps a mid-body socket failure as `TypeError: terminated`
  // with the actionable `UND_ERR_*` code on `cause`.
  for (let depth = 0; current && depth < 4; depth += 1) {
    if (isRetryableNetworkCause(current)) {
      return new UrlDownloadError(
        "network",
        true,
        "Download failed due to a transient network error",
      );
    }
    current =
      typeof current === "object" && current !== null && "cause" in current
        ? current.cause
        : undefined;
  }
  return new UrlDownloadError(
    "filesystem",
    false,
    "Download failed while writing the local artifact",
  );
}

const RETRYABLE_NETWORK_CODES = new Set(["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"]);

function isRetryableNetworkCause(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code =
    typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
      ? error.code
      : "";
  return (
    RETRYABLE_NETWORK_CODES.has(code) ||
    code.startsWith("UND_ERR_") ||
    /fetch failed|network|socket|connection reset|terminated/i.test(message)
  );
}

const NON_PUBLIC_IPV4_ADDRESSES = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  NON_PUBLIC_IPV4_ADDRESSES.addSubnet(network, prefix, "ipv4");
}
const NON_PUBLIC_IPV6_ADDRESSES = new BlockList();
for (const [network, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["::ffff:0:0", 96],
  ["fc00::", 7],
  ["fe80::", 10],
  ["fec0::", 10],
  ["ff00::", 8],
  ["2001:db8::", 32],
] as const) {
  NON_PUBLIC_IPV6_ADDRESSES.addSubnet(network, prefix, "ipv6");
}

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost") return true;
  const addressType = isIP(h);
  if (addressType === 0) return false;
  return addressType === 4
    ? NON_PUBLIC_IPV4_ADDRESSES.check(h, "ipv4")
    : NON_PUBLIC_IPV6_ADDRESSES.check(h, "ipv6");
}

/**
 * Validate that a URL is safe to fetch on behalf of customer-supplied
 * compositions. Throws if the URL is non-HTTPS or targets a private/reserved
 * address range (SSRF guard).
 */
export function assertPublicHttpsUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("[URLDownloader] Invalid URL");
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`[URLDownloader] Only HTTPS URLs are permitted in compositions`);
  }
  if (isBlockedHost(parsed.hostname)) {
    throw new Error("[URLDownloader] URL targets a private/reserved address and is not permitted");
  }
}

function getFilenameFromUrl(url: string, validationScope: string): string {
  const physicalIdentity = validationScope === "opaque\0" ? url : `${url}\0${validationScope}`;
  const hash = createHash("md5").update(physicalIdentity).digest("hex").slice(0, 12);
  const urlObj = new URL(url);
  const ext = extname(urlObj.pathname) || ".mp4";
  return `download_${hash}${ext}`;
}

function hasCompleteFile(path: string): boolean {
  if (!existsSync(path)) return false;
  const entry = lstatSync(path);
  if (entry.isFile() && entry.size > 0) return true;
  // Old versions could leave an empty file behind. Never trust that stale
  // cache entry—or a symlink/special entry planted at the final path.
  rmSync(path, { recursive: entry.isDirectory(), force: true });
  return false;
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 5;

function assertAllowedDownloadUrl(url: string, redirect: boolean): void {
  try {
    assertPublicHttpsUrl(url);
  } catch {
    throw new UrlDownloadError(
      "http_rejected",
      false,
      redirect ? "Download redirect target is not permitted" : "Download URL is not permitted",
    );
  }
}

async function cancelResponseBody(response: Response): Promise<void> {
  try {
    await response.body?.cancel();
  } catch {
    // Redirect validation remains authoritative if teardown also fails.
  }
}

function resolveRedirectUrl(response: Response, currentUrl: string, redirects: number): string {
  if (redirects >= MAX_REDIRECTS) {
    throw new UrlDownloadError("http_rejected", false, "Download exceeded redirect limit");
  }
  const location = response.headers.get("location");
  if (!location) {
    throw new UrlDownloadError(
      "http_rejected",
      false,
      "Download redirect omitted a Location header",
    );
  }
  try {
    return new URL(location, currentUrl).toString();
  } catch {
    throw new UrlDownloadError("http_rejected", false, "Download redirect Location is invalid");
  }
}

async function fetchWithValidatedRedirects(
  initialUrl: string,
  controller: AbortController,
): Promise<{ response: Response; finalUrl: string }> {
  let currentUrl = initialUrl;
  for (let redirects = 0; ; redirects += 1) {
    assertAllowedDownloadUrl(currentUrl, redirects > 0);

    // lgtm[js/file-access-to-http] — every redirect hop is fetched manually
    // only after the HTTPS/private-host guard above; automatic redirect
    // following is disabled so an allowed host cannot bounce into IMDS.
    const response = await fetch(currentUrl, {
      signal: controller.signal,
      redirect: "manual",
      headers: { "accept-encoding": "identity" },
    });
    if (!REDIRECT_STATUSES.has(response.status)) return { response, finalUrl: currentUrl };

    await cancelResponseBody(response);
    currentUrl = resolveRedirectUrl(response, currentUrl, redirects);
  }
}

interface PartialIntegrity {
  finalHost?: string;
  status: number;
  expectedBytes?: number;
  receivedBytes: number;
  rangeDisposition: UrlDownloadTelemetry["rangeDisposition"];
  etagFingerprint?: string;
  etagWeak?: boolean;
  localSize: number;
  localSha256: string;
}

function parseDeclaredLength(response: Response): number | undefined {
  const raw = response.headers.get("content-length");
  if (raw === null) return undefined;
  if (!/^\d+$/.test(raw.trim())) {
    throw new UrlDownloadError(
      "length_mismatch",
      true,
      "Download response Content-Length is malformed",
      response.status,
      { status: response.status },
    );
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new UrlDownloadError(
      "length_mismatch",
      true,
      "Download response Content-Length is out of range",
      response.status,
      { status: response.status },
    );
  }
  return value;
}

// Keep every Content-Range invariant in one parser so malformed and unsolicited
// partial responses cannot drift into different retry classifications.
// fallow-ignore-next-line complexity
function classifyRangeDisposition(response: Response): UrlDownloadTelemetry["rangeDisposition"] {
  const contentRange = response.headers.get("content-range");
  if (response.status === 206) {
    const match = contentRange?.match(/^bytes (\d+)-(\d+)\/(\d+|\*)$/i);
    if (!match) return "malformed_206";
    const start = Number(match[1]);
    const end = Number(match[2]);
    const total = match[3] === "*" ? undefined : Number(match[3]);
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      end < start ||
      (total !== undefined && (!Number.isSafeInteger(total) || total <= end))
    ) {
      return "malformed_206";
    }
    return "unsolicited_206";
  }
  return response.status === 200 && contentRange !== null ? "content_range_on_200" : "none";
}

function looksLikeHtmlErrorBody(prefix: Buffer): boolean {
  const text = prefix
    .toString("utf8")
    .replace(/^\uFEFF?\s*/, "")
    .toLowerCase();
  return (
    text.startsWith("<!doctype html") ||
    text.startsWith("<html") ||
    text.startsWith("<head") ||
    text.startsWith("<body") ||
    text.startsWith("<error") ||
    text.startsWith('{"error"') ||
    (/^<\?xml\b/.test(text) && /<(?:html|error)\b/.test(text))
  );
}

// This intentionally flat, bounded allowlist makes each accepted media family
// auditable; splitting it across dispatch layers would obscure signature coverage.
// fallow-ignore-next-line complexity
function hasRecognizedMediaSignature(prefix: Buffer, localSize: number): boolean {
  if (prefix.length < 2 || localSize < 2) return false;
  const ascii = (start: number, end: number): string => prefix.toString("ascii", start, end);
  if (
    prefix.length >= 8 &&
    prefix.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return true;
  }
  if (prefix[0] === 0xff && prefix[1] === 0xd8 && prefix[2] === 0xff) return true;
  if (prefix.length >= 6 && (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a")) return true;
  if (prefix.length >= 12 && ascii(0, 4) === "RIFF") {
    const kind = ascii(8, 12);
    if (kind === "WEBP" || kind === "WAVE" || kind === "AVI ") return true;
  }
  if (prefix.length >= 4) {
    const firstFour = ascii(0, 4);
    if (firstFour === "OggS" || firstFour === "fLaC") return true;
    if (prefix.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return true;
    if (prefix.subarray(0, 4).equals(Buffer.from([0x76, 0x2f, 0x31, 0x01]))) return true;
    if (prefix.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0xba]))) return true;
  }
  if (ascii(0, 3) === "ID3") return prefix.length >= 10 && localSize >= 10;
  if (prefix[0] === 0xff && (prefix[1]! & 0xe0) === 0xe0) return true;
  if (ascii(0, 2) === "BM") return prefix.length >= 14;
  if (
    prefix.length >= 4 &&
    (prefix.subarray(0, 4).equals(Buffer.from([0x49, 0x49, 0x2a, 0x00])) ||
      prefix.subarray(0, 4).equals(Buffer.from([0x4d, 0x4d, 0x00, 0x2a])) ||
      prefix.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0x00])))
  ) {
    return true;
  }
  if (
    prefix.length >= 12 &&
    prefix
      .subarray(0, 12)
      .equals(Buffer.from([0, 0, 0, 12, 0x4a, 0x58, 0x4c, 0x20, 0x0d, 0x0a, 0x87, 0x0a]))
  ) {
    return true;
  }
  if (prefix[0] === 0xff && prefix[1] === 0x0a) return true;
  const hasTransportStreamSync = (offset: number, stride: number): boolean =>
    prefix.length > offset + stride * 2 &&
    prefix[offset] === 0x47 &&
    prefix[offset + stride] === 0x47 &&
    prefix[offset + stride * 2] === 0x47;
  if (hasTransportStreamSync(0, 188) || hasTransportStreamSync(4, 192)) return true;
  const mxfHeaderPartitionPrefix = Buffer.from([
    0x06, 0x0e, 0x2b, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0d, 0x01, 0x02, 0x01, 0x01, 0x02,
  ]);
  if (
    prefix.length >= 16 &&
    prefix.subarray(0, mxfHeaderPartitionPrefix.length).equals(mxfHeaderPartitionPrefix) &&
    prefix[15] === 0x00
  ) {
    return true;
  }
  if (prefix.length >= 16 && ascii(4, 8) === "ftyp") {
    const boxSize = prefix.readUInt32BE(0);
    return boxSize >= 16 && boxSize <= localSize && /^[\x20-\x7e]{4}$/.test(ascii(8, 12));
  }
  const text = prefix.toString("utf8").replace(/^\uFEFF?\s*/, "");
  return /^<svg(?:\s|>)/i.test(text) || (/^<\?xml\b/i.test(text) && /<svg(?:\s|>)/i.test(text));
}

function expectedResponseSha256(response: Response, options: UrlDownloadOptions): string | null {
  if (options.expectedSha256) return options.expectedSha256.trim().toLowerCase();
  const amazonChecksum = response.headers.get("x-amz-checksum-sha256")?.trim();
  const amazonChecksumType = response.headers.get("x-amz-checksum-type")?.trim().toUpperCase();
  if (amazonChecksum && amazonChecksumType !== "COMPOSITE") return `base64:${amazonChecksum}`;
  const digest = response.headers.get("digest");
  const sha256Digest = digest?.match(/(?:^|,)\s*sha-256=:?([^,:\s]+):?/i)?.[1];
  return sha256Digest ? `base64:${sha256Digest}` : null;
}

// Response protocol, streamed byte accounting, hashes, and payload validation
// share one lifecycle so no validation can happen after publication.
// fallow-ignore-next-line complexity
async function fetchToPartial(
  url: string,
  partialPath: string,
  controller: AbortController,
  options: UrlDownloadOptions,
): Promise<PartialIntegrity> {
  const { response, finalUrl } = await fetchWithValidatedRedirects(url, controller);
  const finalIdentity = safeDownloadUrlIdentity(finalUrl);
  const rangeDisposition = classifyRangeDisposition(response);
  if (rangeDisposition !== "none") {
    await cancelResponseBody(response);
    throw new UrlDownloadError(
      "range_protocol",
      true,
      rangeDisposition === "malformed_206"
        ? "Download received a malformed unsolicited partial response"
        : "Download received an unsolicited partial response",
      response.status,
      {
        finalHost: finalIdentity.host,
        status: response.status,
        rangeDisposition,
      },
    );
  }
  if (!response.ok) {
    // Do not leave a streaming error response holding an Undici connection
    // while the bounded retry starts.
    try {
      await response.body?.cancel();
    } catch {
      // The HTTP status remains the useful failure if teardown also fails.
    }
    const classified = classifyHttpFailure(response.status);
    throw new UrlDownloadError(
      classified.kind,
      classified.retryable,
      classified.message,
      classified.status,
      { finalHost: finalIdentity.host, status: response.status, rangeDisposition },
    );
  }
  if (!response.body) {
    throw new UrlDownloadError(
      "empty_body",
      true,
      "Download response body is empty",
      response.status,
      {
        finalHost: finalIdentity.host,
        status: response.status,
      },
    );
  }

  let declaredLength: number | undefined;
  try {
    declaredLength = parseDeclaredLength(response);
  } catch (error) {
    await cancelResponseBody(response);
    if (error instanceof UrlDownloadError) {
      throw new UrlDownloadError(error.kind, error.retryable, error.message, error.status, {
        ...error.telemetry,
        finalHost: finalIdentity.host,
        rangeDisposition,
      });
    }
    throw error;
  }
  const contentEncoding = response.headers.get("content-encoding")?.trim().toLowerCase();
  const expectedBytes =
    !contentEncoding || contentEncoding === "identity" ? declaredLength : undefined;

  let receivedBytes = 0;
  const sha256 = createHash("sha256");
  const md5 = createHash("md5");
  const prefixChunks: Buffer[] = [];
  let prefixBytes = 0;
  const inspector = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      receivedBytes += bytes.length;
      sha256.update(bytes);
      md5.update(bytes);
      if (prefixBytes < 1024) {
        const remaining = 1024 - prefixBytes;
        const sample = bytes.subarray(0, remaining);
        prefixChunks.push(sample);
        prefixBytes += sample.length;
      }
      callback(null, bytes);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const readableStream = Readable.fromWeb(response.body as any);
  const fileStream = createWriteStream(partialPath, { flags: "wx" });
  await pipeline(readableStream, inspector, fileStream);
  const localSize = statSync(partialPath).size;
  const sha256Bytes = sha256.digest();
  const localSha256 = sha256Bytes.toString("hex");
  const md5Base64 = md5.digest("base64");
  const telemetry = {
    finalHost: finalIdentity.host,
    status: response.status,
    expectedBytes,
    receivedBytes,
    rangeDisposition,
    localSize,
    localSha256,
  } satisfies Partial<UrlDownloadTelemetry>;
  if (receivedBytes === 0 || localSize === 0) {
    throw new UrlDownloadError(
      "empty_body",
      true,
      "Download response body contained zero bytes",
      response.status,
      telemetry,
    );
  }
  if (
    localSize !== receivedBytes ||
    (expectedBytes !== undefined && receivedBytes !== expectedBytes)
  ) {
    throw new UrlDownloadError(
      "length_mismatch",
      true,
      "Download response byte count did not match its declared length",
      response.status,
      telemetry,
    );
  }
  const prefix = Buffer.concat(prefixChunks);
  if (
    options.expectedContent === "media" &&
    (looksLikeHtmlErrorBody(prefix) || !hasRecognizedMediaSignature(prefix, localSize))
  ) {
    throw new UrlDownloadError(
      "invalid_payload",
      false,
      "Download returned a payload without a recognized media signature",
      response.status,
      telemetry,
    );
  }

  const expectedSha256 = expectedResponseSha256(response, options);
  const checksumMatches =
    expectedSha256 === null ||
    (expectedSha256.startsWith("base64:")
      ? sha256Bytes.toString("base64") === expectedSha256.slice("base64:".length)
      : /^[a-f0-9]{64}$/.test(expectedSha256) && localSha256 === expectedSha256);
  const contentMd5 = response.headers.get("content-md5")?.trim();
  if (!checksumMatches || (contentMd5 && md5Base64 !== contentMd5)) {
    throw new UrlDownloadError(
      "hash_mismatch",
      true,
      "Download payload checksum did not match",
      response.status,
      telemetry,
    );
  }

  const etag = response.headers.get("etag")?.trim();
  return {
    finalHost: finalIdentity.host,
    status: response.status,
    expectedBytes,
    receivedBytes,
    rangeDisposition,
    etagFingerprint: etag ? createHash("sha256").update(etag).digest("hex") : undefined,
    etagWeak: etag ? /^W\//i.test(etag) : undefined,
    localSize,
    localSha256,
  };
}

function syncAndPublishPartial(
  partialPath: string,
  localPath: string,
): Extract<UrlDownloadTelemetryOutcome, "published" | "race_reused"> {
  // Windows rejects fsync on a read-only handle (EPERM); the partial is ours
  // and writable, so r+ preserves the same flush semantics cross-platform.
  const fd = openSync(partialPath, "r+");
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }

  // A hard-link publish is atomic and no-clobber: unlike rename(), it cannot
  // replace a path that another successful caller has already returned.
  try {
    linkSync(partialPath, localPath);
    unlinkSync(partialPath);
    return "published";
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "EEXIST" || !hasCompleteFile(localPath)) throw error;
    return "race_reused";
  }
}

function emitDownloadTelemetry(options: UrlDownloadOptions, event: UrlDownloadTelemetry): void {
  try {
    options.onTelemetry?.(event);
  } catch {
    // Metrics/logging callbacks cannot affect publication or retry policy.
  }
}

// Attempt-scoped cancellation, cleanup, publication, and telemetry deliberately
// remain under one try/finally so every exit removes the unique partial directory.
// fallow-ignore-next-line complexity
async function runDownloadAttempt(
  url: string,
  localPath: string,
  timeoutMs: number,
  attempt: number,
  options: UrlDownloadOptions,
  signal?: AbortSignal,
): Promise<string> {
  // A private, unguessable directory prevents symlink planting and keeps the
  // partial on the destination filesystem so the final rename stays atomic.
  const attemptDir = mkdtempSync(join(dirname(localPath), ".hf-download-"));
  const partialPath = join(attemptDir, "payload");
  const controller = new AbortController();
  let timedOut = false;
  let callerAborted = signal?.aborted ?? false;
  const onCallerAbort = (): void => {
    callerAborted = true;
    controller.abort();
  };
  signal?.addEventListener("abort", onCallerAbort, { once: true });
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const identity = safeDownloadUrlIdentity(url);

  try {
    if (callerAborted) {
      throw new UrlDownloadError("cancelled", false, "Download cancelled");
    }
    const integrity = await fetchToPartial(url, partialPath, controller, options);
    let outcome = syncAndPublishPartial(partialPath, localPath);
    let publishedIntegrity = integrity;
    if (outcome === "race_reused") {
      const inspection = await inspectExistingFile(localPath);
      publishedIntegrity = {
        ...integrity,
        localSize: inspection.localSize,
        localSha256: inspection.localSha256,
      };
      if (!localInspectionMatchesOptions(inspection, options)) {
        const invalidMedia =
          options.expectedContent === "media" &&
          (looksLikeHtmlErrorBody(inspection.prefix) ||
            !hasRecognizedMediaSignature(inspection.prefix, inspection.localSize));
        throw new UrlDownloadError(
          invalidMedia ? "invalid_payload" : "hash_mismatch",
          !invalidMedia,
          invalidMedia
            ? "Concurrent download published a payload without a recognized media signature"
            : "Concurrent download payload checksum did not match",
          integrity.status,
          publishedIntegrity,
        );
      }
    }
    emitDownloadTelemetry(options, {
      urlFingerprint: identity.urlFingerprint,
      initialHost: identity.host,
      attempt,
      outcome,
      ...publishedIntegrity,
    });
    return localPath;
  } catch (error) {
    if (callerAborted) {
      const classified = new UrlDownloadError("cancelled", false, "Download cancelled");
      emitDownloadTelemetry(options, {
        urlFingerprint: identity.urlFingerprint,
        initialHost: identity.host,
        attempt,
        outcome: "attempt_failed",
        failureKind: classified.kind,
      });
      throw classified;
    }
    if (timedOut) {
      const classified = new UrlDownloadError(
        "timeout",
        true,
        `Download timeout after ${timeoutMs / 1000}s`,
      );
      emitDownloadTelemetry(options, {
        urlFingerprint: identity.urlFingerprint,
        initialHost: identity.host,
        attempt,
        outcome: "attempt_failed",
        failureKind: classified.kind,
      });
      throw classified;
    }
    const classified = classifyDownloadFailure(error);
    emitDownloadTelemetry(options, {
      urlFingerprint: identity.urlFingerprint,
      initialHost: identity.host,
      attempt,
      outcome: "attempt_failed",
      failureKind: classified.kind,
      ...classified.telemetry,
    });
    throw classified;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", onCallerAbort);
    controller.abort();
    rmSync(attemptDir, { recursive: true, force: true });
  }
}

async function downloadWithRetry(
  url: string,
  localPath: string,
  timeoutMs: number,
  signal?: AbortSignal,
  onTransientRetry?: (error: UrlDownloadError) => void,
  options: UrlDownloadOptions = {},
): Promise<string> {
  const maxTransientRetries = 1;
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await runDownloadAttempt(url, localPath, timeoutMs, attempt + 1, options, signal);
    } catch (error) {
      const classified = classifyDownloadFailure(error);
      if (!classified.retryable || attempt >= maxTransientRetries) throw classified;
      onTransientRetry?.(classified);
      const identity = safeDownloadUrlIdentity(url);
      emitDownloadTelemetry(options, {
        urlFingerprint: identity.urlFingerprint,
        initialHost: identity.host,
        attempt: attempt + 1,
        outcome: "retrying",
        failureKind: classified.kind,
        ...classified.telemetry,
      });
    }
  }
}

async function inspectExistingFile(path: string): Promise<{
  localSize: number;
  localSha256: string;
  prefix: Buffer;
}> {
  const sha256 = createHash("sha256");
  const prefixChunks: Buffer[] = [];
  let prefixBytes = 0;
  let localSize = 0;
  for await (const chunk of createReadStream(path)) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    localSize += bytes.length;
    sha256.update(bytes);
    if (prefixBytes < 1024) {
      const sample = bytes.subarray(0, 1024 - prefixBytes);
      prefixChunks.push(sample);
      prefixBytes += sample.length;
    }
  }
  return {
    localSize,
    localSha256: sha256.digest("hex"),
    prefix: Buffer.concat(prefixChunks),
  };
}

function localInspectionMatchesOptions(
  inspection: { localSize: number; localSha256: string; prefix: Buffer },
  options: UrlDownloadOptions,
): boolean {
  const expectedSha256 = options.expectedSha256?.trim().toLowerCase();
  return (
    inspection.localSize > 0 &&
    !(
      options.expectedContent === "media" &&
      (looksLikeHtmlErrorBody(inspection.prefix) ||
        !hasRecognizedMediaSignature(inspection.prefix, inspection.localSize))
    ) &&
    (!expectedSha256 || inspection.localSha256 === expectedSha256)
  );
}

export async function downloadToTemp(
  url: string,
  destDir: string,
  timeoutMs: number = 300000,
  signal?: AbortSignal,
  onTransientRetry?: (error: UrlDownloadError) => void,
  options: UrlDownloadOptions = {},
): Promise<string> {
  // Reject non-HTTPS URLs and private/reserved address ranges before
  // touching the cache or filesystem — customer-supplied compositions must
  // not be able to trigger outbound fetches to internal infrastructure.
  assertPublicHttpsUrl(url);

  const cacheKey = `${url}\0${destDir}`;
  // The physical request may be shared only by callers with the same
  // cancellation scope and deadline. Otherwise the first caller's abort or
  // timeout would incorrectly own every waiter.
  const validationScope = `${options.expectedContent ?? "opaque"}\0${options.expectedSha256?.trim().toLowerCase() ?? ""}`;
  const inFlightKey = `${cacheKey}\0${timeoutMs}\0${signalScopeKey(signal)}\0${validationScope}`;
  const inFlight = inFlightDownloads.get(inFlightKey);
  if (inFlight) {
    return inFlight;
  }

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const filename = getFilenameFromUrl(url, validationScope);
  const localPath = join(destDir, filename);

  if (hasCompleteFile(localPath)) {
    const identity = safeDownloadUrlIdentity(url);
    const inspection = await inspectExistingFile(localPath);
    const cacheValid = localInspectionMatchesOptions(inspection, options);
    if (cacheValid) {
      emitDownloadTelemetry(options, {
        urlFingerprint: identity.urlFingerprint,
        initialHost: identity.host,
        attempt: 0,
        outcome: "cache_hit",
        receivedBytes: inspection.localSize,
        localSize: inspection.localSize,
        localSha256: inspection.localSha256,
        rangeDisposition: "none",
      });
      return localPath;
    }
    rmSync(localPath, { force: true });
  }

  const downloadPromise = downloadWithRetry(
    url,
    localPath,
    timeoutMs,
    signal,
    onTransientRetry,
    options,
  );
  const trackedDownload = downloadPromise.finally(() => {
    inFlightDownloads.delete(inFlightKey);
  });
  inFlightDownloads.set(inFlightKey, trackedDownload);
  return trackedDownload;
}

export function isHttpUrl(path: string): boolean {
  return path.startsWith("http://") || path.startsWith("https://");
}
