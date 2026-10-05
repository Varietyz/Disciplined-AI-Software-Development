import { describe, expect, it } from "vitest";
import { wait } from "@banes-lab/build-scripts/core/timers/base.timer.ts";

const SHORT_MS = 5;

describe("wait", () => {
    it("resolves after at least the requested delay", async () => {
        const before = Date.now();
        await wait(SHORT_MS);
        expect(Date.now() - before).toBeGreaterThanOrEqual(SHORT_MS - 1);
    });
});
