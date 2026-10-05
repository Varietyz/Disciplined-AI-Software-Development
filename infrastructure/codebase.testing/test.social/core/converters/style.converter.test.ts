import { describe, expect, it } from "vitest";
import { propertyOf } from "@banes-lab/social-share/core/converters/style.converter.ts";

describe("propertyOf", () => {
    it("turns a camel-case style key into its CSS property name", () => {
        expect(propertyOf("fontSize")).toBe("font-size");
        expect(propertyOf("backgroundImage")).toBe("background-image");
        expect(propertyOf("color")).toBe("color");
    });
});
