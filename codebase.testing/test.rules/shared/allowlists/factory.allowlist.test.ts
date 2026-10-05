import {
    ELEMENT_FACTORY_MODULES,
    FACTORY_OPTIONS_SCHEMA,
    MODULE_OPTIONS_SCHEMA,
    RAW_ELEMENT_FACTORIES,
    WRITER_OPTIONS_SCHEMA,
    declaredFactories,
    declaredModules,
    declaredWriters,
} from "@ssot/govlab/shared/allowlists/factory.allowlist.ts";
import { describe, expect, it } from "vitest";
import type { OptionsCarrier } from "@ssot/govlab/types/manifest.types.ts";

const contextWith = function contextWith(options: unknown[]): OptionsCarrier {
    return { options };
};

describe("the shipped registries", () => {
    it("ship empty, so the rules reading them stay inert until a project declares its own", () => {
        expect(RAW_ELEMENT_FACTORIES.size).toBe(0);
        expect(ELEMENT_FACTORY_MODULES.size).toBe(0);
    });
});

describe("the option schemas", () => {
    it("declare a closed object carrying one string array each", () => {
        expect(FACTORY_OPTIONS_SCHEMA[0]?.additionalProperties).toBe(false);
        expect(MODULE_OPTIONS_SCHEMA[0]?.additionalProperties).toBe(false);
        expect(Object.keys(WRITER_OPTIONS_SCHEMA[0]?.properties ?? {}).toSorted()).toStrictEqual([
            "modules",
            "writers",
        ]);
    });
});

describe("declaredFactories", () => {
    it("prefers what the project declares in its rule options", () => {
        const declared = declaredFactories(contextWith([{ factories: ["el", "make"] }]), RAW_ELEMENT_FACTORIES);
        expect([...declared].toSorted()).toStrictEqual(["el", "make"]);
    });

    it("falls back to the registry when the project declares nothing", () => {
        expect(declaredFactories(contextWith([]), new Set(["fallback"])).has("fallback")).toBe(true);
        expect(declaredFactories(contextWith([{ factories: [] }]), new Set(["fallback"])).has("fallback")).toBe(true);
    });

    it("ignores a non-string entry rather than trusting the option blindly", () => {
        const declared = declaredFactories(contextWith([{ factories: ["el", 7] }]), RAW_ELEMENT_FACTORIES);
        expect([...declared]).toStrictEqual(["el"]);
    });
});

describe("declaredModules", () => {
    it("prefers the project's declared factory modules", () => {
        const declared = declaredModules(contextWith([{ modules: ["element.factory.ts"] }]), ELEMENT_FACTORY_MODULES);
        expect(declared.has("element.factory.ts")).toBe(true);
    });

    it("falls back to the registry when nothing is declared", () => {
        expect(declaredModules(contextWith([]), new Set(["fallback.ts"])).has("fallback.ts")).toBe(true);
    });
});

describe("declaredWriters", () => {
    it("prefers the project's declared writer functions and falls back to the registry", () => {
        const declared = declaredWriters(contextWith([{ writers: ["writeVerbatim"] }]), new Set(["fallback"]));
        expect([...declared]).toStrictEqual(["writeVerbatim"]);
        expect(declaredWriters(contextWith([]), new Set(["fallback"])).has("fallback")).toBe(true);
    });
});
