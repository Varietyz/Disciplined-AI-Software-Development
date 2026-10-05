import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { DEFAULT_ROOT_PREFIX } from "@govlab/docs/configuration/constants/document.constants.ts";
import { SpecOutputs } from "@govlab/docs/core/factories/document.output.factory.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ENGINE = {
    declaredDocLocation: (): string => `${DEFAULT_ROOT_PREFIX}references/x.md`,
    generateReadme: (): string => "# Readme body",
    renderDeclaredDoc: (): string => "declared doc body",
};

const formatMarkdown = async function formatMarkdown(markdown: string): Promise<string> {
    await Promise.resolve();
    return markdown;
};

describe("SpecOutputs", () => {
    it("builds a README spec and a typed document spec, and no chart spec for a module that is not analyzable", async () => {
        const dir = mkdtempSync(join(tmpdir(), "docspec-"));
        try {
            const outputs = new SpecOutputs({ discoverAll: () => [], engine: ENGINE, formatMarkdown, root: dir });
            const documents = [{ body: [], concern: "quality", name: "x", summary: "s", type: "reference" }];
            const result = await outputs.moduleOutputs({
                dir,
                label: "mod",
                manifest: { docs: {}, documents },
                relPath: "test/mod",
            });
            expect(result.shared.hasCharts).toBe(false);
            expect(result.specs.map((spec) => spec.driftCode)).toStrictEqual(["readme-drift", "doc-drift"]);
            expect(await result.specs[0]?.produce("")).toContain("Readme body");
        } finally {
            rmSync(dir, { force: true, recursive: true });
        }
    });
});
