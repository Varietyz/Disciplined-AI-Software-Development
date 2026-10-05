import { absolutePath, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { GENERATED_MARK_PREFIX } from "@govlab/canonical-write";
import { renderChartsFor } from "@govlab/docs/core/coordinators/figure.coordinator.ts";
import { validateCharts } from "@govlab/docs/core/validators/diagram.validator.ts";

const CHART_TIMEOUT_MS = 60_000;

describe("renderChartsFor", () => {
    it(
        "renders a module's charts that parse clean, trace to source and repeat byte for byte",
        async () => {
            const dir = absolutePath("govlab.context");
            const charts = await renderChartsFor(dir, "govlab.context");
            const content = charts?.content ?? "";
            expect(content).toContain("```mermaid");
            expect(content).toContain("| Node | Source |");
            expect(content).not.toContain(GENERATED_MARK_PREFIX);
            expect((await validateCharts(content)).findings).toStrictEqual([]);
            expect((await renderChartsFor(dir, "govlab.context"))?.content).toBe(content);
        },
        CHART_TIMEOUT_MS,
    );

    it("renders nothing for a folder with no package and no source", async () => {
        expect(await renderChartsFor(absolutePath("docArch"), relativePath("docArch"))).toBeNull();
    });
});
