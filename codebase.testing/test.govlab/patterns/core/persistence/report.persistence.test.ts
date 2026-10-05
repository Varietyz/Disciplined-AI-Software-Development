import {
    HEX_DIR,
    persistArtifacts,
    staleFiles,
    writeHexMaster,
    writeSvgCollection,
} from "@govlab/patterns/core/persistence/report.persistence.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { relativePath } from "@ssot/paths";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SVG_SUFFIX = ".generated.svg";
const MARKUP = "<svg/>";
const roots: string[] = [];

afterEach(() => {
    for (const root of roots.splice(0)) {
        rmSync(root, { force: true, recursive: true });
    }
});

const tempRoot = function tempRoot(): string {
    const root = mkdtempSync(join(tmpdir(), "pl-persist-"));
    roots.push(root);
    return root;
};

const quiet = function quiet(run: () => void): void {
    const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
        run();
    } finally {
        spy.mockRestore();
    }
};

const svgRoot = function svgRoot(existing: readonly string[]): { root: string; svgDir: string } {
    const root = tempRoot();
    const svgDir = join(root, relativePath("moduleInfo.svg"));
    mkdirSync(svgDir, { recursive: true });
    for (const name of existing) {
        writeVerbatim(join(svgDir, name), "<svg>stale</svg>\n");
    }
    return { root, svgDir };
};

describe("persistArtifacts", () => {
    it("writes each artifact and prunes the ones no longer generated", () => {
        const dir = tempRoot();
        persistArtifacts(dir, new Map([["code.generated.html", "A"]]));
        expect(readFileSync(join(dir, HEX_DIR, "code.generated.html"), "utf8")).toBe("A\n");
        persistArtifacts(dir, new Map([["src.generated.html", "B"]]));
        expect(existsSync(join(dir, HEX_DIR, "code.generated.html"))).toBe(false);
        expect(staleFiles(join(dir, HEX_DIR), new Set())).toStrictEqual(["src.generated.html"]);
    });
});

describe("writeSvgCollection", () => {
    it("writes one vector per page, named for its module and page", () => {
        const { root, svgDir } = svgRoot([]);
        quiet(() => {
            writeSvgCollection(root, [{ slug: "alpha", svgs: new Map([["overview", MARKUP]]) }], new Set(["alpha"]));
        });
        expect(readdirSync(svgDir)).toStrictEqual([`alpha__overview${SVG_SUFFIX}`]);
    });

    it("prunes a stale page of a module that ran and a page of an unknown module, and keeps the rest", () => {
        const { root, svgDir } = svgRoot([
            `alpha__gone${SVG_SUFFIX}`,
            `removed__x${SVG_SUFFIX}`,
            `beta__x${SVG_SUFFIX}`,
            "notes.txt",
        ]);
        quiet(() => {
            writeSvgCollection(root, [{ slug: "alpha", svgs: new Map() }], new Set(["alpha", "beta"]));
        });
        expect(readdirSync(svgDir).toSorted((a, b) => a.localeCompare(b))).toStrictEqual([
            `beta__x${SVG_SUFFIX}`,
            "notes.txt",
        ]);
    });
});

describe("writeHexMaster", () => {
    it("writes the master findings of every module that wrote its own", () => {
        const root = tempRoot();
        const master = join(root, "master.generated.json");
        quiet(() => {
            writeHexMaster(master, [{ dir: root, title: "mod" }]);
        });
        expect(readFileSync(master, "utf8")).toContain('"modules":0');
    });
});
