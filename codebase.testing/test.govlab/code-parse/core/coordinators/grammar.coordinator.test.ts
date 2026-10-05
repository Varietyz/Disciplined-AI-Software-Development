import {
    EXTENSION_MAP_FILE,
    EXTENSION_MAP_INDENT,
} from "@govlab/code-parse/configuration/constants/grammar.constants.ts";
import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { buildGrammars } from "@govlab/code-parse/core/coordinators/grammar.coordinator.ts";
import { fetchGrammarPackage } from "@govlab/code-parse/core/adapters/remote.adapter.ts";
import { join } from "node:path";
import { runCommand } from "@govlab/code-parse/core/adapters/shell.adapter.ts";
import { tmpdir } from "node:os";
import { writeExtensionMap } from "@govlab/code-parse/core/persistence/source.persistence.ts";

const isExtensionMap = function isExtensionMap(value: unknown): value is Record<string, string[]> {
    return typeof value === "object" && value !== null && Object.values(value).every(Array.isArray);
};

const withTemp = function withTemp(body: (dir: string) => void): void {
    const dir = mkdtempSync(join(tmpdir(), "grammar-build-test-"));
    try {
        body(dir);
    } finally {
        rmSync(dir, { force: true, recursive: true });
    }
};

describe("buildGrammars", () => {
    it("skips an unsupported source and hands the writer an empty map", async () => {
        const written: Record<string, string[]>[] = [];
        const passed = await buildGrammars([{ lang: "none", unsupported: "no wasm target" }], async (map) => {
            written.push(map);
            return join(tmpdir(), EXTENSION_MAP_FILE);
        });
        expect(passed).toBe(true);
        expect(written).toStrictEqual([{}]);
    });
});

describe("runCommand", () => {
    it("runs a command in a folder and throws when it fails", () => {
        withTemp((dir) => {
            expect(() => {
                runCommand("node", ["-e", "0"], dir);
            }).not.toThrow();
            expect(() => {
                runCommand("node", ["-e", "process.exit(3)"], dir);
            }).toThrow();
        });
    });
});

describe("fetchGrammarPackage", () => {
    it("answers the failure instead of throwing when the package cannot be fetched", () => {
        withTemp((dir) => {
            const outcome = fetchGrammarPackage({ lang: "none", npm: join(dir, "absent") }, join(dir, "work"));
            expect("error" in outcome).toBe(true);
        });
    });
});

describe("writeExtensionMap", () => {
    it("rewrites the committed map byte for byte from its own parse", async () => {
        const target = absolutePath("govlab.utils.codeParse.generated", EXTENSION_MAP_FILE);
        const before = readFileSync(target, "utf8");
        const parsed: unknown = JSON.parse(before);
        expect(isExtensionMap(parsed)).toBe(true);
        expect(await writeExtensionMap(isExtensionMap(parsed) ? parsed : {})).toBe(target);
        expect(readFileSync(target, "utf8")).toBe(before);
        expect(before.split("\n").at(1)?.startsWith(" ".repeat(EXTENSION_MAP_INDENT))).toBe(true);
    });
});
