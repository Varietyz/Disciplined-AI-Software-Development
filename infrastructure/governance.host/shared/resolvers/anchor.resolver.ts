import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import { existsSync, readdirSync } from "node:fs";
import { governedRoots, isDeclaredContainer, rootFor } from "../manifests/taxonomy.manifest.ts";
import { containerPath } from "./container.resolver.ts";
import { join } from "node:path";

const MEMBER_KEY = "app.member";

export const WORKSPACE_ROOT: string = ROOT;

export const PROJECT_ROOT: string = absolutePath("app.root");

export const MEMBER_ROOT: string = absolutePath(MEMBER_KEY);

export const BUILD_CONFIG_FILES: readonly string[] = [
    "vite.config.ts",
    "rollup.config.ts",
    "webpack.config.ts",
    "esbuild.config.ts",
    "tsup.config.ts",
    "build.config.ts",
];

export const TEST_ROOT: string = absolutePath("codebase.testing.app");

export const SCRIPT_ROOT: string = absolutePath("project.scripts");

export const BUILD_SCRIPT_ROOT: string = absolutePath("app.build");

export const RULE_HOST: string = absolutePath("govlabHost.rules");

export const GRAPH_PATH: string = absolutePath("govlabHost.reports.lint.closureGraph");

export const TEST_ROOT_SEGMENT = `${relativePath("codebase.testing")}/`;

export const SCRIPT_ROOT_SEGMENT = `/${relativePath("project.scripts")}/`;

export const BUILD_SCRIPT_ROOT_SEGMENT = `/${relativePath("app.build")}/`;

export const GOVERNED_ROOT = relativePath(MEMBER_KEY);

const RULE_TAG = ".eslint.rule";

export const labelOf = function labelOf(stem: string): string {
    return stem.endsWith(RULE_TAG) ? stem.slice(0, -RULE_TAG.length) : stem;
};

export const normalizePath = function normalizePath(path: string): string {
    return path.split("\\").join("/");
};

export const FOUNDATION_SUBJECT = "base";

export const TAXONOMY_SUBJECT = "taxonomy";

export const LAYER_SUBJECT = "layer";

export const ANCHOR_SUBJECT = "anchor";

export const LOCATION_SUBJECT = "location";

export const FOUNDATION_FOLDER = `/${FOUNDATION_SUBJECT}/`;

export const FOUNDATION_PREFIX = FOUNDATION_SUBJECT.slice(0, 1).toUpperCase() + FOUNDATION_SUBJECT.slice(1);

export const basenameOf = function basenameOf(path: string): string {
    const norm = normalizePath(path);
    const idx = norm.lastIndexOf("/");
    return idx === -1 ? norm : norm.slice(idx + 1);
};

export const collapsePath = function collapsePath(value: string): string {
    const out: string[] = [];
    for (const segment of value.split("/")) {
        if (segment === "..") {
            out.pop();
            continue;
        }
        if (segment !== "." && segment !== "") {
            out.push(segment);
        }
    }
    return out.join("/");
};

const GOVERNED_SEGMENTS: readonly string[] = governedRoots().map((root) => `/${root}/`);

export const isGovernedFile = function isGovernedFile(filename: string): boolean {
    const norm = normalizePath(filename);
    return GOVERNED_SEGMENTS.some((segment) => norm.includes(segment));
};

export const containerPathOf = function containerPathOf(filename: string, container: string): string | null {
    const root = rootFor(normalizePath(filename));
    if (root === undefined || !isDeclaredContainer(root, container)) {
        return null;
    }
    return `/${containerPath(container, root)}`;
};

export const isInContainer = function isInContainer(filename: string, container: string): boolean {
    const fragment = containerPathOf(filename, container);
    return fragment !== null && normalizePath(filename).includes(fragment);
};

export const SOURCE_EXTENSIONS: readonly string[] = [".ts", ".tsx", ".mts", ".cts"];

export const isSourceFile = function isSourceFile(filename: string): boolean {
    return SOURCE_EXTENSIONS.some((ext) => normalizePath(filename).endsWith(ext));
};

const rootRelative = function rootRelative(root: string): string {
    return root.slice(root.indexOf("/") + 1);
};

const belowRoot = function belowRoot(root: string, absPath: string): string {
    const absRoot = normalizePath(join(ROOT, root));
    return `${rootRelative(root)}/${normalizePath(absPath).slice(absRoot.length + 1)}`;
};

const collectDirs = function collectDirs(root: string, absDir: string): string[] {
    return readdirSync(absDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(absDir, entry.name))
        .flatMap((p) => [`${belowRoot(root, p)}/`, ...collectDirs(root, p)]);
};

const collectFiles = function collectFiles(root: string, absDir: string): string[] {
    return readdirSync(absDir, { withFileTypes: true }).flatMap((entry) => {
        const p = join(absDir, entry.name);
        return entry.isDirectory() ? collectFiles(root, p) : [belowRoot(root, p)];
    });
};

const presentRoots = function presentRoots(): { abs: string; root: string }[] {
    return governedRoots()
        .map((root) => ({ abs: join(ROOT, root), root }))
        .filter((entry) => existsSync(entry.abs));
};

export const projectDirs = function projectDirs(): string[] {
    return presentRoots().flatMap((entry) => collectDirs(entry.root, entry.abs));
};

export const projectFiles = function projectFiles(): string[] {
    return presentRoots().flatMap((entry) => collectFiles(entry.root, entry.abs));
};
