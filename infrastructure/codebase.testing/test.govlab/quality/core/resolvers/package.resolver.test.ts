import {
    enclosingPackages,
    findPackageRoot,
    packageRelOf,
    packageRootOf,
    relFromRoot,
    withinPackage,
} from "@govlab/quality/core/resolvers/package.resolver.ts";
import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths/anchor";
import { join } from "node:path";
import { relativePath } from "@ssot/paths";

const memberFile = join(ROOT, relativePath("govlab.quality"), "index.ts");
const memberRel = `${relativePath("govlab.quality")}/index.ts`;
const nestedFile = join(ROOT, relativePath("govlab.utils.argv"), "index.ts");
const coordination = join(ROOT, relativePath("app.coordination")).split("\\").join("/");

test("relFromRoot resolves a file under the workspace root and refuses one outside it", () => {
    expect(relFromRoot(memberFile)).toBe(memberRel);
    expect(relFromRoot("")).toBeNull();
    expect(relFromRoot(join(ROOT, "..", "elsewhere", "a.ts"))).toBeNull();
});

test("packageRelOf resolves the nearest member that declares a package, at any depth", () => {
    expect(packageRelOf(memberFile)).toBe(relativePath("govlab.quality"));
    expect(packageRelOf(nestedFile)).toBe(relativePath("govlab.utils.argv"));
    expect(packageRelOf(join(ROOT, "package.json"))).toBeNull();
});

test("packageRootOf returns the absolute member root and refuses an empty path", () => {
    expect(packageRootOf(memberFile)?.endsWith(relativePath("govlab.quality"))).toBe(true);
    expect(packageRootOf("")).toBeNull();
});

test("withinPackage returns the path a file occupies inside its own member", () => {
    expect(withinPackage(memberFile)).toBe("index.ts");
    expect(withinPackage("")).toBeNull();
});

test("findPackageRoot walks up to the folder holding a package manifest", () => {
    expect(findPackageRoot(`${coordination}/tools`)).toBe(`${coordination}/tools`);
});

test("enclosingPackages lists each package above a nested one and stops below the workspace root", () => {
    const enclosing = enclosingPackages(`${coordination}/tools`);
    expect(enclosing[0]).toBe(coordination);
    expect(enclosing).not.toContain(ROOT.split("\\").join("/"));
});
