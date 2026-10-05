import type { Rule } from "eslint";
import { builtinModules } from "node:module";

defineCheck({ detects: [], enforces: ["architecture:explicit-contracts"] });

import { defineCheck } from "@govlab/context/check";
import fs from "node:fs";
import { jsonRecordAt } from "../../shared/loaders/manifest.loader.ts";
import path from "node:path";

interface AstNode {
    type: string;
    name?: string;
    value?: unknown;
    callee?: AstNode;
    arguments?: AstNode[];
    source?: AstNode;
}

const BUILTINS = new Set(builtinModules);
const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

const MESSAGE =
    "'{{pkg}}' is imported but declared in no package.json (dependencies/devDependencies/peer/optional) up the tree. An undeclared external package is not installed by `npm install`, so the import throws ERR_MODULE_NOT_FOUND at runtime — even when an ambient `declare module` shim hides it from the type-checker. Add '{{pkg}}' to the owning package.json (and install it), or remove the import. [no_undeclared_dependency]";

const isNode = function isNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isNode(value) ? value : null;
};

const isReportNode = function isReportNode(value: unknown): value is Rule.Node {
    return value !== null && typeof value === "object" && "type" in value;
};

const asReportNode = function asReportNode(value: unknown): Rule.Node | null {
    return isReportNode(value) ? value : null;
};

const normalize = function normalize(filename: string): string {
    return filename.split("\\").join("/");
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const packageRoot = function packageRoot(specifier: string): string {
    const bare = specifier.startsWith("node:") ? specifier.slice("node:".length) : specifier;
    if (bare.startsWith("@")) {
        const firstSlash = bare.indexOf("/");
        if (firstSlash === -1) {
            return bare;
        }
        const secondSlash = bare.indexOf("/", firstSlash + 1);
        return secondSlash === -1 ? bare : bare.slice(0, secondSlash);
    }
    const slash = bare.indexOf("/");
    return slash === -1 ? bare : bare.slice(0, slash);
};

const SELF_DECLARING_SCHEMES = ["data:", "file:", "npm:", "jsr:", "http:", "https:"];

const isExternal = function isExternal(specifier: string): boolean {
    if (specifier.length === 0) {
        return false;
    }
    const [first] = specifier;
    if (first === "." || first === "/" || first === "#") {
        return false;
    }
    return !SELF_DECLARING_SCHEMES.some((scheme) => specifier.startsWith(scheme));
};

const declaredCache = new Map<string, Set<string>>();

const addDepsFrom = function addDepsFrom(pkgPath: string, declared: Set<string>): void {
    if (!fs.existsSync(pkgPath)) {
        return;
    }
    const parsed = jsonRecordAt(pkgPath);
    for (const field of DEP_FIELDS) {
        const deps = parsed[field];
        if (isRecord(deps)) {
            for (const name of Object.keys(deps)) {
                declared.add(name);
            }
        }
    }
};

const collectDeclared = function collectDeclared(startDir: string): Set<string> {
    const cached = declaredCache.get(startDir);
    if (cached) {
        return cached;
    }
    const declared = new Set<string>();
    let dir = startDir;
    for (;;) {
        addDepsFrom(path.join(dir, "package.json"), declared);
        const parent = path.dirname(dir);
        if (parent === dir) {
            break;
        }
        dir = parent;
    }
    declaredCache.set(startDir, declared);
    return declared;
};

const isAllowed = function isAllowed(pkg: string, fileDir: string): boolean {
    const bare = pkg.startsWith("node:") ? pkg.slice("node:".length) : pkg;
    if (BUILTINS.has(bare) || BUILTINS.has(`node:${bare}`)) {
        return true;
    }
    return collectDeclared(fileDir).has(pkg);
};

const reportUndeclared = function reportUndeclared(
    context: Rule.RuleContext,
    fileDir: string,
    target: { node: AstNode; specifier: unknown },
): void {
    const { node, specifier } = target;
    if (typeof specifier !== "string" || !isExternal(specifier)) {
        return;
    }
    const pkg = packageRoot(specifier);
    if (isAllowed(pkg, fileDir)) {
        return;
    }
    const reportNode = asReportNode(node);
    if (reportNode !== null) {
        context.report({ data: { pkg }, messageId: "undeclared", node: reportNode });
    }
};

const makeFromSource = function makeFromSource(context: Rule.RuleContext, fileDir: string): (node: Rule.Node) => void {
    return function fromSource(node: Rule.Node): void {
        const source = asNode(node)?.source;
        if (isRecord(source)) {
            reportUndeclared(context, fileDir, { node: source, specifier: source.value });
        }
    };
};

const makeOnCall = function makeOnCall(context: Rule.RuleContext, fileDir: string): (node: Rule.Node) => void {
    return function onCall(node: Rule.Node): void {
        const call = asNode(node);
        if (call?.callee?.type === "Identifier" && call.callee.name === "require") {
            const first = call.arguments?.[0];
            if (first?.type === "Literal") {
                reportUndeclared(context, fileDir, { node: first, specifier: first.value });
            }
        }
    };
};

const makeOnImportExpression = function makeOnImportExpression(
    context: Rule.RuleContext,
    fileDir: string,
): (node: Rule.Node) => void {
    return function onImportExpression(node: Rule.Node): void {
        const source = asNode(node)?.source;
        if (source?.type === "Literal") {
            reportUndeclared(context, fileDir, { node: source, specifier: source.value });
        }
    };
};

const noUndeclaredDependency: Rule.RuleModule = {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const fileDir = path.dirname(normalize(context.filename));
        const fromSource = makeFromSource(context, fileDir);
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["CallExpression", makeOnCall(context, fileDir)],
            ["ExportAllDeclaration", fromSource],
            ["ExportNamedDeclaration", fromSource],
            ["ImportDeclaration", fromSource],
            ["ImportExpression", makeOnImportExpression(context, fileDir)],
        ];
        return Object.fromEntries(handlers);
    },
    meta: {
        docs: {
            description:
                "Every imported package is declared by a manifest up the tree. An undeclared import can still resolve — through a hoisted transitive install, a workspace symlink, or an ambient shim — so it type-checks and runs locally while a clean install has nothing to resolve it against.",
        },
        messages: { undeclared: MESSAGE },
        schema: [],
        type: "problem",
    },
};

export default {
    plugins: { "govlab-deps": { rules: { "no-undeclared-dependency": noUndeclaredDependency } } },
    tool: "eslint",
};
