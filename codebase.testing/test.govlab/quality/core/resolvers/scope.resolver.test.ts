import {
    defaultPathsFor,
    detectEcosystems,
    projectDirWithMarker,
    resolveScopedFiles,
    scopeTargets,
    scopedFiles,
} from "@govlab/quality/core/resolvers/scope.resolver.ts";
import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { ROOT } from "@ssot/paths";
import path from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("scope resolution", () => {
    it("detects this workspace as a typescript project", () => {
        expect(detectEcosystems(ROOT).map((entry) => entry.ecosystem)).toContain("typescript");
    });

    it("falls back to the current directory for an ecosystem with no default paths", () => {
        expect(defaultPathsFor("css")).toStrictEqual(["**/*.{css,scss}"]);
        expect(defaultPathsFor("unknown")).toStrictEqual(["."]);
    });

    it("resolves targets against the root and scans the root when none are given", () => {
        expect(scopeTargets("/repo", [])).toStrictEqual([path.join("/repo", ".")]);
        expect(scopeTargets("/repo", ["a"])).toStrictEqual([path.join("/repo", "a")]);
    });

    it("finds the first target holding a marker file, and scopes a glob to the matching files", async () => {
        const root = mkdtempSync(path.join(tmpdir(), "scope-"));
        try {
            mkdirSync(path.join(root, "mod"));
            writeVerbatim(path.join(root, "mod", "go.mod"), "module x\n");
            writeVerbatim(path.join(root, "run.sh"), "echo\n");
            expect(projectDirWithMarker(root, ["mod"], "go.mod")).toBe(path.join(root, "mod"));
            expect(projectDirWithMarker(root, ["none"], "go.mod")).toBe(root);
            expect(resolveScopedFiles(root, ["**/*.sh"], [])).toStrictEqual(["run.sh"]);
            expect(resolveScopedFiles(root, ["."], [])).toStrictEqual(["."]);
            expect(await scopedFiles(root, ["**/*.sh"])).toStrictEqual(["run.sh"]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
