import type { Rule } from "eslint";
import { defineCheck } from "@govlab/context/check";

defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] });

import fs from "node:fs";
import { jsonRecordAt } from "../../shared/loaders/manifest.loader.ts";
import path from "node:path";

interface AstNode {
    type: string;
    value?: unknown;
    id?: AstNode;
    body?: BlockNode;
    declaration?: AstNode;
}

interface BlockNode {
    body?: AstNode[];
}

const MESSAGE =
    "'{{pkg}}' is faked by a hand-written `declare module` shim, but real types are available ({{source}}). Delete this declare module: install @types/{{pkg}} if needed, then rely on the package's own typings. A genuinely untyped package may keep a minimal shim; this one is redundant.";

const isNode = function isNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isNode(value) ? value : null;
};

const normalize = function normalize(filename: string): string {
    return filename.split("\\").join("/");
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const LOCAL_PREFIXES = new Set([".", "/", "#"]);
const SPECIFIER_BREAKERS = ["*", ":"];

const isExternal = function isExternal(specifier: string): boolean {
    if (specifier.length === 0 || LOCAL_PREFIXES.has(specifier.slice(0, 1))) {
        return false;
    }
    return !SPECIFIER_BREAKERS.some((breaker) => specifier.includes(breaker));
};

const packageRoot = function packageRoot(specifier: string): string {
    if (specifier.startsWith("@")) {
        const firstSlash = specifier.indexOf("/");
        if (firstSlash === -1) {
            return specifier;
        }
        const secondSlash = specifier.indexOf("/", firstSlash + 1);
        return secondSlash === -1 ? specifier : specifier.slice(0, secondSlash);
    }
    const slash = specifier.indexOf("/");
    return slash === -1 ? specifier : specifier.slice(0, slash);
};

const typesPackageName = function typesPackageName(pkg: string): string {
    if (pkg.startsWith("@")) {
        return `@types/${pkg.slice(1).split("/").join("__")}`;
    }
    return `@types/${pkg}`;
};

const PACKAGE_TYPES_ENTRY_HINTS = ["index.d.ts"];

const shipsOwnTypes = function shipsOwnTypes(pkgDir: string): boolean {
    const pkgJson = path.join(pkgDir, "package.json");
    if (fs.existsSync(pkgJson)) {
        const parsed = jsonRecordAt(pkgJson);
        if (typeof parsed["types"] === "string" || typeof parsed["typings"] === "string") {
            return true;
        }
    }
    return PACKAGE_TYPES_ENTRY_HINTS.some((entry) => fs.existsSync(path.join(pkgDir, entry)));
};

const realTypesSource = function realTypesSource(pkg: string, startDir: string): string | null {
    let dir = startDir;
    const typesPkg = typesPackageName(pkg);
    for (;;) {
        const nm = path.join(dir, "node_modules");
        if (shipsOwnTypes(path.join(nm, ...pkg.split("/")))) {
            return `${pkg} ships its own types`;
        }
        if (fs.existsSync(path.join(nm, ...typesPkg.split("/")))) {
            return `${typesPkg} is installed`;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            return null;
        }
        dir = parent;
    }
};

const VALUE_DECLS = new Set(["FunctionDeclaration", "TSDeclareFunction", "ClassDeclaration", "VariableDeclaration"]);
const SURFACE_EXPORTS = new Set(["ExportDefaultDeclaration", "TSExportAssignment"]);

const typeOfNode = function typeOfNode(value: unknown): string {
    if (!isRecord(value)) {
        return "";
    }
    const kind = value["type"];
    return typeof kind === "string" ? kind : "";
};

const declaresValue = function declaresValue(statement: unknown): boolean {
    const kind = typeOfNode(statement);
    if (SURFACE_EXPORTS.has(kind) || VALUE_DECLS.has(kind)) {
        return true;
    }
    if (kind !== "ExportNamedDeclaration" || !isRecord(statement)) {
        return false;
    }
    return VALUE_DECLS.has(typeOfNode(statement["declaration"]));
};

const declaresSurface = function declaresSurface(node: AstNode): boolean {
    const block = node.body;
    if (!isRecord(block)) {
        return false;
    }
    const statements = block["body"];
    return Array.isArray(statements) && statements.some((statement: unknown) => declaresValue(statement));
};

const noRedundantTypeShim: Rule.RuleModule = {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const fileDir = path.dirname(normalize(context.filename));
        const onModule = function onModule(node: Rule.Node): void {
            const decl = asNode(node);
            if (decl === null) {
                return;
            }
            const { id } = decl;
            if (!isRecord(id) || id.type !== "Literal" || typeof id.value !== "string") {
                return;
            }
            const spec = id.value;
            if (!isExternal(spec) || !declaresSurface(decl)) {
                return;
            }
            const pkg = packageRoot(spec);
            const source = realTypesSource(pkg, fileDir);
            if (source !== null) {
                context.report({ data: { pkg, source }, messageId: "redundant", node });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [["TSModuleDeclaration", onModule]];
        return Object.fromEntries(handlers);
    },
    meta: {
        docs: {
            description:
                "An ambient module declaration for a package that already ships its own types is deleted, not kept. A package with no available types may keep a minimal shim.",
        },
        messages: { redundant: MESSAGE },
        schema: [],
        type: "problem",
    },
};

export default {
    plugins: { "govlab-deps": { rules: { "no-redundant-type-shim": noRedundantTypeShim } } },
    tool: "eslint",
};
