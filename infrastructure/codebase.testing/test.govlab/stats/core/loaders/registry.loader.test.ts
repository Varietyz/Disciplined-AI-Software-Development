import { describe, expect, it } from "vitest";
import { BARE } from "./stats.fixture.ts";
import { DISPOSITION } from "@govlab/stats/configuration/constants/rule.constants.ts";
import { ROOT } from "@ssot/paths";
import { readRegistry } from "@govlab/stats/core/loaders/registry.loader.ts";

describe("readRegistry", () => {
    it("counts the install registry by disposition", () => {
        const registry = readRegistry(ROOT);
        expect(registry.fullGate.length + registry.advisory + registry.selectable + registry.excluded).toBeGreaterThan(
            0,
        );
        expect(Object.values(DISPOSITION)).toContain("full-gate");
    });

    it("counts nothing where no registry exists", () => {
        expect(readRegistry(BARE).fullGate).toStrictEqual([]);
    });
});
