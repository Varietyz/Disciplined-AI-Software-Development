import { describe, expect, it } from "vitest";
import { replacementText, scanSourceFile } from "@ssot/govlab/codemods/analyzers/increment.analyzer.ts";
import type { IncrementFinding as Finding } from "@ssot/govlab/types/analyzer.types.ts";
import ts from "typescript";

const scan = function scan(code: string): Finding[] {
    return scanSourceFile(ts.createSourceFile("probe.ts", code, ts.ScriptTarget.Latest, true));
};

describe("scanSourceFile", () => {
    it("finds a statement-position increment and marks it convertible", () => {
        const [finding] = scan("let n = 0;\nn++;");
        expect(finding?.reason).toBeNull();
        expect(finding?.operand).toBe("n");
        expect(finding?.operator).toBe("+=");
        expect(finding?.line).toBe(2);
    });

    it("finds a decrement and carries its operator", () => {
        const [finding] = scan("let n = 0;\nn--;");
        expect(finding?.operator).toBe("-=");
    });

    it("treats a for-loop incrementor as convertible", () => {
        const [finding] = scan("for (let i = 0; i < 3; i++) { use(i); }");
        expect(finding?.reason).toBeNull();
    });

    it("blocks an increment whose value is read, since the rewrite would change what it evaluates to", () => {
        const [finding] = scan("let n = 0;\nconst m = n++;");
        expect(finding?.reason).toContain("value is read");
    });

    it("blocks an element access, since the rewrite would evaluate the index twice", () => {
        const [finding] = scan("const xs = [0];\nxs[index()]++;");
        expect(finding?.reason).toContain("evaluate the index expression twice");
    });

    it("blocks an operand that is not a simple reference", () => {
        const [finding] = scan("(a as number)++;");
        expect(finding?.reason).toBe("operand is not a simple reference");
    });

    it("accepts a property access as a simple reference", () => {
        const [finding] = scan("const o = { n: 0 };\no.n++;");
        expect(finding?.reason).toBeNull();
        expect(finding?.operand).toBe("o.n");
    });

    it("finds nothing in source with no update expression", () => {
        expect(scan("let n = 0;\nn += 1;")).toStrictEqual([]);
    });
});

describe("replacementText", () => {
    it("composes the compound-assignment rewrite", () => {
        const [finding] = scan("let n = 0;\nn++;");
        expect(finding === undefined ? "" : replacementText(finding)).toBe("n += 1");
    });

    it("composes the decrement rewrite", () => {
        const [finding] = scan("let n = 0;\nn--;");
        expect(finding === undefined ? "" : replacementText(finding)).toBe("n -= 1");
    });
});
