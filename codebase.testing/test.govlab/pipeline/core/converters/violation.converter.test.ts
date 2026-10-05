import {
    buildViolations,
    parseViolations,
    splitOnGaps,
    stripAnsi,
    withoutTrailingReturn,
} from "@govlab/pipeline/core/converters/violation.converter.ts";
import { describe, expect, it } from "vitest";
import type { StepOutput } from "@govlab/pipeline/types/report.types.ts";

const ESCAPE_CODE_POINT = 27;
const ESC = String.fromCodePoint(ESCAPE_CODE_POINT);
const STEP = "lint";
const FILE = "src/a.ts";
const LABEL = "verify-codebase";
const STAMP = "2026-01-01T00:00:00.000Z";
const FINDING = "src/b.ts\n  1:1  error  broke  some/rule\n";
const OTHER_FINDING = "src/a.ts\n  2:2  error  also broke  some/rule\n";

const output = function output(over: Partial<StepOutput> = {}): StepOutput {
    return { label: "Lint", ok: false, out: "", stage: "linting", ...over };
};

describe("stripAnsi", () => {
    it("removes a color sequence and keeps the text around it", () => {
        expect(stripAnsi(`${ESC}[2mdim${ESC}[0m text`)).toBe("dim text");
    });

    it("keeps an escape that is not a terminated color sequence", () => {
        expect(stripAnsi(`${ESC}[2Kline`)).toBe(`${ESC}[2Kline`);
    });

    it("leaves plain text untouched", () => {
        expect(stripAnsi("no escapes here")).toBe("no escapes here");
    });
});

describe("withoutTrailingReturn", () => {
    it("drops a single trailing carriage return", () => {
        expect(withoutTrailingReturn("text\r")).toBe("text");
    });

    it("leaves a carriage return that is not trailing", () => {
        expect(withoutTrailingReturn("a\rb")).toBe("a\rb");
    });
});

describe("splitOnGaps", () => {
    it("splits on runs of two or more spaces and keeps single spaces inside a part", () => {
        expect(splitOnGaps("3:7  error  a real message  some/rule")).toStrictEqual([
            "3:7",
            "error",
            "a real message",
            "some/rule",
        ]);
    });

    it("returns one part when no gap is wide enough", () => {
        expect(splitOnGaps("one two three")).toStrictEqual(["one two three"]);
    });

    it("returns nothing for whitespace alone", () => {
        expect(splitOnGaps("     ")).toStrictEqual([]);
    });
});

describe("parseViolations", () => {
    it("groups findings under the file header that precedes them", () => {
        const parsed = parseViolations(`${FILE}\n  3:7  error  broke a thing  some/rule\n`, STEP);
        expect(parsed.matched).toBe(true);
        expect([...parsed.files.keys()]).toStrictEqual([FILE]);
        expect(parsed.files.get(FILE)).toStrictEqual([
            { column: 7, line: 3, message: "broke a thing", rule: "some/rule", severity: "error", step: STEP },
        ]);
    });

    it("reads a header and its findings through terminal color codes", () => {
        const colored = `${ESC}[4m${FILE}${ESC}[0m\n  1:1  ${ESC}[31merror${ESC}[0m  broke  some/rule\n`;
        expect(parseViolations(colored, STEP).files.get(FILE)?.[0]?.severity).toBe("error");
    });

    it("reports no match when the output carries no file header", () => {
        expect(parseViolations("nothing that looks like a finding\n", STEP).matched).toBe(false);
    });

    it("ignores an indented line whose position is not a line number", () => {
        expect(parseViolations(`${FILE}\n  summary  of the run\n`, STEP).matched).toBe(false);
    });

    it("keeps a message with no trailing rule id instead of reading the message as the rule", () => {
        const parsed = parseViolations(`${FILE}\n  2:4  error  just a message\n`, STEP);
        expect(parsed.files.get(FILE)?.[0]).toStrictEqual({
            column: 4,
            line: 2,
            message: "just a message",
            rule: "",
            severity: "error",
            step: STEP,
        });
    });
});

describe("buildViolations", () => {
    it("skips a passing step, so a green step contributes nothing", () => {
        const artifact = buildViolations([output({ ok: true, out: FINDING })], LABEL, null, STAMP);
        expect(artifact.totals).toStrictEqual({ files: 0, violations: 0 });
    });

    it("sorts files by path so the artifact is stable across runs", () => {
        const artifact = buildViolations(
            [output({ out: FINDING }), output({ label: "Lint two", out: OTHER_FINDING })],
            LABEL,
            null,
            STAMP,
        );
        expect(Object.keys(artifact.files)).toStrictEqual(["src/a.ts", "src/b.ts"]);
    });

    it("merges findings that two steps report against one file", () => {
        const artifact = buildViolations(
            [output({ out: FINDING }), output({ label: "Lint two", out: FINDING })],
            LABEL,
            null,
            STAMP,
        );
        expect(artifact.files["src/b.ts"]).toHaveLength(2);
        expect(artifact.totals).toStrictEqual({ files: 1, violations: 2 });
    });

    it("records unparsable output under its step", () => {
        const artifact = buildViolations([output({ out: "  a crash trace  \n" })], LABEL, null, STAMP);
        expect(artifact.unparsed["Lint"]).toBe("a crash trace");
        expect(artifact.totals.files).toBe(0);
    });

    it("carries the label, the stamp and the stopping point through unchanged", () => {
        const artifact = buildViolations([], LABEL, "linting", STAMP);
        expect(artifact.label).toBe(LABEL);
        expect(artifact.generatedAt).toBe(STAMP);
        expect(artifact.stoppedAt).toBe("linting");
    });
});
