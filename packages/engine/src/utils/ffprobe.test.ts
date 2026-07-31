// fallow-ignore-file code-duplication
import { EventEmitter } from "events";
import { spawnSync } from "child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { basename, resolve } from "path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { extractMediaMetadata, extractPngMetadataFromBuffer } from "./ffprobe.js";

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i] ?? 0;
    for (let bit = 0; bit < 8; bit++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: number[]): Buffer {
  const chunkData = Buffer.from(data);
  const header = Buffer.alloc(8);
  header.writeUInt32BE(chunkData.length, 0);
  header.write(type, 4, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), chunkData])), 0);
  return Buffer.concat([header, chunkData, crc]);
}

function buildPngWithChunks(chunks: Buffer[]): Buffer {
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ...chunks]);
}

function buildMinimalPng(options?: {
  cIcpAfterIdat?: boolean;
  invalidCrc?: boolean;
  longCicp?: boolean;
}) {
  const ihdr = pngChunk("IHDR", [0, 0, 0, 1, 0, 0, 0, 1, 16, 2, 0, 0, 0]);
  const cicpData = options?.longCicp ? [9, 16, 0, 1, 255] : [9, 16, 0, 1];
  let cicp = pngChunk("cICP", cicpData);
  if (options?.invalidCrc) {
    cicp = Buffer.from(cicp);
    cicp[cicp.length - 1] ^= 0xff;
  }
  const idat = pngChunk(
    "IDAT",
    [0x78, 0x9c, 0x63, 0x60, 0x60, 0x60, 0x00, 0x00, 0x00, 0x04, 0x00, 0x01],
  );
  const iend = pngChunk("IEND", []);
  return options?.cIcpAfterIdat
    ? buildPngWithChunks([ihdr, idat, cicp, iend])
    : buildPngWithChunks([ihdr, cicp, idat, iend]);
}

describe("extractMediaMetadata", () => {
  it("reads HDR PNG cICP metadata when ffprobe color fields are absent", async () => {
    const fixturePath = resolve(
      __dirname,
      "../../../producer/tests/hdr-regression/src/hdr-photo-pq.png",
    );

    const metadata = await extractMediaMetadata(fixturePath);

    expect(metadata.colorSpace).toEqual({
      colorPrimaries: "bt2020",
      colorTransfer: "smpte2084",
      colorSpace: "gbr",
    });
  });
});

describe("extractPngMetadataFromBuffer", () => {
  it("accepts a valid cICP chunk before IDAT", () => {
    const metadata = extractPngMetadataFromBuffer(buildMinimalPng());
    expect(metadata?.colorSpace).toEqual({
      colorPrimaries: "bt2020",
      colorTransfer: "smpte2084",
      colorSpace: "gbr",
    });
  });

  it("rejects cICP chunks after IDAT", () => {
    const metadata = extractPngMetadataFromBuffer(buildMinimalPng({ cIcpAfterIdat: true }));
    expect(metadata).toEqual({
      width: 1,
      height: 1,
      colorSpace: null,
    });
  });

  it("rejects cICP chunks with invalid CRC", () => {
    expect(extractPngMetadataFromBuffer(buildMinimalPng({ invalidCrc: true }))).toBeNull();
  });

  it("rejects cICP chunks whose payload is not exactly four bytes", () => {
    const metadata = extractPngMetadataFromBuffer(buildMinimalPng({ longCicp: true }));
    expect(metadata).toEqual({
      width: 1,
      height: 1,
      colorSpace: null,
    });
  });

  it("continues to parse the checked-in HDR PNG fixture", () => {
    const fixture = readFileSync(
      resolve(__dirname, "../../../producer/tests/hdr-regression/src/hdr-photo-pq.png"),
    );
    expect(extractPngMetadataFromBuffer(fixture)?.colorSpace?.colorTransfer).toBe("smpte2084");
  });

  it("rejects a CRC-valid PNG header without image data and an end marker", () => {
    const ihdr = pngChunk("IHDR", [0, 0, 0, 1, 0, 0, 0, 1, 16, 2, 0, 0, 0]);
    expect(extractPngMetadataFromBuffer(buildPngWithChunks([ihdr]))).toBeNull();
  });
});

