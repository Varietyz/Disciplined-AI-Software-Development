import { dirname, join } from "node:path";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { renderGraphChunk, renderGraphLoader } from "#core/formatters/graph.formatter";
import { writeCanonicalText, writeVerbatim } from "@govlab/canonical-write";
import type { GraphChunk } from "@banes-lab/web/types/graph.types.js";
import type { GraphReport } from "#types/graph.types";
import { absolutePath } from "@ssot/paths";
import { chunkFileOf } from "#core/resolvers/graph.resolver";
import { graphReport } from "#core/resolvers/catalog.resolver";
import { isChunkFile } from "#core/predicates/graph.predicate";

const JSON_INDENT = 4;

export const writeGraphReport = function writeGraphReport(report: GraphReport, file = graphReport()): void {
    mkdirSync(dirname(file), { recursive: true });
    writeVerbatim(file, JSON.stringify(report, null, JSON_INDENT));
};

export const writeGraphChunks = async function writeGraphChunks(
    chunks: ReadonlyMap<string, GraphChunk>,
    loader = absolutePath("app.graph"),
): Promise<void> {
    const folder = dirname(loader);
    const written = new Set([...chunks.keys()].map(chunkFileOf));
    for (const stale of readdirSync(folder).filter((name) => isChunkFile(name) && !written.has(name))) {
        rmSync(join(folder, stale));
    }
    const keys = [...chunks.keys()];
    await Promise.all([
        writeCanonicalText(loader, renderGraphLoader(keys)),
        ...[...chunks].map(async ([collection, chunk]) =>
            writeCanonicalText(join(folder, chunkFileOf(collection)), renderGraphChunk(chunk)),
        ),
    ]);
};
