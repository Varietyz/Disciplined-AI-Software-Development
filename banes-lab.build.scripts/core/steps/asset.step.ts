import { defineStep } from "#core/factories/step.factory";
import { pruneLine } from "#configuration/strings/asset.strings";
import { pruneOutput } from "#core/persistence/asset.persistence";

defineStep({
    cache: null,
    modes: ["build"],
    name: "prune",
    needs: ["prerender"],
    phase: "close",
    async run(state) {
        await Promise.resolve();
        const { bytes, count } = pruneOutput(state.outDir);
        return { gives: {}, line: pruneLine(count, bytes) };
    },
});
