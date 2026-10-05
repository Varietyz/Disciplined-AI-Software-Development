import type { AnatomyFile, AnatomyFolder, AnatomySnapshot } from "@banes-lab/web/types/anatomy.types.js";
import {
    canonicalOf,
    sourceFiles,
    sourceLeaves,
    summaryOf,
} from "@banes-lab/build-scripts/core/converters/source.converter.ts";
import { describe, expect, it } from "vitest";
import type { SourceTools } from "@banes-lab/build-scripts/types/source.types.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { placementsOf } from "@banes-lab/build-scripts/core/converters/location.converter.ts";
import { sourceIndexPlans } from "@banes-lab/build-scripts/core/converters/index.source.converter.ts";

const SITE = "https://example.test";
const STATS = {
    bytes: 10,
    callable: 1,
    definitions: 1,
    edges: 0,
    exported: 1,
    files: 1,
    findings: {},
    flows: {},
    lines: { blank: 0, code: 3, total: 3 },
};

const SLUG_SAFE = "abcdefghijklmnopqrstuvwxyz0123456789";

const slug = function slug(path: string): string {
    let out = "";
    for (let at = 0; at < path.length; at += 1) {
        const char = path.charAt(at);
        out += SLUG_SAFE.includes(char) ? char : "-";
    }
    return out;
};

const lineSuffix = function lineSuffix(line: number | null): string {
    return line === null ? "" : `:${String(line)}`;
};

const TOOLS: SourceTools = {
    definitionAnchor: "definition-",
    fileId: (path) => `file-${slug(path)}`,
    languageOf: () => "typescript",
    lineInfix: ":",
    localPath: (path) => path.slice(path.indexOf("~") + 1),
    nodeHref: (path, line) => `/anatomy/build#file-${slug(path)}${lineSuffix(line)}`,
};

const file = function file(path: string, calls: readonly string[]): AnatomyFile {
    return {
        definitions: [
            {
                callable: true,
                callees: calls.map((target) => ({ file: target, id: `${target}#x`, name: "x" })),
                callers: [],
                exported: true,
                file: path,
                flow: "entry",
                id: `${path}#run`,
                inDegree: 0,
                kind: "function",
                line: 1,
                local: false,
                name: "run",
                outDegree: calls.length,
            },
        ],
        distribution: { invariants: [], variants: [] },
        document: null,
        findings: [],
        generated: false,
        id: path,
        inherited: false,
        layer: "processing",
        name: path.slice(path.lastIndexOf("/") + 1),
        path,
        slots: null,
        source: "source.a.generated.txt",
        stats: STATS,
        walk: null,
    };
};

const folder = function folder(files: readonly AnatomyFile[]): AnatomyFolder {
    return {
        files,
        findings: [],
        folders: [],
        id: "root",
        layer: null,
        name: "",
        path: "",
        role: "member",
        stats: STATS,
        walk: null,
    };
};

const snapshot = function snapshot(files: readonly AnatomyFile[]): AnatomySnapshot {
    const metrics = {
        callable: 0,
        definitions: 0,
        edges: 0,
        exported: 0,
        findings: {},
        flows: {},
        maxInDegree: 0,
        maxOutDegree: 0,
        resolutionRate: 1,
        unresolvedCalls: 0,
    };
    return { charts: [], findings: [], imports: [], metrics, states: [], tree: folder(files), unresolvedCalls: [] };
};

const TREE = {
    label: "Build",
    snapshot: snapshot([file("build~core/a.ts", ["build~core/b.ts"]), file("build~core/b.ts", [])]),
    tab: "build",
};

describe("summaryOf", () => {
    it("counts a file's lines of code and definitions, with the plural only past one", () => {
        expect(summaryOf({ definitions: [], stats: STATS })).toBe("3 lines of code and 0 definitions.");
        expect(summaryOf(file("a.ts", []))).toBe("3 lines of code and 1 definition.");
    });
});

describe("canonicalOf", () => {
    it("drops a line from a file anchor and maps a definition anchor to its file", () => {
        const canonical = canonicalOf(SITE, TOOLS);
        expect(canonical(`${SITE}/anatomy/build#file-x:12`)).toBe("/anatomy/build#file-x");
        expect(canonical("/anatomy/build#definition-run:build~core/a.ts")).toBe("/anatomy/build#file-build-core-a-ts");
        expect(canonical("/pag/guide#setup")).toBe("/pag/guide#setup");
    });
});

describe("sourceFiles and sourceLeaves", () => {
    it("addresses every file by its member-relative path and links the files it uses and is used by", async () => {
        const files = sourceFiles([TREE], TOOLS);
        expect(files.map((entry) => entry.identity.address.json)).toStrictEqual([
            "/json/source/build/core/a.ts",
            "/json/source/build/core/b.ts",
        ]);
        const linker = createLinker(
            files.map((entry) => entry.identity),
            SITE,
            canonicalOf(SITE, TOOLS),
        );
        const placements = placementsOf(
            sourceIndexPlans(files, TOOLS.localPath).trees,
            files.map((entry) => entry.identity),
            SITE,
        );
        const leaves = await sourceLeaves(files, {
            checks: () => [],
            folder: (ref) =>
                ref === files[0]?.identity.ref
                    ? { containedIn: linker.link("root", files[1]?.identity.ref ?? ""), contains: [] }
                    : null,
            grounds: async () => {
                await Promise.resolve();
                return [];
            },
            linkedBy: (ref) =>
                ref === files[0]?.identity.ref ? [linker.link("core/b.ts", files[1]?.identity.ref ?? "")] : [],
            linker,
            placement: (ref) => placements.get(ref) ?? null,
            textOf: () => "export const run = 1;",
            tools: TOOLS,
        });
        expect(leaves[0]?.data).toMatchObject({
            definitions: [{ name: "run", signature: "export const run = 1;" }],
            path: "core/a.ts",
            relations: [
                { links: [{ label: "root" }], relation: "contained-in" },
                { links: [{ label: "core/b.ts", markdown: `${SITE}/source/build/core/b.ts.md` }], relation: "uses" },
                { links: [{ label: "core/b.ts" }], relation: "linked-from" },
            ],
            siblings: { next: { label: "core/b.ts" }, previous: null },
            text: `${SITE}/source/build/core/a.ts.txt`,
            tree: "build",
            up: { json: `${SITE}/json/api/source/build`, ref: "api:source/build" },
        });
        expect(leaves[0]?.markdown).toContain("## Uses");
        expect(leaves[1]?.data).toMatchObject({ siblings: { next: null, previous: { label: "core/a.ts" } } });
        expect(JSON.stringify(leaves[1]?.data)).not.toContain("contained-in");
        expect(leaves[0]?.text).toStrictEqual({
            address: "/source/build/core/a.ts.txt",
            body: "export const run = 1;",
        });
        expect(leaves[0]?.markdown).toContain(`Source text: ${SITE}/source/build/core/a.ts.txt`);
        expect(leaves[0]?.markdown).toContain("```typescript\nexport const run = 1;\n```");
        expect(JSON.stringify(leaves.map((leaf) => leaf.data))).not.toContain("build~");
    });
});
