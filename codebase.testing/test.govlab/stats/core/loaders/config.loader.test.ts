import { BARE, INPUT } from "./stats.fixture.ts";
import {
    BASE_CONFIG,
    MEMBER_CONFIG,
    STRICT_FLAGS,
    UNSPECIFIED_TARGET,
} from "@govlab/stats/configuration/constants/config.constants.ts";
import { describe, expect, it } from "vitest";
import { collectTypescript } from "@govlab/stats/core/loaders/config.loader.ts";

describe("collectTypescript", () => {
    it("checks every workspace member for a project config and every strict flag at the base", () => {
        expect(INPUT.typescript.total).toBeGreaterThan(0);
        expect(INPUT.typescript.covered + INPUT.typescript.uncovered.length).toBe(INPUT.typescript.total);
        expect(INPUT.typescript.strictFlags.map(([flag]) => flag)).toStrictEqual([...STRICT_FLAGS]);
        expect(BASE_CONFIG).not.toBe(MEMBER_CONFIG);
    });

    it("reports an unspecified target where no base config exists", () => {
        expect(collectTypescript(BARE).target).toBe(UNSPECIFIED_TARGET);
    });
});
