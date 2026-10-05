import type { CodemodFinding, CodemodSpec, Edit } from "@ssot/govlab/types/codemod.types.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { applyCodemod, refuse } from "@ssot/govlab/codemods/selectors/codemod.selector.ts";
import { ROOT_REQUIRED } from "@ssot/govlab/codemods/strings/codemod.strings.ts";

const specFor = function specFor(
    findings: readonly CodemodFinding[],
    gateOnBlocked: boolean,
): CodemodSpec<CodemodFinding> {
    return {
        appliedNoun: "rewrite(s)",
        blockedMessage: (finding) => `blocked: ${finding.reason ?? ""}`,
        checks: { detects: [], enforces: [] },
        editsByFile: () => new Map<string, Edit[]>(),
        findings,
        gateOnBlocked,
        label: (finding) => finding.file,
        programCount: 1,
        ruleId: "probe-codemod",
    };
};

const CONVERTIBLE: CodemodFinding = { file: "a.ts", line: 1, reason: null };
const BLOCKED: CodemodFinding = { file: "b.ts", line: 2, reason: "not mechanically rewritable" };

interface StdoutSpy {
    mock: { calls: unknown[][] };
    mockRestore: () => void;
}

const captureStdout = function captureStdout(): StdoutSpy {
    return vi.spyOn(process.stdout, "write").mockImplementation(() => true);
};

const written = function written(spy: StdoutSpy): string {
    return spy.mock.calls.map((call) => String(call[0])).join("");
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("applyCodemod", () => {
    it("reports what it applied when nothing is blocked", () => {
        const out = captureStdout();
        applyCodemod(specFor([CONVERTIBLE], true));
        expect(written(out)).toContain("probe-codemod: applied 0 rewrite(s) across 1 program(s)");
    });

    it("surfaces a blocked finding without gating when the codemod does not gate", () => {
        const out = captureStdout();
        const err = vi.spyOn(console, "error").mockImplementation(() => {});
        applyCodemod(specFor([CONVERTIBLE, BLOCKED], false));
        const logged = written(out);
        expect(logged).toContain("b.ts:2 [probe-codemod] blocked: not mechanically rewritable");
        expect(logged).toContain("left as written");
        expect(err).not.toHaveBeenCalled();
    });

    it("gates on a blocked finding when the codemod declares the construct genuinely unsafe", () => {
        captureStdout();
        const err = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        const exit = vi.spyOn(process, "exit").mockImplementation((): never => {
            throw new Error("exited");
        });
        expect(() => {
            applyCodemod(specFor([BLOCKED], true));
        }).toThrow("exited");
        expect(exit).toHaveBeenCalledWith(1);
        expect(err.mock.calls.flat().join("\n")).toContain("resolve them by hand");
    });

    it("refuses a run with its reason and a failing exit", () => {
        const err = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        vi.spyOn(process, "exit").mockImplementation((): never => {
            throw new Error("exited");
        });
        expect(() => refuse(ROOT_REQUIRED)).toThrow("exited");
        expect(err.mock.calls.flat().join("\n")).toContain(`REFUSED: ${ROOT_REQUIRED}`);
    });

    it("treats a finding carrying no reason as convertible", () => {
        const out = captureStdout();
        applyCodemod(specFor([CONVERTIBLE], true));
        expect(written(out)).not.toContain("blocked");
    });
});
