import { centralIndexFor, packageIndexFor } from "#core/loaders/coverage.loader";
import { enclosingPackages, findPackageRoot } from "#core/resolvers/package.resolver";
import { forwardSlashed, stripExtension } from "#core/converters/filename.converter";
import { ROOT } from "@ssot/paths/anchor";
import type { Scope } from "#types/coverage.types";
import path from "node:path";
import { relativePath } from "@ssot/paths";
import { wordIncludes } from "#core/matchers/word.matcher";

const specifierOf = function specifierOf(file: string): string {
    const rel = forwardSlashed(path.relative(ROOT, file));
    return rel.startsWith("..") ? file : rel;
};

export const resolveScope = function resolveScope(file: string): Scope | null {
    const pkg = findPackageRoot(file.slice(0, file.lastIndexOf("/")));
    if (pkg === null) {
        return null;
    }
    const normalizedRoot = forwardSlashed(ROOT);
    const testRoot = forwardSlashed(path.join(normalizedRoot, relativePath("codebase.testing")));
    const colocated = [pkg, ...enclosingPackages(pkg)].map((root) => packageIndexFor(root).get(pkg) ?? "").join("\n");
    const centralized = centralIndexFor(testRoot, normalizedRoot).get(pkg) ?? "";
    const text = `${colocated}\n${centralized}`;
    const stem = stripExtension(file.slice(file.lastIndexOf("/") + 1));
    return {
        coversDefault: () => wordIncludes(text, stem),
        coversName: (symbol) => wordIncludes(text, symbol),
        label: pkg,
        specifier: specifierOf(file),
    };
};
