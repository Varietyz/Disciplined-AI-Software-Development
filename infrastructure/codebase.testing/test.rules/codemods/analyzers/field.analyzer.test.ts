import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { writeCanonicalJson, writeCanonicalText } from "@govlab/canonical-write";
import type { FieldScope } from "@ssot/govlab/types/field.types.ts";
import { join } from "node:path";
import { scopeReach } from "@ssot/govlab/codemods/analyzers/field.analyzer.ts";
import { tmpdir } from "node:os";

const TYPES = [
    "export interface Inner { deep: number; skipped: number }",
    "export interface Carried { kept: string; dropped: string }",
    "export interface Root { read: string; unread: string; nested: Inner[]; spread: Carried }",
    "export interface View { kept: string }",
].join("\n");

const TYPES_FILE = "types.generated.ts";
const READER_FILE = "reader.generated.ts";
const CONFIG_FILE = "tsconfig.generated.json";

const READER = [
    'import type { Root, View } from "./types.generated";',
    "export const use = (root: Root): readonly unknown[] => [",
    "    root.read,",
    "    root.nested.map(({ deep }) => deep),",
    "    ((): View => ({ ...root.spread }))(),",
    "];",
].join("\n");

let root = "";

const scope = function scope(roots: FieldScope["roots"]): FieldScope {
    return {
        label: "probe",
        readerRoots: [join(root, READER_FILE)],
        roots,
        tsconfig: join(root, CONFIG_FILE),
        typeRoots: [join(root, TYPES_FILE)],
    };
};

beforeEach(async () => {
    root = mkdtempSync(join(tmpdir(), "field-"));
    await writeCanonicalText(join(root, TYPES_FILE), TYPES);
    await writeCanonicalText(join(root, READER_FILE), READER);
    await writeCanonicalJson(join(root, CONFIG_FILE), {
        compilerOptions: { module: "esnext", noEmit: true, strict: true, target: "es2022" },
    });
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("scopeReach", () => {
    it("collects every field reachable from the root and marks the ones a reader reads", () => {
        const reach = scopeReach(scope([{ file: join(root, TYPES_FILE), name: "Root" }]));
        const unread = reach.fields.map((field) => field.key).filter((key) => !reach.read.has(key));
        expect(reach.fields.map((field) => field.key).sort()).toStrictEqual([
            "Carried.dropped",
            "Carried.kept",
            "Inner.deep",
            "Inner.skipped",
            "Root.nested",
            "Root.read",
            "Root.spread",
            "Root.unread",
        ]);
        expect(unread.sort()).toStrictEqual(["Carried.dropped", "Inner.skipped", "Root.unread"]);
        expect(reach.missingRoots).toStrictEqual([]);
    });

    it("names a root the file does not declare, and collects no field from it", () => {
        const gone = { file: join(root, TYPES_FILE), name: "Gone" };
        const reach = scopeReach(scope([gone]));
        expect(reach.missingRoots).toStrictEqual([gone]);
        expect(reach.fields).toStrictEqual([]);
    });
});