describe("probeMediaProfile", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("child_process");
  });

  it("classifies still, moving, audio-only, and mixed streams from probe data", async () => {
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ codec_type: "video", codec_name: "png" }],
          format: { format_name: "png_pipe" },
        }),
      },
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ codec_type: "video", codec_name: "h264" }],
          format: { format_name: "mov,mp4,m4a,3gp,3g2,mj2" },
        }),
      },
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ codec_type: "audio", codec_name: "mp3" }],
          format: { format_name: "mp3" },
        }),
      },
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ codec_type: "video" }, { codec_type: "audio" }],
          format: { format_name: "matroska,webm" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));
    const { probeMediaProfile } = await import("./ffprobe.js");

    const validPngPath = resolve(
      __dirname,
      "../../../producer/tests/hdr-regression/src/hdr-photo-pq.png",
    );
    await expect(probeMediaProfile(validPngPath)).resolves.toEqual({
      hasVideoStream: true,
      hasAudioStream: false,
      visualKind: "still",
    });
    await expect(probeMediaProfile("/tmp/extensionless-video")).resolves.toEqual({
      hasVideoStream: true,
      hasAudioStream: false,
      visualKind: "moving",
    });
    await expect(probeMediaProfile("/tmp/extensionless-audio")).resolves.toEqual({
      hasVideoStream: false,
      hasAudioStream: true,
      visualKind: "none",
    });
    await expect(probeMediaProfile("/tmp/mixed-av")).resolves.toEqual({
      hasVideoStream: true,
      hasAudioStream: true,
      visualKind: "moving",
    });
  });

  it("does not treat attached cover art in an audio container as an image asset", async () => {
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [
            { codec_type: "video", disposition: { attached_pic: 1 } },
            { codec_type: "audio" },
          ],
          format: { format_name: "mp3" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));
    const { probeMediaProfile } = await import("./ffprobe.js");
    await expect(probeMediaProfile("/tmp/audio-with-cover")).resolves.toMatchObject({
      hasAudioStream: true,
      visualKind: "none",
    });
  });

  it("classifies extensionless AVIF from its ISO-BMFF brand instead of the generic mov demuxer", async () => {
    const fixtureDir = mkdtempSync(resolve(tmpdir(), "hf-avif-profile-"));
    const fixturePath = resolve(fixtureDir, "asset");
    const ftyp = Buffer.alloc(24);
    ftyp.writeUInt32BE(24, 0);
    ftyp.write("ftyp", 4, 4, "ascii");
    ftyp.write("avif", 8, 4, "ascii");
    ftyp.writeUInt32BE(0, 12);
    ftyp.write("mif1", 16, 4, "ascii");
    ftyp.write("avif", 20, 4, "ascii");
    writeFileSync(fixturePath, ftyp);
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ codec_type: "video", codec_name: "av1" }],
          format: { format_name: "mov,mp4,m4a,3gp,3g2,mj2" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));
    const { probeMediaProfile } = await import("./ffprobe.js");
    try {
      await expect(probeMediaProfile(fixturePath)).resolves.toMatchObject({
        hasVideoStream: true,
        hasAudioStream: false,
        visualKind: "still",
      });
    } finally {
      rmSync(fixtureDir, { recursive: true, force: true });
    }
  });

  it("uses any non-attached video stream when cover art precedes moving video", async () => {
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [
            { codec_type: "video", disposition: { attached_pic: 1 } },
            { codec_type: "video", codec_name: "h264" },
            { codec_type: "audio" },
          ],
          format: { format_name: "mov,mp4,m4a,3gp,3g2,mj2" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));
    const { probeMediaProfile } = await import("./ffprobe.js");
    await expect(probeMediaProfile("/tmp/video-with-cover")).resolves.toMatchObject({
      visualKind: "moving",
    });
  });

  it.skipIf(spawnSync("ffprobe", ["-version"]).status !== 0)(
    "rejects an IHDR-only truncated PNG even when ffprobe accepts png_pipe",
    async () => {
      vi.resetModules();
      vi.doUnmock("child_process");
      const fixtureDir = mkdtempSync(resolve(tmpdir(), "hf-truncated-png-profile-"));
      const fixturePath = resolve(fixtureDir, "asset");
      const ihdr = pngChunk("IHDR", [0, 0, 0, 1, 0, 0, 0, 1, 16, 2, 0, 0, 0]);
      writeFileSync(fixturePath, buildPngWithChunks([ihdr]));
      const { probeMediaProfile } = await import("./ffprobe.js");
      try {
        await expect(probeMediaProfile(fixturePath)).rejects.toThrow();
      } finally {
        rmSync(fixtureDir, { recursive: true, force: true });
      }
    },
  );
});

