import { dirname, join } from "node:path";
import { BROTLI_CACHE } from "#configuration/constants/asset.constants";
import { cacheFile } from "@govlab/content-fingerprint";
import { compressedLine } from "#configuration/strings/text.strings";
import { defineStep } from "#core/factories/step.factory";
import { precompressText } from "#core/persistence/text.persistence";

defineStep({
    cache: null,
    modes: ["build"],
    name: "compress",
    needs: ["prune"],
    phase: "close",
    async run(state) {
        const cache = join(dirname(cacheFile(BROTLI_CACHE)), BROTLI_CACHE);
        return { gives: {}, line: compressedLine(await precompressText(state.outDir, cache)) };
    },
});
