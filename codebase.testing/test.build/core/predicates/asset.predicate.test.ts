import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { isServed } from "@banes-lab/build-scripts/core/predicates/asset.predicate.ts";
import { relative } from "node:path";

describe("isServed", () => {
    it("serves the root files, the page files, the payload route and the generated asset folders, and nothing else", () => {
        const walks = relative(absolutePath("app.public"), absolutePath("app.walks")).split("\\").join("/");
        expect(isServed("robots.txt")).toBe(true);
        expect(isServed("terms.html")).toBe(true);
        expect(isServed("terms.md")).toBe(true);
        expect(isServed("json/terms.json")).toBe(true);
        expect(isServed(`${walks}/walk.a.generated.svg`)).toBe(true);
        expect(isServed("assets/stale.js")).toBe(false);
    });
});
