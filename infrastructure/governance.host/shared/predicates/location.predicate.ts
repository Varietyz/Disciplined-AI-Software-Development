import {
    ANCHOR_SUBJECT,
    LOCATION_SUBJECT,
    WORKSPACE_ROOT,
    basenameOf,
    collapsePath,
    normalizePath,
    projectFiles,
} from "../resolvers/anchor.resolver.ts";
import { calleeName, nameOf, nodeAt, nodesAt } from "../selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { MEMBER_PATHS_CONFIGS } from "../resolvers/location.resolver.ts";
import { MEMBER_ROOTS } from "../registries/location.registry.ts";
import { existsSync } from "node:fs";
import { relativePath } from "@ssot/paths";
import { resolveFile } from "../matchers/filename.matcher.ts";

const SSOT_RULE_FILE = "closure-paths-via-ssot.eslint.rule.ts";
const EXEMPT_SEGMENTS = [
    `/${relativePath("project.paths")}/`,
    `/${relativePath("codebase.testing.paths")}/`,
    ".generated.",
    "/node_modules/",
];
const SPECIFIER_PARENTS = new Set(["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"]);

const exemptBasenames = function exemptBasenames(): ReadonlySet<string> {
    const files = projectFiles();
    return new Set([
        SSOT_RULE_FILE,
        basenameOf(resolveFile(ANCHOR_SUBJECT, "resolver", files)),
        basenameOf(resolveFile(LOCATION_SUBJECT, "registry", files)),
        "taxonomy.config.ts",
        "location.registry.test.ts",
    ]);
};

const EXEMPT_BASENAMES = exemptBasenames();

export const isSsotExemptFile = function isSsotExemptFile(filename: string): boolean {
    const posix = normalizePath(filename);
    return (
        EXEMPT_SEGMENTS.some((segment) => posix.includes(segment)) ||
        EXEMPT_BASENAMES.has(basenameOf(posix)) ||
        MEMBER_PATHS_CONFIGS.has(posix)
    );
};

const STANDALONE_SCRIPTS = `/${relativePath("app.nginxScripts")}/`;

export const isStandaloneScript = function isStandaloneScript(filename: string): boolean {
    return normalizePath(filename).includes(STANDALONE_SCRIPTS);
};

export const isMemberPathsSource = function isMemberPathsSource(fromDir: string, source: string): boolean {
    if (!source.startsWith(".")) {
        return false;
    }
    const target = collapsePath(`${normalizePath(fromDir)}/${source}`);
    return [...MEMBER_PATHS_CONFIGS].some((config) => collapsePath(config) === target);
};

export const isModuleSpecifier = function isModuleSpecifier(node: AstNode): boolean {
    const parent = nodeAt(node, "parent");
    return parent !== null && SPECIFIER_PARENTS.has(parent.type);
};

const PROSE_KEYS = new Set([
    "description",
    "detail",
    "details",
    "docs",
    "hint",
    "label",
    "message",
    "messages",
    "note",
    "notes",
    "overview",
    "reason",
    "summary",
    "text",
    "title",
]);

const PROSE_CALLEES = new Set(["Error", "TypeError", "RangeError", "assert", "error", "warn", "log", "report"]);

export const isProseContext = function isProseContext(node: AstNode): boolean {
    let cursor = nodeAt(node, "parent");
    while (cursor !== null) {
        if (cursor.type === "Property" && PROSE_KEYS.has(nameOf(nodeAt(cursor, "key")))) {
            return true;
        }
        if (
            (cursor.type === "CallExpression" || cursor.type === "NewExpression") &&
            PROSE_CALLEES.has(calleeName(cursor))
        ) {
            return true;
        }
        if (cursor.type === "Program" || cursor.type === "FunctionDeclaration") {
            return false;
        }
        cursor = nodeAt(cursor, "parent");
    }
    return false;
};

const NON_PATH_PREFIXES = ["http://", "https://", "file://", "data:", "node:", "//"];
const MIN_PATH_SEGMENTS = 2;

const MEDIA_TYPES = new Set([
    "application",
    "audio",
    "example",
    "font",
    "image",
    "message",
    "model",
    "multipart",
    "text",
    "video",
]);

const isSystemPath = function isSystemPath(value: string): boolean {
    return value.startsWith("/");
};

const EXISTS_CACHE = new Map<string, boolean>();

const probeBases = function probeBases(): string[] {
    const root = normalizePath(WORKSPACE_ROOT);
    const bases = new Set([root]);
    for (const member of MEMBER_ROOTS) {
        bases.add(`${root}/${member}`);
        const cut = member.lastIndexOf("/");
        if (cut > 0) {
            bases.add(`${root}/${member.slice(0, cut)}`);
        }
    }
    return [...bases];
};

const PROBE_BASES = probeBases();
const PROBE_SUFFIXES = ["", ".ts"];

const resolvesOnDisk = function resolvesOnDisk(value: string): boolean {
    const cached = EXISTS_CACHE.get(value);
    if (cached !== undefined) {
        return cached;
    }
    const found = PROBE_BASES.some((base) => PROBE_SUFFIXES.some((suffix) => existsSync(`${base}/${value}${suffix}`)));
    EXISTS_CACHE.set(value, found);
    return found;
};

const literalHead = function literalHead(value: string): string {
    const segments = value.split("/");
    const wild = segments.findIndex((segment) => segment.includes("*") || segment.includes("{"));
    return wild === -1 ? value : segments.slice(0, wild).join("/");
};

const isDisqualified = function isDisqualified(value: string): boolean {
    if (value.length === 0 || value.includes(" ") || !value.includes("/")) {
        return true;
    }
    if (value.startsWith("@") || isSystemPath(value)) {
        return true;
    }
    return NON_PATH_PREFIXES.some((prefix) => value.startsWith(prefix));
};

export const isPathShaped = function isPathShaped(value: string): boolean {
    if (isDisqualified(value)) {
        return false;
    }
    const head = literalHead(value);
    const segments = head.split("/").filter((segment) => segment.length > 0);
    if (segments.length < MIN_PATH_SEGMENTS) {
        return false;
    }
    if (segments.length === MIN_PATH_SEGMENTS && MEDIA_TYPES.has(segments[0] ?? "")) {
        return false;
    }
    return resolvesOnDisk(head);
};

const holdsSsotCall = function holdsSsotCall(node: AstNode | null, ssotNames: ReadonlySet<string>): boolean {
    if (node === null) {
        return false;
    }
    if (node.type === "CallExpression" && ssotNames.has(calleeName(node))) {
        return true;
    }
    const children = [
        nodeAt(node, "left"),
        nodeAt(node, "right"),
        ...nodesAt(node, "expressions"),
        ...nodesAt(node, "arguments"),
    ];
    return children.some((child) => holdsSsotCall(child, ssotNames));
};

export const anchoredBySsot = function anchoredBySsot(node: AstNode, ssotNames: ReadonlySet<string>): boolean {
    let cursor = nodeAt(node, "parent");
    while (cursor !== null) {
        const composable = cursor.type === "TemplateLiteral" || cursor.type === "BinaryExpression";
        if (composable && holdsSsotCall(cursor, ssotNames)) {
            return true;
        }
        if (cursor.type === "CallExpression") {
            return nodesAt(cursor, "arguments").some((arg) => holdsSsotCall(arg, ssotNames));
        }
        if (cursor.type === "Program") {
            return false;
        }
        cursor = nodeAt(cursor, "parent");
    }
    return false;
};
