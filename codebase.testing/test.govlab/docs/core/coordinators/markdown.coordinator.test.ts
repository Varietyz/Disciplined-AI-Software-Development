import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { basename, join } from "node:path";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { ROOT } from "@ssot/paths";
import { captureOutput } from "./output.fixture.ts";
import { docsHostFor } from "@govlab/docs/core/factories/environment.factory.ts";
import { runFix } from "@govlab/docs/core/coordinators/markdown.coordinator.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const GENERATED_BODY = "<!-- Auto-generated 2026 v1 -->\n# C\n\nEdit src/c.ts now.\n";
const dir = mkdtempSync(join(tmpdir(), "doc-fix-"));
const BARE = join(dir, "bare.md");
const CLEAN = join(dir, "clean.md");
const GENERATED = join(dir, "generated.md");
writeVerbatim(BARE, "# A\n\nEdit src/a.ts now.\n");
writeVerbatim(CLEAN, "# B\n\nNothing to wrap.\n");
writeVerbatim(GENERATED, GENERATED_BODY);
const host = await docsHostFor(ROOT);

afterEach(() => {
    vi.restoreAllMocks();
});

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("runFix", () => {
    it("wraps bare paths in each authored document, leaves generated ones to their generator, and reports the count", () => {
        const output = captureOutput();
        runFix({
            ...host,
            relative: (path: string) => basename(path),
            root: dir,
            walk: () => [BARE, CLEAN, GENERATED],
        });
        expect(readFileSync(BARE, "utf8")).toBe("# A\n\nEdit `src/a.ts` now.\n");
        expect(readFileSync(GENERATED, "utf8")).toBe(GENERATED_BODY);
        expect(output.out).toStrictEqual(["✓ bare.md\n", "govlab.docs fix: backticked bare paths in 1 document(s)\n"]);
    });
});
