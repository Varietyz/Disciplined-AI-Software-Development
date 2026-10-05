import { climbsOut, inspectManifests } from "coordination-surface/tools/core/inspectors/manifest.inspector.ts";
import { describe, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { SURFACE_ROOT } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const ROOT_MANIFEST = SURFACE_ROOT.length === 0 ? "package.json" : `${SURFACE_ROOT}/package.json`;

const MANIFEST_TEXT = JSON.stringify({
    dependencies: { leftpad: "1.0.0" },
    exports: { ".": "./present.ts", "./gone": "./missing.ts" },
    scripts: { build: "node ./present.ts", host: "node ../outside/run.ts", stale: "node ./renamed.ts --flag" },
    workspaces: ["tools", "empty/*"],
});

const withPackage = function withPackage(text: string, probe: (root: string) => void): void {
    const root = mkdtempSync(resolve(tmpdir(), "manifest-inspector-"));
    const surface = resolve(root, SURFACE_ROOT);
    mkdirSync(resolve(surface, "tools"), { recursive: true });
    mkdirSync(resolve(surface, "empty", "child"), { recursive: true });
    writeVerbatim(resolve(surface, "present.ts"), 'import leftpad from "leftpad";\n');
    writeVerbatim(resolve(surface, "tools", "package.json"), "{}");
    writeVerbatim(resolve(surface, "package.json"), text);
    try {
        probe(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("climbsOut", () => {
    it("is true only for a path segment that climbs to a parent", () => {
        assert.equal(climbsOut("../out/probe.ts"), true);
        assert.equal(climbsOut("tools/core/a..b/probe.ts"), false);
    });
});

describe("inspectManifests", () => {
    it("reports runtime dependencies, empty workspace globs, broken subpaths and script targets", () => {
        withPackage(MANIFEST_TEXT, (root) => {
            const findings = inspectManifests(root, []).filter((finding) => finding.path === ROOT_MANIFEST);
            assert.deepEqual(
                findings.map((finding) => [finding.rule, finding.locus]),
                [
                    ["declaration/declaredRuntimeDependency", 'dependencies "leftpad"'],
                    ["declaration/emptyWorkspaceGlob", 'workspaces "empty/*"'],
                    ["declaration/unresolvedSubpath", 'exports "./gone"'],
                    ["declaration/hostClaimingScriptTarget", "scripts.host"],
                    ["declaration/unresolvedScriptTarget", "scripts.stale"],
                ],
            );
        });
    });

    it("reports a manifest that does not parse", () => {
        withPackage("{ not json", (root) => {
            const rules = inspectManifests(root, []).map((finding) => finding.rule);
            assert.ok(rules.includes("declaration/unparsableManifest"));
        });
    });
});