interface SpawnCall {
  command: string;
  args: readonly string[];
}

interface FakeProc extends EventEmitter {
  stdout: EventEmitter;
  stderr: EventEmitter;
}

type SpawnOutcome =
  | { kind: "missing" }
  | { kind: "error"; message: string; code?: string }
  | { kind: "exit"; code: number; stdout?: string; stderr?: string };

function createSpawnSpy(outcomes: SpawnOutcome[]): {
  spawn: (command: string, args: readonly string[]) => FakeProc;
  calls: SpawnCall[];
} {
  const calls: SpawnCall[] = [];
  let invocation = 0;
  const spawn = (command: string, args: readonly string[]): FakeProc => {
    calls.push({ command, args });
    const outcome = outcomes[invocation] ?? outcomes[outcomes.length - 1];
    invocation += 1;

    const proc = new EventEmitter() as FakeProc;
    proc.stdout = new EventEmitter();
    proc.stderr = new EventEmitter();

    process.nextTick(() => {
      if (!outcome) return;
      if (outcome.kind === "missing") {
        const err = new Error("spawn ffprobe ENOENT") as NodeJS.ErrnoException;
        err.code = "ENOENT";
        proc.emit("error", err);
        return;
      }
      if (outcome.kind === "error") {
        const err = new Error(outcome.message) as NodeJS.ErrnoException;
        if (outcome.code) err.code = outcome.code;
        proc.emit("error", err);
        return;
      }
      if (outcome.stdout) proc.stdout.emit("data", Buffer.from(outcome.stdout));
      if (outcome.stderr) proc.stderr.emit("data", Buffer.from(outcome.stderr));
      proc.emit("close", outcome.code);
    });

    return proc;
  };
  return { spawn, calls };
}

