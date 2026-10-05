import type { CanonicalSettingRecord, MappingRow } from "@govlab/quality/types/canon.types.ts";
import {
    applyRuleIntent,
    applyValueSetting,
    detectKnownBadPairs,
    indexOwnership,
    indexRows,
    matchesLang,
} from "@govlab/quality/core/resolvers/surface.resolver.ts";
import { describe, expect, it } from "vitest";
import type { PerTool } from "@govlab/quality/types/plan.types.ts";

const WIDTH = 100;

const row = function row(tool: string, extra: Partial<MappingRow> = {}): MappingRow {
    return {
        canonicalId: "line-length",
        default: null,
        fidelity: "exact",
        fixed: false,
        knob: "width",
        langs: ["ts"],
        tool,
        ...extra,
    };
};

const SETTING: CanonicalSettingRecord = {
    default: null,
    dimension: "layout",
    id: "line-length",
    kind: "value",
    surface: "format",
    valueType: "number",
};

describe("indexes and language matching", () => {
    it("indexes rows by canonical id and surfaces by id, and matches a row by its languages", () => {
        const rows = [row("prettier"), row("eslint")];
        expect(indexRows(rows).get("line-length")).toHaveLength(2);
        expect(indexOwnership([{ fixedOwners: [], id: "format", ownerByLanguage: {} }]).has("format")).toBe(true);
        expect(matchesLang(row("prettier"), "ts")).toBe(true);
        expect(matchesLang(row("prettier"), "go")).toBe(false);
    });
});

describe("applyValueSetting and applyRuleIntent", () => {
    it("reports contention when several tools claim a surface with no declared owner", () => {
        const conflicts = applyValueSetting({
            lang: "ts",
            langRows: [row("prettier"), row("biome")],
            ownership: new Map(),
            perTool: {},
            setting: SETTING,
            value: WIDTH,
        });
        expect(conflicts.map((conflict) => conflict.kind)).toStrictEqual(["ownership-overlap"]);
    });

    it("reports a fixed owner that cannot take the requested value", () => {
        const conflicts = applyValueSetting({
            lang: "go",
            langRows: [row("gofmt", { default: null, fixed: true, langs: ["go"] })],
            ownership: new Map(),
            perTool: {},
            setting: SETTING,
            value: WIDTH,
        });
        expect(conflicts.map((conflict) => conflict.kind)).toStrictEqual(["unsatisfiable-on-fixed"]);
    });

    it("enables a rule intent on every tool when the surface has no owner", () => {
        const perTool: PerTool = {};
        applyRuleIntent({
            lang: "ts",
            langRows: [row("eslint"), row("oxlint")],
            ownership: new Map(),
            perTool,
            setting: { ...SETTING, kind: "rule-intent" },
        });
        expect(Object.keys(perTool).toSorted()).toStrictEqual(["eslint", "oxlint"]);
    });
});

describe("detectKnownBadPairs", () => {
    it("reports a known bad pair only when both tools are active on its surface", () => {
        const data = {
            conflicts: [
                { kind: "known-bad-pair" as const, resolution: "pick one", surface: "format", tools: ["a", "b"] },
            ],
            ownership: [],
            rows: [],
            settings: [],
        };
        const active: PerTool = {
            a: { disabledSurfaces: [], enabledIntents: [], knobs: {} },
            b: { disabledSurfaces: [], enabledIntents: [], knobs: {} },
        };
        expect(detectKnownBadPairs(data, active)).toHaveLength(1);
        expect(
            detectKnownBadPairs(data, { a: active["a"] ?? { disabledSurfaces: [], enabledIntents: [], knobs: {} } }),
        ).toHaveLength(0);
    });
});
