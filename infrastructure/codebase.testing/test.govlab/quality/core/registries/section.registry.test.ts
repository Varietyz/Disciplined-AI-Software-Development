import {
    defineConfigSection,
    registeredSections,
    validateConfig,
} from "@govlab/quality/core/registries/section.registry.ts";
import { expect, test } from "vitest";

test("a defined section validates its own key", () => {
    const section = defineConfigSection({
        key: "zzProbe",
        validate: (value) => (typeof value === "string" ? [] : ["zzProbe must be a string"]),
    });
    expect(registeredSections()).toContain(section);
    expect(validateConfig({ zzProbe: 1 }).some((error) => error.includes("zzProbe"))).toBe(true);
    expect(validateConfig({ zzProbe: "ok" }).some((error) => error.includes("zzProbe"))).toBe(false);
});
