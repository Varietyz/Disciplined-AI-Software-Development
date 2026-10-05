import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { sourceTextOf } from "@banes-lab/build-scripts/core/loaders/source.loader.ts";

describe("sourceTextOf", () => {
    it("reads a source asset by its name and answers null for one the anatomy did not write", () => {
        const folder = absolutePath("app.sources");
        const [first] = existsSync(folder) ? readdirSync(folder) : [];
        if (first !== undefined) {
            expect(sourceTextOf(first)).toBe(readFileSync(join(folder, first), "utf8"));
        }
        expect(sourceTextOf("source.none.generated.txt")).toBeNull();
    });
});
