import { buildModule, buildModuleReport } from "@govlab/patterns/core/coordinators/package.coordinator.ts";
import { call, definition } from "../analyzers/code.fixture.ts";
import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { INLINE_THRESHOLD } from "@govlab/patterns/configuration/constants/report.constants.ts";
import { emptyContext } from "@govlab/patterns/core/factories/context.factory.ts";
import { entry } from "../converters/package.fixture.ts";
import { isRecord } from "@govlab/patterns/core/predicates/record.predicate.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const FILES = 8;
const PER_FILE = Math.ceil(INLINE_THRESHOLD / FILES) + 1;
const LINE_CALLEE = 5;

const keysOf = function keysOf(json: string): string[] {
    const parsed: unknown = JSON.parse(json);
    return isRecord(parsed) ? Object.keys(parsed) : [];
};

const fixture = function fixture(): ReturnType<typeof buildModule> {
    return buildModule(
        [
            entry("core/a.ts", 1, [
                definition("caller", "core/a.ts", { exported: true }),
                call("callee", "caller", "core/a.ts"),
            ]),
            entry("core/b.ts", 1, [definition("callee", "core/b.ts", { line: LINE_CALLEE })]),
        ],
        { moduleName: "fixture", title: "fixture" },
    );
};

describe("buildModule", () => {
    it("carries module metrics derived from the definitions, the edges and the findings", () => {
        const { report } = fixture();
        expect(report.module).toBe("fixture");
        expect(report.metrics.definitions).toBe(report.definitions.length);
        expect(report.metrics.edges).toBe(report.edges.length);
        expect(report.metrics.exported).toBe(1);
        expect(report.metrics.flows).toStrictEqual({ entry: 1, leaf: 1 });
    });

    it("carries one page per planned page with its walk, cells and subtitle", () => {
        const { report, svgs, cells } = fixture();
        expect(report.pages.map((page) => page.id)).toStrictEqual(["code"]);
        expect(report.pages[0]?.subtitle).toContain("steps");
        expect(svgs.has("code")).toBe(true);
        expect(cells.get("code")).toHaveLength(2);
    });

    it("emits the analysis and findings documents", () => {
        const built = fixture();
        expect(keysOf(built.analysis)).toStrictEqual(["module", "summary", "unresolvedCalls", "definitions", "edges"]);
        expect(keysOf(built.findings)).toStrictEqual(["module", "summary", "findings"]);
    });

    it("keeps every drill link resolvable to an emitted page", () => {
        const entries = Array.from({ length: FILES }, (_, index) => entry(`src/rules/rule-${index}.ts`, PER_FILE));
        const built = buildModule(entries, { moduleName: "mod", title: "mod" });
        const emitted = new Set([...built.pages.keys()].map((key) => `${key}.generated.html`));
        for (const html of built.pages.values()) {
            const targets = html
                .split('href="')
                .slice(1)
                .map((part) => part.slice(0, part.indexOf('"')));
            expect(targets.filter((target) => target.endsWith(".html")).every((target) => emitted.has(target))).toBe(
                true,
            );
        }
        expect(built.pages.size).toBeGreaterThan(1);
    });
});

describe("buildModuleReport", () => {
    it("reads, parses and reports a module folder from disk", async () => {
        const root = mkdtempSync(join(tmpdir(), "module-report-"));
        try {
            mkdirSync(join(root, "core"));
            writeVerbatim(
                join(root, "core", "a.ts"),
                "export const run = function run(): number {\n    return 1;\n};\n",
            );
            const { title, entries, built } = await buildModuleReport(root, emptyContext(), {
                pruned: () => false,
                root,
            });
            expect(title.length).toBeGreaterThan(0);
            expect(entries.map((file) => file.rel)).toStrictEqual(["core/a.ts"]);
            expect(built.report.definitions.map((record) => record.name)).toContain("run");
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