describe("ffprobe missing-binary fallback", () => {
  const originalFfprobePath = process.env.HYPERFRAMES_FFPROBE_PATH;
  const originalPath = process.env.PATH;

  function hidePathBinaries(): void {
    process.env.PATH = "";
  }

  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("child_process");
    if (originalFfprobePath === undefined) delete process.env.HYPERFRAMES_FFPROBE_PATH;
    else process.env.HYPERFRAMES_FFPROBE_PATH = originalFfprobePath;
    if (originalPath === undefined) delete process.env.PATH;
    else process.env.PATH = originalPath;
  });

  it("spawns the configured absolute FFprobe path when HYPERFRAMES_FFPROBE_PATH is set", async () => {
    process.env.HYPERFRAMES_FFPROBE_PATH = "/tools/ffprobe.exe";
    const successfulStderr = "recoverable diagnostic on a successful probe";
    const { spawn, calls } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ codec_type: "audio", codec_name: "aac", sample_rate: "48000", channels: 2 }],
          format: { duration: "1.25", bit_rate: "128000" },
        }),
        stderr: successfulStderr,
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractAudioMetadata } = await import("./ffprobe.js");
    const meta = await extractAudioMetadata("/tmp/uses-configured-ffprobe.wav");

    expect(meta.durationSeconds).toBe(1.25);
    expect(JSON.stringify(meta)).not.toContain(successfulStderr);
    expect(calls[0]?.command).toBe(resolve("/tools/ffprobe.exe"));
    expect(calls[0]?.args.slice(0, 2)).toEqual(["-v", "error"]);
  });

  it.each([
    { name: "non-AAC metadata", codec: "mp3", packets: undefined, expected: 1.25, calls: 1 },
    { name: "valid AAC packet count", codec: "aac", packets: "783", expected: 16.704, calls: 2 },
    {
      name: "missing AAC packet count",
      codec: "aac",
      packets: undefined,
      expected: 1.25,
      calls: 2,
    },
    { name: "zero AAC packet count", codec: "aac", packets: "0", expected: 1.25, calls: 2 },
    {
      name: "invalid AAC packet count",
      codec: "aac",
      packets: "invalid",
      expected: 1.25,
      calls: 2,
    },
  ])(
    "derives audio duration for $name",
    async ({ codec, packets, expected, calls: expectedCalls }) => {
      const outcomes: SpawnOutcome[] = [
        {
          kind: "exit",
          code: 0,
          stdout: JSON.stringify({
            streams: [
              { codec_type: "audio", codec_name: codec, sample_rate: "48000", channels: 2 },
            ],
            format: { duration: "1.25", bit_rate: "128000" },
          }),
        },
      ];
      if (codec === "aac") {
        outcomes.push({
          kind: "exit",
          code: 0,
          stdout: JSON.stringify({ streams: [{ nb_read_packets: packets }], format: {} }),
        });
      }
      const { spawn, calls } = createSpawnSpy(outcomes);
      vi.resetModules();
      vi.doMock("child_process", () => ({ spawn }));

      const { extractAudioMetadata } = await import("./ffprobe.js");
      const meta = await extractAudioMetadata(`/tmp/${codec}-${packets ?? "none"}.audio`);

      expect(meta.durationSeconds).toBeCloseTo(expected, 6);
      expect(calls).toHaveLength(expectedCalls);
    },
  );

  it("extractMediaMetadata falls back to PNG cICP metadata when ffprobe is missing", async () => {
    const { spawn, calls } = createSpawnSpy([{ kind: "missing" }]);
    hidePathBinaries();
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractMediaMetadata: extractMediaMetadataMocked } = await import("./ffprobe.js");
    const fixture = resolve(
      __dirname,
      "../../../producer/tests/hdr-regression/src/hdr-photo-pq.png",
    );
    const meta = await extractMediaMetadataMocked(fixture);

    expect(calls.length).toBe(1);
    expect(basename(calls[0]?.command ?? "")).toMatch(/^ffprobe(?:\.exe)?$/);
    expect(meta.videoCodec).toBe("png");
    expect(meta.durationSeconds).toBe(0);
    expect(meta.fps).toBe(0);
    expect(meta.hasAudio).toBe(false);
    expect(meta.isVFR).toBe(false);
    expect(meta.hasAlpha).toBe(false);
    expect(meta.colorSpace?.colorTransfer).toBe("smpte2084");
    expect(meta.colorSpace?.colorPrimaries).toBe("bt2020");
  });

  it("extractMediaMetadata detects VP9 alpha_mode streams", async () => {
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [
            {
              codec_type: "video",
              codec_name: "vp9",
              width: 320,
              height: 180,
              r_frame_rate: "30/1",
              avg_frame_rate: "30/1",
              pix_fmt: "yuv420p",
              tags: { alpha_mode: "1" },
            },
          ],
          format: { duration: "1.5" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractMediaMetadata: extractMediaMetadataMocked } = await import("./ffprobe.js");
    const meta = await extractMediaMetadataMocked("/tmp/alpha.webm");

    expect(meta.videoCodec).toBe("vp9");
    expect(meta.hasAlpha).toBe(true);
  });

  it("normalizes omitted video color components to empty strings", async () => {
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [
            {
              codec_type: "video",
              codec_name: "h264",
              width: 64,
              height: 64,
              r_frame_rate: "30/1",
              avg_frame_rate: "30/1",
              pix_fmt: "yuv420p",
              color_space: "bt709",
            },
          ],
          format: { duration: "1" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractMediaMetadata: extractMediaMetadataMocked } = await import("./ffprobe.js");
    const metadata = await extractMediaMetadataMocked("/tmp/partial-color.mp4");

    expect(metadata.colorSpace).toEqual({
      colorPrimaries: "",
      colorTransfer: "",
      colorSpace: "bt709",
    });
  });

  // Regression: newer libavformat builds (and the output of `hyperframes
  // remove-background` itself) write the VP9-alpha sidecar tag as
  // `ALPHA_MODE` (uppercase). The lowercase-only check classified those
  // files as having no alpha, the producer extracted them as JPGs, and
  // the injected <img> overlays were fully opaque rectangles that hid
  // every static element below them on the z-stack. The bug was silent —
  // studio preview rendered correctly via native <video> playback while
  // production renders covered headlines and captions with the avatar.
  it("extractMediaMetadata detects ALPHA_MODE (uppercase) streams from newer ffmpeg builds", async () => {
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [
            {
              codec_type: "video",
              codec_name: "vp9",
              width: 320,
              height: 180,
              r_frame_rate: "30/1",
              avg_frame_rate: "30/1",
              pix_fmt: "yuv420p",
              tags: { ALPHA_MODE: "1" },
            },
          ],
          format: { duration: "1.5" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractMediaMetadata: extractMediaMetadataMocked } = await import("./ffprobe.js");
    const meta = await extractMediaMetadataMocked("/tmp/alpha-uppercase.webm");

    expect(meta.videoCodec).toBe("vp9");
    expect(meta.hasAlpha).toBe(true);
  });

  it("extractMediaMetadata rethrows ffprobe-missing error for non-image files without fallback", async () => {
    const { spawn } = createSpawnSpy([{ kind: "missing" }]);
    hidePathBinaries();
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractMediaMetadata: extractMediaMetadataMocked } = await import("./ffprobe.js");

    await expect(extractMediaMetadataMocked("/tmp/no-such-video.mp4")).rejects.toThrow(/ffprobe/);
  });

  it("surfaces bounded ffprobe stderr for invalid media", async () => {
    const leadingNoise = "x".repeat(10_000);
    const diagnostic = "Invalid data found when processing input";
    const inputPath = "/tmp/render/My Secret Video.mp4";
    const { spawn, calls } = createSpawnSpy([
      {
        kind: "exit",
        code: 1,
        stderr: `${leadingNoise}${inputPath}: ${diagnostic}`,
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractAudioMetadata } = await import("./ffprobe.js");

    let thrown: unknown;
    try {
      await extractAudioMetadata(inputPath);
    } catch (error) {
      thrown = error;
    }
    expect(String(thrown)).toContain(diagnostic);
    expect(String(thrown)).toContain("[input]");
    expect(String(thrown)).not.toContain(inputPath);
    expect(String(thrown)).not.toContain("My Secret Video.mp4");
    expect(String(thrown).length).toBeLessThan(4_500);
    expect(calls[0]?.args.slice(0, 2)).toEqual(["-v", "error"]);
    expect(calls[0]?.args.at(-1)).toBe(inputPath);
  });

  it("redacts an input path fragment when the stderr tail starts inside its basename", async () => {
    const diagnostic = "Invalid data found when processing input";
    const inputPath = "/tmp/render/Confidential Client Preview.mp4";
    const retainedPathFragment = "Client Preview.mp4";
    const diagnosticPrefix = `: ${diagnostic} `;
    const remainingBytes =
      8 * 1024 - Buffer.byteLength(retainedPathFragment) - Buffer.byteLength(diagnosticPrefix);
    const multibyteCount = Math.floor(remainingBytes / Buffer.byteLength("€"));
    const trailingAscii = "x".repeat(remainingBytes - multibyteCount * Buffer.byteLength("€"));
    const stderr = `${inputPath}${diagnosticPrefix}${"€".repeat(multibyteCount)}${trailingAscii}`;
    const { spawn } = createSpawnSpy([{ kind: "exit", code: 1, stderr }]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractAudioMetadata } = await import("./ffprobe.js");

    let thrown: unknown;
    try {
      await extractAudioMetadata(inputPath);
    } catch (error) {
      thrown = error;
    }
    expect(String(thrown)).toContain(diagnostic);
    expect(String(thrown)).toContain("[input]");
    expect(String(thrown)).not.toContain(retainedPathFragment);
    expect(String(thrown)).not.toContain("Client Preview.mp4");
  });

  it("extractAudioMetadata surfaces a ffprobe-missing error verbatim", async () => {
    const { spawn, calls } = createSpawnSpy([{ kind: "missing" }]);
    hidePathBinaries();
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractAudioMetadata } = await import("./ffprobe.js");

    await expect(extractAudioMetadata("/tmp/no-such-audio.wav")).rejects.toThrow(
      /ffprobe not found/,
    );
    expect(calls.length).toBe(1);
    expect(basename(calls[0]?.command ?? "")).toMatch(/^ffprobe(?:\.exe)?$/);
  });

  it("analyzeKeyframeIntervals surfaces a ffprobe-missing error verbatim", async () => {
    const { spawn, calls } = createSpawnSpy([{ kind: "missing" }]);
    hidePathBinaries();
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { analyzeKeyframeIntervals } = await import("./ffprobe.js");

    await expect(analyzeKeyframeIntervals("/tmp/no-such-video.mp4")).rejects.toThrow(
      /ffprobe not found/,
    );
    expect(calls.length).toBe(1);
    expect(basename(calls[0]?.command ?? "")).toMatch(/^ffprobe(?:\.exe)?$/);
  });

  it("ffprobe-missing error message includes install hint", async () => {
    const { spawn } = createSpawnSpy([{ kind: "missing" }]);
    hidePathBinaries();
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractAudioMetadata } = await import("./ffprobe.js");

    await expect(extractAudioMetadata("/tmp/example.mp3")).rejects.toThrow(/install FFmpeg/i);
  });
});

