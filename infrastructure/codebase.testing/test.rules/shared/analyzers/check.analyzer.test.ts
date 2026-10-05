import { DECLARING_CALLEE, declarationsIn } from "@ssot/govlab/shared/analyzers/check.analyzer.ts";
import { checksLine, unreadableDeclaration } from "@ssot/govlab/shared/strings/rule.strings.ts";
import { describe, expect, it } from "vitest";
import type { ReadDeclaration } from "@ssot/govlab/types/check.types.ts";

describe("declarationsIn", () => {
    it("reads each declaration's string-literal refs, wherever the call sits", () => {
        const text = [
            `${DECLARING_CALLEE}({ detects: ["a:b"], enforces: [] });`,
            `export default { meta: { docs: { checks: ${DECLARING_CALLEE}({ detects: [], enforces: ["c:d"] }) } } };`,
        ].join("\n");
        const expected: readonly ReadDeclaration[] = [
            { detects: ["a:b"], enforces: [] },
            { detects: [], enforces: ["c:d"] },
        ];
        expect(declarationsIn("probe.ts", text)).toStrictEqual(expected);
    });

    it("reads a declaration it cannot resolve statically as unreadable", () => {
        expect(declarationsIn("probe.ts", `${DECLARING_CALLEE}({ detects: REFS, enforces: [] });`)).toStrictEqual([
            null,
        ]);
        expect(unreadableDeclaration("probe.ts", DECLARING_CALLEE)).toContain("the index cannot read");
        expect(checksLine(2, "index.json")).toContain("indexed 2 check declaration(s)");
    });
});
