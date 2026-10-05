import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import { hoistBreaches } from "@project/scripts/core/analyzers/dependency.analyzer.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("hoistBreaches", () => {
    it("reports a nested install folder and a nested lockfile, and ignores the root's own", () => {
        const root = mkdtempSync(join(tmpdir(), "hoist-"));
        mkdirSync(join(root, "node_modules"));
        writeVerbatim(join(root, "package-lock.json"), "{}");
        mkdirSync(join(root, "member", "node_modules"), { recursive: true });
        writeVerbatim(join(root, "member", "package-lock.json"), "{}");
        expect(hoistBreaches(root)).toStrictEqual(["member/node_modules", "member/package-lock.json"]);
    });
});