describe("ffprobe option separator", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("child_process");
  });

  it("places -- before the file path so paths starting with - are not parsed as options", async () => {
    const { spawn, calls } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [
            {
              codec_type: "video",
              codec_name: "h264",
              width: 320,
              height: 180,
              r_frame_rate: "30/1",
              avg_frame_rate: "30/1",
            },
          ],
          format: { duration: "1.5" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractMediaMetadata } = await import("./ffprobe.js");
    const filePath = "/tmp/-dangerous-name.mp4";
    await extractMediaMetadata(filePath);

    const args = calls[0]?.args ?? [];
    const filePathIndex = args.indexOf(filePath);
    expect(filePathIndex).toBeGreaterThan(0);
    expect(args[filePathIndex - 1]).toBe("--");
  });

  it("uses -- for audio and keyframe probes too", async () => {
    const { spawn, calls } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ codec_type: "audio", codec_name: "aac", sample_rate: "48000", channels: 2 }],
          format: { duration: "1.25" },
        }),
      },
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [{ nb_read_packets: "783" }],
          format: {},
        }),
      },
      { kind: "exit", code: 0, stdout: "0.000\n1.000\n" },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractAudioMetadata, analyzeKeyframeIntervals } = await import("./ffprobe.js");
    await extractAudioMetadata("/tmp/-audio.wav");
    await analyzeKeyframeIntervals("/tmp/-video.mp4");

    const args = calls.flatMap((call) => [...(call.args ?? [])]);
    expect(args.filter((arg) => arg === "--")).toHaveLength(3);
  });
});

