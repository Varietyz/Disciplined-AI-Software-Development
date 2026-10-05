import { ROOT, absolutePath } from "@ssot/paths";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocValidator } from "@govlab/docs/core/coordinators/validation.coordinator.ts";
import { captureOutput } from "./output.fixture.ts";
import { docsHostFor } from "@govlab/docs/core/factories/environment.factory.ts";
import { join } from "node:path";

const host = await docsHostFor(ROOT);
const GUIDE = join(absolutePath("docArch"), "guides", "scale-govlab-docs.govlab.guide.md");
const NO_SYNTAX = {
    check: async () => {
        await Promise.resolve();
        return [];
    },
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("DocValidator", () => {
    it("reports no findings for a conforming document and prints the scan summary", async () => {
        const output = captureOutput();
        expect(await new DocValidator(host.ctx, NO_SYNTAX).run([GUIDE])).toBe(0);
        expect(output.out.join("")).toContain("scanned 1 document(s)");
        expect(output.err).toStrictEqual([]);
    });
});
