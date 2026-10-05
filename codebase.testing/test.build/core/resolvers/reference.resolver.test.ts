import { describe, expect, it } from "vitest";
import { referenceFileOf } from "@banes-lab/build-scripts/core/resolvers/reference.resolver.ts";

describe("referenceFileOf", () => {
    it("names one generated data module per collection", () => {
        expect(referenceFileOf("layer")).toBe("reference.layer.generated.ts");
    });
});