describe("ffprobe frame rate parsing", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("child_process");
  });

  it.each([
    { r: "30/1", avg: "30/1", expected: 30 },
    { r: "30000/1001", avg: "30000/1001", expected: 29.97 },
    { r: "30/", avg: undefined, expected: 0 },
    { r: "30/0", avg: undefined, expected: 0 },
    { r: "0/0", avg: undefined, expected: 0 },
    { r: "abc/def", avg: undefined, expected: 0 },
    { r: "60", avg: undefined, expected: 60 },
  ])("parses r=$r avg=$avg as fps=$expected", async ({ r, avg, expected }) => {
    const { spawn } = createSpawnSpy([
      {
        kind: "exit",
        code: 0,
        stdout: JSON.stringify({
          streams: [
            {
              codec_type: "video",
              codec_name: "h264",
              width: 320,
              height: 180,
              r_frame_rate: r,
              avg_frame_rate: avg,
            },
          ],
          format: { duration: "1.5" },
        }),
      },
    ]);
    vi.resetModules();
    vi.doMock("child_process", () => ({ spawn }));

    const { extractMediaMetadata } = await import("./ffprobe.js");
    const meta = await extractMediaMetadata("/tmp/frame-rate.mp4");

    expect(meta.fps).toBe(expected);
  });
});

describe("extractPngMetadataFromBuffer cICP ordering", () => {
  it("does not emit color space until IHDR provides width and height", () => {
    const ihdr = pngChunk("IHDR", [0, 0, 0, 1, 0, 0, 0, 1, 16, 2, 0, 0, 0]);
    const cicp = pngChunk("cICP", [9, 16, 0, 1]);
    const idat = pngChunk("IDAT", [0x78, 0x9c, 0x03, 0x00, 0x00, 0x00, 0x00, 0x01]);
    const iend = pngChunk("IEND", []);

    // cICP before IHDR is invalid PNG ordering; make sure we don't return
    // zero-sized metadata in that case.
    const malformed = buildPngWithChunks([cicp, ihdr, idat, iend]);
    expect(extractPngMetadataFromBuffer(malformed)).toEqual({
      width: 1,
      height: 1,
      colorSpace: {
        colorPrimaries: "bt2020",
        colorTransfer: "smpte2084",
        colorSpace: "gbr",
      },
    });

    // Without any IHDR, a cICP alone should not produce a result.
    const onlyCicp = buildPngWithChunks([cicp, iend]);
    expect(extractPngMetadataFromBuffer(onlyCicp)).toBeNull();
  });
});
