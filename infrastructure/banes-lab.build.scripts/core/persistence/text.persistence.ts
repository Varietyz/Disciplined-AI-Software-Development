import {
    BROTLI_EXTENSION,
    BROTLI_THRESHOLD,
    PAGE_EXTENSION,
    TEXT_EXTENSIONS,
} from "#configuration/constants/asset.constants";
import { brotliCompress, constants } from "node:zlib";
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { digestOf, extensionOf } from "#core/resolvers/asset.resolver";
import type { TextCompression } from "#types/text.types";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { walk } from "#core/loaders/asset.loader";

const BATCH = 32;
const compress = promisify(brotliCompress);

export const isPrecompressible = function isPrecompressible(file: string, present: ReadonlySet<string>): boolean {
    const extension = extensionOf(file);
    return TEXT_EXTENSIONS.has(extension) && extension !== PAGE_EXTENSION && !present.has(file + BROTLI_EXTENSION);
};

const brotliOf = async function brotliOf(bytes: Buffer): Promise<Buffer> {
    return compress(bytes, {
        params: {
            [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
            [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
            [constants.BROTLI_PARAM_SIZE_HINT]: bytes.length,
        },
    });
};

type Outcome = "compressed" | "reused" | "skipped";

const ensureCached = async function ensureCached(
    cached: string,
    bytes: Buffer,
    prepared: Map<string, Promise<boolean>>,
): Promise<boolean> {
    const held = prepared.get(cached);
    if (held !== undefined) {
        await held;
        return false;
    }
    const job = existsSync(cached)
        ? Promise.resolve(false)
        : brotliOf(bytes).then(async (compressed) => {
              await writeFile(cached, compressed);
              return true;
          });
    prepared.set(cached, job);
    return job;
};

const siblingOf = async function siblingOf(
    outDir: string,
    file: string,
    cache: string,
    prepared: Map<string, Promise<boolean>>,
): Promise<Outcome> {
    const bytes = await readFile(join(outDir, file));
    if (bytes.length < BROTLI_THRESHOLD) {
        return "skipped";
    }
    const cached = join(cache, digestOf(bytes) + BROTLI_EXTENSION);
    const fresh = await ensureCached(cached, bytes, prepared);
    await copyFile(cached, join(outDir, file + BROTLI_EXTENSION));
    return fresh ? "compressed" : "reused";
};

export const precompressText = async function precompressText(outDir: string, cache: string): Promise<TextCompression> {
    await mkdir(cache, { recursive: true });
    const files = walk(outDir, outDir);
    const present = new Set(files);
    const targets = files.filter((file) => isPrecompressible(file, present));
    const prepared = new Map<string, Promise<boolean>>();
    const batches = Array.from({ length: Math.ceil(targets.length / BATCH) }, (_, index) =>
        targets.slice(index * BATCH, (index + 1) * BATCH),
    );
    const counts = await batches.reduce<Promise<TextCompression>>(
        async (previous, batch) => {
            const done = await previous;
            const outcomes = await Promise.all(batch.map(async (file) => siblingOf(outDir, file, cache, prepared)));
            return {
                compressed: done.compressed + outcomes.filter((outcome) => outcome === "compressed").length,
                reused: done.reused + outcomes.filter((outcome) => outcome === "reused").length,
            };
        },
        Promise.resolve({ compressed: 0, reused: 0 }),
    );
    const stale = (await readdir(cache)).map((name) => join(cache, name)).filter((path) => !prepared.has(path));
    await Promise.all(stale.map(async (path) => rm(path, { force: true })));
    return counts;
};
