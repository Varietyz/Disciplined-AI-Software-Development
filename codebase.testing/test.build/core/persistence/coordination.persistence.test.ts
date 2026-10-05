import { describe, expect, it } from "vitest";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { seeded } from "../loaders/coordination.fixture.ts";
import { supplyCoordination } from "@banes-lab/build-scripts/core/persistence/coordination.persistence.ts";

describe("supplyCoordination", () => {
    it("syncs the output folder to the listed entries only", async () => {
        const root = seeded();
        const to = join(root, "public");
        await supplyCoordination(join(root, "member"), to);
        expect(existsSync(join(to, "README.md"))).toBe(true);
        expect(existsSync(join(to, "tools", "fixtures", "a.fixture.ts"))).toBe(true);
        expect(existsSync(join(to, "_generated"))).toBe(false);
        expect(existsSync(join(to, "stale.md"))).toBe(false);
        rmSync(root, { force: true, recursive: true });
    });
});
