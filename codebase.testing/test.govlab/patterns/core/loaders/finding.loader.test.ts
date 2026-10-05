import { describe, expect, it } from "vitest";
import { dirname, join } from "node:path";
import { findingsPathOf, loadModuleFindings } from "@govlab/patterns/core/loaders/finding.loader.ts";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("the module findings loader", () => {
    it("reads the findings a module wrote, coercing each field", () => {
        const moduleDir = mkdtempSync(join(tmpdir(), "pl-findings-"));
        const path = findingsPathOf(moduleDir);
        mkdirSync(dirname(path), { recursive: true });
        writeVerbatim(path, JSON.stringify({ findings: [{ kind: "dead-code", line: "x", name: "orphan" }, "noise"] }));
        const loaded = loadModuleFindings(moduleDir, "mod");
        expect(loaded?.module).toBe("mod");
        expect(loaded?.findings).toStrictEqual([
            {
                confidence: "",
                detail: "",
                file: "",
                kind: "dead-code",
                line: 0,
                members: [],
                name: "orphan",
                relevance: 0,
                remedy: "",
                severity: "",
            },
        ]);
    });

    it("answers null for a module with no findings file or an unreadable one", () => {
        const moduleDir = mkdtempSync(join(tmpdir(), "pl-findings-"));
        expect(loadModuleFindings(moduleDir, "mod")).toBeNull();
        const path = findingsPathOf(moduleDir);
        mkdirSync(dirname(path), { recursive: true });
        writeVerbatim(path, "{not json");
        expect(loadModuleFindings(moduleDir, "mod")).toBeNull();
    });
});
