import { describe, expect, it } from "vitest";
import { loadValidators, runValidators } from "@govlab/quality/core/coordinators/validation.coordinator.ts";
import type { ProjectValidator } from "@govlab/quality/types/validation.types.ts";
import { projectFinding } from "@govlab/quality/core/factories/finding.factory.ts";

const VALIDATOR_COUNT = 8;
const TWO = 2;

const validators = await loadValidators();
const duplicates = validators.filter((validator) => validator.id === "constant-duplicates");

const runDuplicates = function runDuplicates(contents: Record<string, string>): ReturnType<typeof runValidators> {
    return runValidators({
        consumers: [],
        files: Object.keys(contents),
        readFile: (path) => contents[path] ?? "",
        validators: duplicates,
    });
};

const probe = function probe(
    appliesTo: ProjectValidator["appliesTo"],
    validate: ProjectValidator["validate"],
): ProjectValidator {
    return { appliesTo, id: "probe", meta: { canonical: [], description: "probe" }, validate };
};

const lockedRead = function lockedRead(): string {
    throw Object.assign(new Error("EACCES"), { code: "EACCES" });
};

describe("loadValidators", () => {
    it("discovers every self-registering project validator with a unique id", () => {
        expect(validators).toHaveLength(VALIDATOR_COUNT);
        expect(new Set(validators.map((validator) => validator.id)).size).toBe(VALIDATOR_COUNT);
    });
});

describe("runValidators", () => {
    it("is clean and says so when no validator reports", () => {
        const result = runValidators({ consumers: [], files: [], readFile: () => "", validators: [] });
        expect(result.clean).toBe(true);
        expect(result.panel).toContain("✓ Quality gate: CLEAN");
    });

    it("hands each validator only the files and consumer files whose extension it applies to", () => {
        const seen: string[] = [];
        const reached: string[] = [];
        const validator = probe(["ts"], (files, consumers) => {
            seen.push(...files.map((file) => file.path));
            reached.push(...consumers.map((file) => file.path));
            return [];
        });
        runValidators({
            consumers: ["c.ts", "d.css"],
            files: ["a.ts", "b.css"],
            readFile: () => "x",
            validators: [validator],
        });
        expect(seen).toEqual(["a.ts"]);
        expect(reached).toEqual(["c.ts"]);
    });

    it("skips a file that vanished and renders a finding's suggestion", () => {
        const validator = probe("*", (files) =>
            files.map((file) => projectFinding({ file: file.path, message: "m", ruleId: "r", suggestion: "split it" })),
        );
        const result = runValidators({
            consumers: [],
            files: ["gone.ts", "kept.ts"],
            readFile: (path) => {
                if (path === "gone.ts") {
                    throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
                }
                return "x";
            },
            validators: [validator],
        });
        expect(result.findings.map((finding) => finding.file)).toEqual(["kept.ts"]);
        expect(result.clean).toBe(false);
        expect(result.panel).toContain("→ AIAction: split it");
    });

    it("surfaces a read failure other than a missing file", () => {
        expect(() =>
            runValidators({ consumers: [], files: ["locked.ts"], readFile: lockedRead, validators: [] }),
        ).toThrow("EACCES");
    });
});

describe("the constant-duplicate validator through the runner", () => {
    it("flags a constant defined in multiple files", () => {
        const result = runDuplicates({
            "a.ts": "export const MAX_RETRIES = 3;\nconst local = 1;",
            "b.ts": "const MAX_RETRIES = 3;",
            "c.ts": "const other = 9;",
        });
        expect(result.findings).toHaveLength(TWO);
        expect(result.findings.every((finding) => finding.message.includes("MAX_RETRIES"))).toBe(true);
        expect(new Set(result.findings.map((finding) => finding.file))).toEqual(new Set(["a.ts", "b.ts"]));
    });

    it("does not flag lowercase or single-site constants", () => {
        const result = runDuplicates({
            "a.ts": "const timeout = 5;\nexport const ONLY_HERE = 1;",
            "b.ts": "const timeout = 5;",
        });
        expect(result.findings).toEqual([]);
    });

    it("exempts a name carrying different values across files", () => {
        const result = runDuplicates({
            "a.ts": 'export const PREMISE = "admin";',
            "b.ts": 'export const PREMISE = "public";',
            "c.ts": 'export const PREMISE = "admin";',
        });
        expect(result.findings).toEqual([]);
    });

    it("exempts a location-relative constant", () => {
        const result = runDuplicates({
            "a.ts": "const HERE = import.meta.dirname;",
            "b.ts": "const HERE = import.meta.dirname;",
        });
        expect(result.findings).toEqual([]);
    });

    it("exempts an environment-relative read", () => {
        const read = 'const PIN_SECRET = process.env["CREDENTIALS_MASTER_KEY"];';
        expect(runDuplicates({ "a.ts": read, "b.ts": read }).findings).toEqual([]);
    });

    it("distinguishes distinct multi-line array literals sharing a name", () => {
        const result = runDuplicates({
            "a.ts": 'const SPECIMEN = [\n    "AaBbCc",\n    "0123456789 !@#$%&*()",\n];',
            "b.ts": 'const SPECIMEN = [\n    "AaBbCcDd",\n    "The quick brown fox",\n];',
        });
        expect(result.findings).toEqual([]);
    });

    it("flags identical multi-line object literals across files", () => {
        const tone = 'const TONE = {\n    high: "danger",\n    low: "muted",\n};';
        const result = runDuplicates({ "a.ts": tone, "b.ts": tone });
        expect(result.findings).toHaveLength(TWO);
        expect(result.findings.every((finding) => finding.message.includes("TONE"))).toBe(true);
    });
});
