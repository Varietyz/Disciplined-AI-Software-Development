import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { DocChecks } from "@govlab/docs/core/coordinators/document.coordinator.ts";
import type { ModuleDocs } from "@govlab/docs/types/readme.types.ts";
import type { Spec } from "@govlab/docs/types/document.output.types.ts";
import { captureOutput } from "./output.fixture.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "doc-checks-"));
const SPEC_PATH = join(dir, "README.md");
writeVerbatim(
    join(dir, "_manifest.json"),
    JSON.stringify({ docs: {}, label: "m", maturity: "stable", visibility: {} }),
);
const NO_DOCS = mkdtempSync(join(tmpdir(), "doc-checks-bare-"));
writeVerbatim(join(NO_DOCS, "_manifest.json"), JSON.stringify({ label: "m" }));

const ENGINE: ModuleDocs = {
    declaredDocLocation: () => "x.md",
    generateReadme: () => "",
    governConcepts: () => [],
    governDeclaredDocs: () => [],
    governManifest: () => [],
    governPrinciples: () => [],
    ontologyDuplicates: () => ["dup-principle"],
    renderDeclaredDoc: () => "",
};

const written: string[] = [];
const SPEC: Spec = {
    driftCode: "readme-drift",
    label: "m/README.md",
    normalize: (text) => text,
    path: SPEC_PATH,
    produce: () => "body",
};
const checks = new DocChecks({
    discoverAll: () => [],
    engine: ENGINE,
    generatedPrefix: "<!-- gen",
    moduleOutputs: async () => {
        await Promise.resolve();
        return { shared: { charts: null, hasCharts: false, isAggregate: false }, specs: [SPEC] };
    },
    workspaceMapTarget: async () => {
        await Promise.resolve();
        return null;
    },
    writeSpec: (_spec, content) => {
        written.push(content);
    },
});

afterEach(() => {
    vi.restoreAllMocks();
});

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
    rmSync(NO_DOCS, { force: true, recursive: true });
});

describe("DocChecks", () => {
    it("counts the ontology duplicates found by a full check", async () => {
        const output = captureOutput();
        expect(await checks.checkModules({ fix: false, only: null, workspaceMapOnly: false })).toBeGreaterThanOrEqual(
            1,
        );
        expect(output.err.join("")).toContain("[duplicate-principle] dup-principle");
    });

    it("writes one module's specs and refuses a folder without a manifest or docs block", async () => {
        const output = captureOutput();
        await checks.writeOne(dir);
        expect(written).toStrictEqual(["body"]);
        expect(output.out).toStrictEqual(["✓ m/README.md\n"]);
        await expect(checks.writeOne(join(dir, "absent"))).rejects.toThrow("no _manifest.json");
        await expect(checks.writeOne(NO_DOCS)).rejects.toThrow("no docs block");
    });

    it("generates every selected module and reports the total", async () => {
        const output = captureOutput();
        await checks.generateAll({ only: null, workspaceMapOnly: false });
        expect(output.out).toStrictEqual(["govlab.docs generate: 0 module document(s)\n"]);
    });
});
