import type { CanonicalData, MappingRow } from "@govlab/quality/types/canon.types.ts";
import { describe, expect, it } from "vitest";
import { resolveConfig } from "@govlab/quality/core/resolvers/plan.resolver.ts";

const WIDTH = 100;

const row = function row(tool: string, knob: string): MappingRow {
    return { canonicalId: "line-length", default: null, fidelity: "exact", fixed: false, knob, langs: ["ts"], tool };
};

const DATA: CanonicalData = {
    conflicts: [],
    ownership: [{ fixedOwners: [], id: "format", ownerByLanguage: { ts: "prettier" } }],
    rows: [row("prettier", "printWidth"), row("eslint", "max-len")],
    settings: [
        {
            default: null,
            dimension: "layout",
            id: "line-length",
            kind: "value",
            surface: "format",
            valueType: "number",
        },
    ],
};

describe("resolveConfig", () => {
    it("gives a value setting to the surface owner and turns the surface off for the other tools", () => {
        const plan = resolveConfig({ languages: ["ts"], values: { "line-length": WIDTH } }, DATA);
        expect("perToolConfig" in plan ? plan.perToolConfig["prettier"]?.knobs : null).toStrictEqual({
            "line-length": WIDTH,
        });
        expect("perToolConfig" in plan ? plan.perToolConfig["eslint"]?.disabledSurfaces : null).toStrictEqual([
            "format",
        ]);
    });

    it("reports a setting no canonical record names", () => {
        const plan = resolveConfig({ languages: ["ts"], values: { ghost: 1 } }, DATA);
        expect("conflicts" in plan ? plan.conflicts.map((conflict) => conflict.kind) : []).toStrictEqual([
            "unknown-setting",
        ]);
    });
});
