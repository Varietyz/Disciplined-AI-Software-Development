import { describe, expect, it } from "vitest";
import { messageOf } from "@banes-lab/deploy/core/converters/failure.converter.ts";

describe("messageOf", () => {
    it("takes the message from an error", () => {
        expect(messageOf(new Error("boom"))).toBe("boom");
    });

    it("stringifies anything that is not an error", () => {
        expect(messageOf(42)).toBe("42");
    });
});
