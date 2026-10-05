import { defineFormatter, formatterFor } from "@govlab/quality/core/registries/formatter.registry.ts";
import { expect, test } from "vitest";

test("defineFormatter registers one formatter per format, and formatterFor finds it", () => {
    const formatter = { format: "ini" as const, render: (): string => "" };
    expect(formatterFor("ini")).toBeUndefined();
    defineFormatter(formatter);
    expect(formatterFor("ini")).toBe(formatter);
    expect(() => defineFormatter(formatter)).toThrow('"ini"');
});
