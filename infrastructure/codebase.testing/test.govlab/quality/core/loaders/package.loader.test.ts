import { dependentWorkspaces, packageNameIndex, workspaceDirs } from "@govlab/quality/core/loaders/package.loader.ts";
import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths/anchor";
import { relativePath } from "@ssot/paths";

test("workspaceDirs lists every workspace member folder", () => {
    expect(workspaceDirs(ROOT).some((dir) => dir.endsWith(relativePath("govlab.quality")))).toBe(true);
});

test("dependentWorkspaces lists the members that declare a package, never the package itself", () => {
    const quality = packageNameIndex(ROOT).get("@govlab/quality") ?? "";
    const dependents = dependentWorkspaces(ROOT, quality);
    expect(dependents.length).toBeGreaterThan(0);
    expect(dependents.some((dir) => dir.endsWith(relativePath("govlab.quality")))).toBe(false);
});

test("packageNameIndex maps each workspace package name onto its folder", () => {
    const index = packageNameIndex(ROOT);
    expect(index.get("@govlab/quality")?.endsWith(relativePath("govlab.quality"))).toBe(true);
});
