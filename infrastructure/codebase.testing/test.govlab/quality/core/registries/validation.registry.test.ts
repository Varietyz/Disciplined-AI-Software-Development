import { defineValidator, registeredValidators } from "@govlab/quality/core/registries/validation.registry.ts";
import { expect, test } from "vitest";

const probe = function probe(id: string): Parameters<typeof defineValidator>[0] {
    return { appliesTo: "*", id, meta: { canonical: [], description: "probe" }, validate: () => [] };
};

test("defineValidator registers each id once, and registeredValidators lists them by id", () => {
    defineValidator(probe("zz-probe"));
    defineValidator(probe("aa-probe"));
    expect(registeredValidators().map((validator) => validator.id)).toStrictEqual(["aa-probe", "zz-probe"]);
    expect(() => defineValidator(probe("aa-probe"))).toThrow('"aa-probe"');
});
