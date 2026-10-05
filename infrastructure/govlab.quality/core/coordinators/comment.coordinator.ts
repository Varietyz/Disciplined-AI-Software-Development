import type { CommentGrammar, ExtractResult, FileComment, StripResult } from "#types/comment.types";
import {
    EXTRACT_OUT,
    MAX_PARSE_BYTES,
    STRIP_CONCURRENCY,
    STRIP_INDEX,
} from "#configuration/constants/comment.constants";
import { type FingerprintIndex, cacheFile, createFingerprintIndex, fingerprintOf } from "@govlab/content-fingerprint";
import {
    cleanedLine,
    extractSummary,
    extractedLine,
    skippedLine,
    stripSummary,
} from "#configuration/strings/comment.strings";
import { collectFiles, commentGrammars, langOf, preload } from "#core/loaders/comment.loader";
import { extractComments, stripComments } from "#core/converters/comment.converter";
import type { PathExclusion } from "#types/exclusions.types";
import { appendExtracted } from "#core/persistence/comment.persistence";
import { promises as fs } from "node:fs";
import path from "node:path";
import { relativePath } from "@ssot/paths";
import { writeVerbatim } from "@govlab/canonical-write";

type Grammars = Map<string, CommentGrammar>;

interface StripCtx {
    grammars: Grammars;
    index: FingerprintIndex;
    root: string;
}

interface StripJob {
    filePath: string;
    hash: string;
    key: string;
    result: StripResult | null;
}

const errorDetail = function errorDetail(error: unknown): string {
    return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
};

const pool = async function pool<T>(items: readonly T[], worker: (item: T) => Promise<void>): Promise<void> {
    const queue = [...items];
    const drain = async function drain(): Promise<void> {
        const next = queue.shift();
        if (next === undefined) {
            return;
        }
        await worker(next);
        await drain();
    };
    await Promise.all(Array.from({ length: Math.min(STRIP_CONCURRENCY, queue.length) }, drain));
};

const oversized = async function oversized(filePath: string, key: string): Promise<boolean> {
    const { size } = await fs.stat(filePath);
    if (size <= MAX_PARSE_BYTES) {
        return false;
    }
    process.stderr.write(
        skippedLine(key, `${String(size)} bytes exceeds the ${String(MAX_PARSE_BYTES)}-byte parse limit`),
    );
    return true;
};

const guarded = function guarded<T>(key: string, run: () => T): T | null {
    try {
        return run();
    } catch (error) {
        process.stderr.write(skippedLine(key, errorDetail(error)));
        return null;
    }
};

const stripGrammar = function stripGrammar(filePath: string, grammars: Grammars): CommentGrammar | null {
    const lang = langOf(filePath);
    return lang === null ? null : (grammars.get(lang) ?? { directivePrefixes: [], lang });
};

const extractGrammar = function extractGrammar(filePath: string, grammars: Grammars): CommentGrammar | null {
    const lang = langOf(filePath);
    return lang === null ? null : (grammars.get(lang) ?? null);
};

const prepareStrip = async function prepareStrip(
    filePath: string,
    key: string,
    index: FingerprintIndex,
): Promise<{ content: string; hash: string } | null> {
    if (await oversized(filePath, key)) {
        return null;
    }
    const content = await fs.readFile(filePath, "utf8");
    const hash = fingerprintOf([content]);
    return index.unchanged(key, hash) ? null : { content, hash };
};

const commitStrip = function commitStrip(job: StripJob, ctx: StripCtx): number {
    if (job.result?.changed !== true) {
        ctx.index.update(job.key, job.hash);
        return 0;
    }
    writeVerbatim(job.filePath, job.result.content);
    process.stdout.write(cleanedLine(path.relative(ctx.root, job.filePath)));
    ctx.index.update(job.key, fingerprintOf([job.result.content]));
    return 1;
};

const stripFile = async function stripFile(filePath: string, ctx: StripCtx): Promise<number> {
    const grammar = stripGrammar(filePath, ctx.grammars);
    const key = path.relative(ctx.root, filePath);
    const prepared = grammar === null ? null : await prepareStrip(filePath, key, ctx.index);
    if (grammar === null || prepared === null) {
        return 0;
    }
    const result = guarded(key, () => stripComments(prepared.content, grammar));
    return commitStrip({ filePath, hash: prepared.hash, key, result }, ctx);
};

const extractFile = async function extractFile(
    filePath: string,
    root: string,
    grammars: Grammars,
): Promise<FileComment[]> {
    const grammar = extractGrammar(filePath, grammars);
    const key = path.relative(root, filePath);
    if (grammar === null || (await oversized(filePath, key))) {
        return [];
    }
    const content = await fs.readFile(filePath, "utf8");
    const result: ExtractResult | null = guarded(key, () => extractComments(content, grammar));
    if (result?.changed !== true) {
        return [];
    }
    writeVerbatim(filePath, result.content);
    process.stdout.write(extractedLine(key));
    return result.comments.map((comment) => ({ file: key, line: comment.line, text: comment.text }));
};

export const runStrip = async function runStrip(root: string, excluded: PathExclusion): Promise<void> {
    const files = collectFiles(root, excluded);
    await preload(files);
    const ctx: StripCtx = {
        grammars: commentGrammars(),
        index: createFingerprintIndex({ file: cacheFile(STRIP_INDEX) }),
        root,
    };
    const counts: number[] = [];
    await pool(files, async (filePath) => {
        counts.push(await stripFile(filePath, ctx));
    });
    ctx.index.flush();
    process.stdout.write(
        stripSummary(
            counts.reduce((sum, count) => sum + count, 0),
            files.length,
        ),
    );
};

export const runExtract = async function runExtract(
    root: string,
    out: string | null,
    excluded: PathExclusion,
): Promise<void> {
    const files = collectFiles(root, excluded);
    await preload(files);
    const grammars = commentGrammars();
    const collected: FileComment[] = [];
    await pool(files, async (filePath) => {
        collected.push(...(await extractFile(filePath, root, grammars)));
    });
    const outPath = out === null ? path.join(root, relativePath("govlabHost.root"), EXTRACT_OUT) : path.resolve(out);
    const added = await appendExtracted(outPath, collected);
    process.stdout.write(extractSummary(added, path.relative(root, outPath)));
};
