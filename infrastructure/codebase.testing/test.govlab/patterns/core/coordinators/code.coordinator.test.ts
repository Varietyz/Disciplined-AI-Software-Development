import { describe, expect, it } from "vitest";
import { definition } from "../analyzers/code.fixture.ts";
import { diagnose } from "@govlab/patterns/core/coordinators/code.coordinator.ts";

describe("diagnose", () => {
    it("gathers every detector's findings, most relevant first", () => {
        const graph = {
            edges: [
                { file: "a.ts", from: "a.ts::x", line: 1, to: "b.ts::y" },
                { file: "b.ts", from: "b.ts::y", line: 1, to: "a.ts::x" },
            ],
            external: [],
        };
        const findings = diagnose([definition("x", "a.ts"), definition("y", "b.ts"), definition("orphan", "c.ts")], {
            graph,
            records: [],
            testUses: new Set(["x", "y"]),
        });
        expect(findings.map((finding) => finding.kind)).toStrictEqual(["call-cycle", "dead-code"]);
    });
});
