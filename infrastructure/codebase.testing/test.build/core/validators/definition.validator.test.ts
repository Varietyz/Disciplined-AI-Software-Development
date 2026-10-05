import { describe, expect, it } from "vitest";
import { citationFindings } from "@banes-lab/build-scripts/core/validators/definition.validator.ts";

describe("citationFindings", () => {
    it("finds nothing when no route is checked, and nothing for a route whose payload the build did not write", async () => {
        await expect(citationFindings([])).resolves.toStrictEqual([]);
        await expect(
            citationFindings([{ page: "no-such-page", path: "/no-such-page", tab: null }]),
        ).resolves.toStrictEqual([]);
    });
});
