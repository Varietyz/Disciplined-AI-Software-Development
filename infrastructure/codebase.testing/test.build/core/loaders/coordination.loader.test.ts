import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { rmSync } from "node:fs";
import { seeded } from "./coordination.fixture.ts";
import { shippedEntries } from "@banes-lab/build-scripts/core/loaders/coordination.loader.ts";

describe("shippedEntries", () => {
    it("ships the manifest and every entry it lists", () => {
        const root = seeded();
        const entries = shippedEntries(join(root, "member"));
        rmSync(root, { force: true, recursive: true });
        expect(entries).toStrictEqual(["package.json", "README.md", "tools", "absent.md"]);
    });
});
