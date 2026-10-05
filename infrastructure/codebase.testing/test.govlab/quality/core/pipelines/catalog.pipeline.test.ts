import type { CatalogStep, CatalogWriter } from "@govlab/quality/types/catalog.types.ts";
import { describe, expect, it } from "vitest";
import { discoverSteps, orderSteps, runSteps } from "@govlab/quality/core/pipelines/catalog.pipeline.ts";

const noWrite = async (): Promise<void> => {
    await Promise.resolve();
};

const WRITER: CatalogWriter = { json: noWrite, markdown: noWrite, text: noWrite };

const step = function step(name: string, needs: CatalogStep["needs"], gives: CatalogStep["gives"]): CatalogStep {
    return {
        gives,
        name,
        needs,
        run: async () => {
            await Promise.resolve();
            return Object.fromEntries(gives.map((key) => [key, [{ ruleId: name }]]));
        },
    };
};

describe("orderSteps", () => {
    it("orders each step after the steps that give what it needs", () => {
        const ordered = orderSteps([step("index", ["classified"], ["catalog"]), step("classify", [], ["classified"])]);
        expect(ordered.map((entry) => entry.name)).toStrictEqual(["classify", "index"]);
    });

    it("refuses a need no step gives, a key two steps give and a cycle", () => {
        expect(() => orderSteps([step("a", ["rules"], [])])).toThrow("needs");
        expect(() => orderSteps([step("a", [], ["rules"]), step("b", [], ["rules"])])).toThrow("both give");
        expect(() => orderSteps([step("a", ["rules"], ["catalog"]), step("b", ["catalog"], ["rules"])])).toThrow(
            "cycle",
        );
    });
});

describe("runSteps and discoverSteps", () => {
    it("runs the ordered steps over one shared state and writes one line per step", async () => {
        const lines: string[] = [];
        const state = await runSteps(
            [step("index", ["classified"], ["catalog"]), step("classify", [], ["classified"])],
            WRITER,
            (line) => {
                lines.push(line);
            },
        );
        expect(state.catalog).toStrictEqual([{ ruleId: "index" }]);
        expect(lines).toHaveLength(2);
    });

    it("discovers every registered catalog step", async () => {
        expect((await discoverSteps()).length).toBeGreaterThan(0);
    });
});
