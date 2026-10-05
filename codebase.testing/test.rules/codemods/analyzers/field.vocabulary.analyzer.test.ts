import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { writeCanonicalJson, writeCanonicalText } from "@govlab/canonical-write";
import type { FieldScope } from "@ssot/govlab/types/field.types.ts";
import { join } from "node:path";
import { plainClosedValues } from "@ssot/govlab/codemods/analyzers/field.vocabulary.analyzer.ts";
import { tmpdir } from "node:os";

const TYPES_FILE = "types.generated.ts";
const READER_FILE = "reader.generated.ts";
const CONFIG_FILE = "tsconfig.generated.json";

const TYPES = [
    'export type Severity = "high" | "low";',
    "export interface Principle { severity: Severity; name: string }",
    "export interface View { severity: string; typed: Severity; name: string }",
].join("\n");

const READER = [
    'import type { Principle, View } from "./types.generated";',
    "export const one = (held: Principle): View => ({ name: held.name, severity: held.severity, typed: held.severity });",
    "export const many = (all: readonly Principle[]): View[] =>",
    "    all.map((held) => ({ name: held.name, severity: held.severity, typed: held.severity }));",
].join("\n");

let root = "";

const scope = function scope(): FieldScope {
    return {
        label: "probe",
        readerRoots: [join(root, READER_FILE)],
        roots: [{ file: join(root, TYPES_FILE), name: "Principle" }],
        tsconfig: join(root, CONFIG_FILE),
        typeRoots: [join(root, TYPES_FILE)],
    };
};

beforeEach(async () => {
    root = mkdtempSync(join(tmpdir(), "closed-"));
    await writeCanonicalText(join(root, TYPES_FILE), TYPES);
    await writeCanonicalText(join(root, READER_FILE), READER);
    await writeCanonicalJson(join(root, CONFIG_FILE), {
        compilerOptions: { module: "esnext", noEmit: true, strict: true, target: "es2022" },
    });
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("plainClosedValues", () => {
    it("reports a closed value handed to a plain string field, directly and inside a map callback", () => {
        const found = plainClosedValues(scope());
        expect(found.map((value) => `${value.target} ${value.vocabulary}`)).toStrictEqual([
            "View.severity Severity",
            "View.severity Severity",
        ]);
        expect(new Set(found.map((value) => value.line)).size).toBe(2);
    });

    it("passes a closed value handed to a field typed by its vocabulary, and a plain value handed to a string", () => {
        const found = plainClosedValues(scope());
        expect(found.some((value) => value.target === "View.typed" || value.target === "View.name")).toBe(false);
    });
});
