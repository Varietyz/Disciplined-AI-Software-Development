import { dirname, join } from "node:path";
import { fileOfAddress } from "#core/resolvers/catalog.resolver";
import { mkdirSync } from "node:fs";
import { writeVerbatim } from "@govlab/canonical-write";

export const writeCatalog = function writeCatalog(outDir: string, files: ReadonlyMap<string, string>): number {
    for (const [address, body] of files) {
        const target = join(outDir, fileOfAddress(address));
        mkdirSync(dirname(target), { recursive: true });
        writeVerbatim(target, body);
    }
    return files.size;
};
