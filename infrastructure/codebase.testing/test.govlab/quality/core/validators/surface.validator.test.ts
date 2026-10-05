import { expect, test } from "vitest";
import type { CanonicalData } from "@govlab/quality/types/canon.types.ts";
import { validateOwnerOverride } from "@govlab/quality/core/validators/surface.validator.ts";

const DATA: CanonicalData = {
    conflicts: [],
    ownership: [{ fixedOwners: ["go"], id: "format", ownerByLanguage: { go: "gofmt", ts: "prettier" } }],
    rows: [
        {
            canonicalId: "line-length",
            default: null,
            fidelity: "exact",
            fixed: false,
            knob: "width",
            langs: ["ts"],
            tool: "biome",
        },
    ],
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

test("validateOwnerOverride accepts a competing tool and names each refused override", () => {
    expect(validateOwnerOverride(undefined, DATA)).toStrictEqual([]);
    expect(validateOwnerOverride({ format: { ts: "biome" } }, DATA)).toStrictEqual([]);
    const kinds = validateOwnerOverride({ format: { go: "other", ts: "ruff" }, ghost: { ts: "biome" } }, DATA).map(
        (conflict) => conflict.kind,
    );
    expect(kinds.toSorted()).toStrictEqual(["fixed-owner", "tool-not-competitor", "unknown-surface"]);
});
