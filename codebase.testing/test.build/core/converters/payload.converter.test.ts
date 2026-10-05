import { describe, expect, it } from "vitest";
import { textualize } from "@banes-lab/build-scripts/core/converters/payload.converter.ts";

const upper = function upper(value: string): string {
    return value.toUpperCase();
};

describe("textualize", () => {
    it("maps every string in a nested value through the inline converter and leaves other values alone", () => {
        expect(textualize({ a: ["x", { b: "y", n: 1, z: null }] }, upper)).toStrictEqual({
            a: ["X", { b: "Y", n: 1, z: null }],
        });
    });
});
