import { expect, test } from "vitest";
import { gatingAdvisory, quietGatingAdvisory, toolAdvisory } from "@govlab/quality/core/factories/tool.factory.ts";
import type { RunnerContext } from "@govlab/quality/types/tool.types.ts";

const context: RunnerContext = { ecosystem: "go", fix: false, languageId: "go", paths: [], root: "/repo" };

test("toolAdvisory builds a plain advisory context and the gating variants add their failure policy", () => {
    expect(toolAdvisory(context, "gosec", "hint")).toStrictEqual({
        ecosystem: "go",
        installHint: "hint",
        root: "/repo",
        tool: "gosec",
    });
    expect(gatingAdvisory(context, "gosec", "hint")).toMatchObject({ failureSeverity: "error", gating: true });
    expect(quietGatingAdvisory(context, "gosec", "hint").notInstalledOutput).toBe("gosec is not installed.");
});
