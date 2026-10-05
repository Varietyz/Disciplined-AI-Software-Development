import { buildContext, emptyContext } from "@govlab/patterns/core/factories/context.factory.ts";
import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { keyOf } from "@govlab/patterns/core/formatters/definition.formatter.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const seedModule = function seedModule(name: string, source: string): string {
    const root = mkdtempSync(join(tmpdir(), "pl-context-"));
    const dir = join(root, name);
    mkdirSync(dir);
    writeVerbatim(join(dir, "package.json"), JSON.stringify({ name: `@scope/${name}` }));
    writeVerbatim(join(dir, "index.ts"), source);
    return dir;
};

describe("the repository context", () => {
    it("is empty before any module is read", () => {
        expect(emptyContext()).toStrictEqual({ fanIn: new Map(), importCycles: new Map(), packageMap: new Map() });
    });

    it("counts cross-module fan-in and flags an import cycle", async () => {
        const alpha = seedModule("alpha", 'import { beta } from "@scope/beta";\nexport const alpha = beta;\n');
        const beta = seedModule("beta", 'import { alpha } from "@scope/alpha";\nexport const beta = alpha;\n');
        const context = await buildContext([alpha, beta], { pruned: () => false, root: tmpdir() });
        expect(context.fanIn.get(keyOf(beta, "beta"))).toBe(1);
        expect(context.importCycles.get(alpha)?.[0]?.kind).toBe("import-cycle");
    });
});
