import { afterAll, expect, test } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { fixIndexAccess } from "@govlab/quality/core/coordinators/access.coordinator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const COMPILE_TIMEOUT = 120_000;
const dir = mkdtempSync(join(tmpdir(), "access-coordinator-"));
writeVerbatim(join(dir, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true }, files: ["a.ts"] }));
writeVerbatim(join(dir, "a.ts"), "export const value: number = 1;\n");

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

test(
    "fixIndexAccess converts nothing in a project with no index-signature diagnostics",
    () => {
        expect(fixIndexAccess(join(dir, "tsconfig.json"))).toBe(0);
    },
    COMPILE_TIMEOUT,
);
