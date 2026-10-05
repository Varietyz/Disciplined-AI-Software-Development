import { ROOT, absolutePath, paths, relativePath } from "@ssot/paths";
import {
    branchWithoutLocation,
    descendsThroughLeaf,
    rootNotFound,
    unknownKey,
} from "@ssot/paths/configuration/strings/location.strings.ts";
import { describe, expect, it } from "vitest";
import { isPathTree, isRecord } from "@ssot/paths/core/predicates/location.predicate.ts";
import { readFileSync, readdirSync } from "node:fs";
import { LOCATION_TREE } from "@ssot/paths/core/loaders/location.loader.ts";
import { excludeMatcher } from "@govlab/quality/config";
import path from "node:path";
import ts from "typescript";

const isExcluded = await excludeMatcher(process.cwd());

const KEY_FUNCTIONS = new Set(["relativePath", "absolutePath"]);

const filesUnder = function filesUnder(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (isExcluded(full)) {
            return [];
        }
        if (entry.isDirectory()) {
            return filesUnder(full);
        }
        return entry.name.endsWith(".ts") && !entry.name.includes(".test.") ? [full] : [];
    });
};

const keyOf = function keyOf(node: ts.Node): string | null {
    if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) {
        return null;
    }
    const [first] = node.arguments;
    const isKeyCall = KEY_FUNCTIONS.has(node.expression.text);
    return isKeyCall && first !== undefined && ts.isStringLiteralLike(first) ? first.text : null;
};

const keysIn = function keysIn(file: string, text: string): string[] {
    const keys: string[] = [];
    const visit = function visit(node: ts.Node): void {
        const key = keyOf(node);
        if (key !== null) {
            keys.push(key);
        }
        ts.forEachChild(node, visit);
    };
    visit(ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS));
    return keys;
};

interface KeyUse {
    file: string;
    key: string;
}

const collectKeyUses = function collectKeyUses(): KeyUse[] {
    return filesUnder(ROOT).flatMap((file) => {
        const text = readFileSync(file, "utf8");
        const mentions = [...KEY_FUNCTIONS].some((name) => text.includes(name));
        return (mentions ? keysIn(file, text) : []).map((key) => ({
            file: path.relative(ROOT, file).split(path.sep).join("/"),
            key,
        }));
    });
};

describe("isRecord and isPathTree", () => {
    it("accepts a tree whose every leaf is a string, and nothing else", () => {
        expect(isRecord({})).toBe(true);
        expect(isRecord(null)).toBe(false);
        expect(isPathTree({ a: "x", b: { c: "z", root: "y" } })).toBe(true);
        expect(isPathTree({ a: 1 })).toBe(false);
        expect(isPathTree("x")).toBe(false);
    });
});

describe("LOCATION_TREE and paths", () => {
    it("loads the declared tree, and freezes every leaf joined onto the root", () => {
        expect(isPathTree(LOCATION_TREE)).toBe(true);
        expect(Object.isFrozen(paths)).toBe(true);
        expect(Object.keys(paths)).toStrictEqual(Object.keys(LOCATION_TREE));
    });
});

describe("absolutePath and relativePath", () => {
    it("resolve a branch by its own location and a leaf beneath it", () => {
        const member = relativePath("project.paths");
        expect(member.length).toBeGreaterThan(0);
        expect(absolutePath("project.paths")).toBe(path.join(ROOT, member));
        expect(relativePath("project.paths", "a", "b")).toBe(`${member}/a/b`);
    });

    it("refuse an unknown key, a branch with no location and a step through a leaf", () => {
        expect(() => relativePath("no.such.key")).toThrow(unknownKey("no.such.key"));
        expect(() => relativePath("project")).toThrow(branchWithoutLocation("project"));
        expect(() => relativePath("project.paths.deeper")).toThrow(descendsThroughLeaf("project.paths.deeper"));
        expect(rootNotFound("banes-lab")).toContain("'banes-lab'");
    });
});

describe("relativePath composition", () => {
    it("resolves a flat key", () => {
        expect(relativePath("thirdParty")).toBe("_third-party");
        expect(relativePath("docArch")).toBe("doc-arch");
    });

    it("prefixes a child with its branch location", () => {
        expect(relativePath("govlab.constants")).toBe("govlab.root/govlab.constants");
        expect(relativePath("govlabHost.reports.lint")).toBe(".govlab/_quality.reports.generated/lint");
        expect(relativePath("codebase.testing.rules")).toBe("codebase.testing/test.rules");
    });

    it("composes through more than one branch", () => {
        expect(relativePath("govlab.utils.codeParse")).toBe("govlab.root/govlab.utils/code-parse");
    });

    it("returns a branch's own location without doubling the segment", () => {
        expect(relativePath("govlab.root")).toBe("govlab.root");
        expect(relativePath("govlab.utils.root")).toBe("govlab.root/govlab.utils");
        expect(relativePath("app.root")).toBe("banes-lab.root");
    });

    it("appends extra segments after the resolved key", () => {
        expect(relativePath("govlab.quality", "runtime")).toBe("govlab.root/govlab.quality/runtime");
    });

    it("rejects an unknown key rather than resolving to nothing", () => {
        expect(() => relativePath("govlab.nope")).toThrow("unknown path key");
    });

    it("resolves a branch that declares its own location, so a key survives gaining children", () => {
        expect(relativePath("govlab.utils")).toBe("govlab.root/govlab.utils");
        expect(relativePath("app.root")).toBe("banes-lab.root");
        expect(relativePath("codebase.testing")).toBe("codebase.testing");
    });

    it("rejects a branch that declares no location of its own", () => {
        expect(() => relativePath("codebase")).toThrow("no own location");
    });

    it("anchors the composed path at the workspace root", () => {
        expect(absolutePath("govlab.utils.codeParse").split("\\").join("/")).toContain(
            "govlab.root/govlab.utils/code-parse",
        );
    });
});

describe("every paths SSOT key used in the workspace resolves", () => {
    const uses = collectKeyUses();

    it("finds key uses to check", () => {
        expect(uses.length).toBeGreaterThan(0);
    });

    it("counts only a real call, never a call written inside a string sample", () => {
        const sample = 'const text = \'relativePath("no.such.key")\';\nrelativePath("app.root");';
        expect(keysIn("sample.ts", sample)).toStrictEqual(["app.root"]);
    });

    it("resolves every key, so a renamed or deleted key cannot ship", () => {
        const broken = uses
            .filter((use) => {
                try {
                    relativePath(use.key);
                    return false;
                } catch {
                    return true;
                }
            })
            .map((use) => `${use.file} → relativePath("${use.key}")`);
        expect([...new Set(broken)]).toEqual([]);
    });
});
