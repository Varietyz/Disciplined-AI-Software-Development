import { describe, expect, it, vi } from "vitest";
import { NOOP_LOGGER } from "@govlab/patterns/core/reporters/pattern.reporter.ts";
import process from "node:process";

describe("NOOP_LOGGER", () => {
    it("writes nothing when warned", () => {
        const spy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        try {
            NOOP_LOGGER.warn("ignored", { detail: 1 });
            expect(spy).not.toHaveBeenCalled();
        } finally {
            spy.mockRestore();
        }
    });
});
