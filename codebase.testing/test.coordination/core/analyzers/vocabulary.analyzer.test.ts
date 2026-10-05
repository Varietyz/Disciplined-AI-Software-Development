import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { declaredIn } from "coordination-surface/tools/core/analyzers/vocabulary.analyzer.ts";
import { lifetime } from "coordination-surface/config/surface.config.ts";

const row = function row(...cells: readonly string[]): string {
    return `| ${cells.join(" | ")} |`;
};

describe("declaredIn", () => {
    it("reads each lifetime value a table declares under the axis and value columns, and skips the set and prose", () => {
        const [frozen = ""] = lifetime.values.mutability;
        const source = [
            row(lifetime.columns.axis, lifetime.columns.value),
            row("mutability", `\`${frozen}\``),
            row("removal", lifetime.values.removal.join(" · ")),
            row("retention", "as long as the venue stands"),
            row("color", "blue"),
            "",
            row("mutability", frozen),
        ].join("\n");
        assert.deepEqual(declaredIn(source), [{ axis: "mutability", line: 2, value: frozen }]);
    });
});
