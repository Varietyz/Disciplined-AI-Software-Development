import { describe, expect, it } from "vitest";
import { renderNumbers, renderRoute } from "@banes-lab/build-scripts/core/formatters/route.formatter.ts";
import { LINK } from "./link.fixture.ts";

describe("renderRoute", () => {
    it("numbers each stop and names its block", () => {
        expect(renderRoute("Route", [{ block: "Start", link: LINK, position: 1, requires: [] }])).toContain(
            "1. [A](https://x.test/a.md) (Start)",
        );
    });
});

describe("renderNumbers", () => {
    it("lists each number before its link under the title", () => {
        const row = { kind: "section", link: LINK, number: "M.1", part: null };
        expect(renderNumbers("Numbers", [row])).toContain("- M.1 [A](https://x.test/a.md)");
    });
});
