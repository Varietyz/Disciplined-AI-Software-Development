import { defineTool, registeredTools } from "@govlab/quality/core/registries/tool.registry.ts";
import { expect, test } from "vitest";

test("defineTool registers a runner by tool name and registeredTools lists it", () => {
    const runner = defineTool({
        ecosystems: ["test"],
        run: () => ({ findings: [], fixedCount: 0, output: "" }),
        tool: "zz-probe",
    });
    expect(registeredTools()).toContain(runner);
    const names = registeredTools().map((entry) => entry.tool);
    expect(names).toStrictEqual(names.toSorted((a, b) => a.localeCompare(b)));
});
