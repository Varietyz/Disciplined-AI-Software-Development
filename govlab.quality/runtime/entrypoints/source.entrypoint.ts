import { ROOT as WORKSPACE_ROOT, absolutePath, relativePath } from "@ssot/paths";
import { basename, relative } from "node:path";
import {
    builtTargetFailed,
    declarationFailed,
    distImportFailed,
    jsConfigFailed,
    jsGlobFailed,
    jsSourceFailed,
    tsOnlyClean,
} from "#configuration/strings/source.strings";
import { isRecord, recordsAt, stringField } from "#core/selectors/record.selector";
import { readJsonFile, walkFiles } from "#core/loaders/source.loader";
import { defineCheck } from "@govlab/context/check";
import { excludeMatcher } from "#core/factories/exclusions.factory";
import { readFileSync } from "node:fs";

defineCheck({ detects: [], enforces: ["architecture:standardization"] });

const ALLOWLIST_FILE = "source.typescript.allowlist.json";

const repoRoot = WORKSPACE_ROOT;
const allowlist = readJsonFile(absolutePath("govlab.quality.allowlists", ALLOWLIST_FILE));
const allow = new Set(
    recordsAt(isRecord(allowlist) ? allowlist : {}, "exceptions").map((entry) =>
        stringField(entry, "path").split("\\").join("/"),
    ),
);

const isExcluded = await excludeMatcher(process.cwd());
const FORBIDDEN_EXT = new Set([".js", ".mjs", ".cjs", ".jsx"]);
const JS_CONFIG_MARKERS = ['"allowJs":true', '"checkJs":true', '"checkJs":false'];
const JS_GLOB_EXTS = [".js", ".mjs", ".cjs", ".jsx"];
const QUOTE_CHARS = new Set(['"', "'", "`"]);

const isConsumerConfig = function isConsumerConfig(name: string): boolean {
    return name === relativePath("govlabHost.config") || name === "govlab.config.js" || name === "govlab.config.mjs";
};

interface GlobScanState {
    quote: string | null;
    buf: string;
    found: string[];
}

const isJsGlob = function isJsGlob(candidate: string): boolean {
    return candidate.includes("*") && JS_GLOB_EXTS.some((ext) => candidate.endsWith(ext));
};

const scanGlobChar = function scanGlobChar(state: GlobScanState, ch: string): GlobScanState {
    if (state.quote === null && QUOTE_CHARS.has(ch)) {
        return { ...state, buf: "", quote: ch };
    }
    if (state.quote !== null && ch === state.quote) {
        const found = isJsGlob(state.buf) ? [...state.found, state.buf] : state.found;
        return { ...state, found, quote: null };
    }
    if (state.quote !== null) {
        return { ...state, buf: state.buf + ch };
    }
    return state;
};

const jsCoverageGlobs = function jsCoverageGlobs(text: string): string[] {
    let state: GlobScanState = { buf: "", found: [], quote: null };
    for (const ch of text) {
        state = scanGlobChar(state, ch);
    }
    return state.found;
};

const compact = function compact(text: string): string {
    let out = "";
    for (const ch of text) {
        if (ch !== " " && ch !== "\n" && ch !== "\t" && ch !== "\r") {
            out += ch;
        }
    }
    return out;
};

const isTsconfig = function isTsconfig(name: string): boolean {
    return name.startsWith("tsconfig") && name.endsWith(".json");
};

const extensionOf = function extensionOf(name: string): string {
    const dot = name.lastIndexOf(".");
    return dot === -1 ? "" : name.slice(dot);
};

const collectExportTargets = function collectExportTargets(value: unknown): string[] {
    if (typeof value === "string") {
        return [value];
    }
    if (isRecord(value)) {
        return Object.values(value).flatMap((nested) => collectExportTargets(nested));
    }
    return [];
};

const isBuiltJsTarget = function isBuiltJsTarget(target: string): boolean {
    if (target.includes("/dist/") || target.startsWith("dist/") || target.startsWith("./dist/")) {
        return true;
    }
    return target.endsWith(".js") || target.endsWith(".cjs") || target.endsWith(".mjs");
};

const IMPORT_TOKEN = "import(";
const DIST_IMPORT_WINDOW = 220;
const COMPUTED_MARKERS = ["resolve(", "pathToFileURL", '"./', '"../', "'./", "'../", "`./", "`../"];
const SOURCE_EXT = new Set([".ts", ".mts", ".cts", ".tsx"]);

const importsOurDist = function importsOurDist(text: string): boolean {
    let from = 0;
    for (;;) {
        const idx = text.indexOf(IMPORT_TOKEN, from);
        if (idx === -1) {
            return false;
        }
        const window = new Set(text.slice(idx, idx + DIST_IMPORT_WINDOW));
        if (window.has("dist") && COMPUTED_MARKERS.some((marker) => window.has(marker))) {
            return true;
        }
        from = idx + IMPORT_TOKEN.length;
    }
};

const hostPackageTargets = function hostPackageTargets(file: string): string[] {
    const pkg = readJsonFile(file);
    if (!isRecord(pkg)) {
        return [];
    }
    const main = typeof pkg["main"] === "string" ? [pkg["main"]] : [];
    return [...main, ...collectExportTargets(pkg["exports"])];
};

const files = walkFiles(repoRoot, isExcluded);
const errors: string[] = [];
const dtsErrors: string[] = [];
const pkgErrors: string[] = [];
const configErrors: string[] = [];
const globErrors: string[] = [];
const distImportErrors: string[] = [];

for (const file of files) {
    const rel = relative(repoRoot, file).split("\\").join("/");
    const name = basename(file);
    const ext = extensionOf(name);
    if (FORBIDDEN_EXT.has(ext) && !allow.has(rel)) {
        errors.push(rel);
    }
    if (name.endsWith(".d.ts") && !allow.has(rel)) {
        dtsErrors.push(rel);
    }
    if (
        SOURCE_EXT.has(ext) &&
        !name.endsWith(".d.ts") &&
        !allow.has(rel) &&
        importsOurDist(readFileSync(file, "utf8"))
    ) {
        distImportErrors.push(rel);
    }
    if (isTsconfig(name) && !allow.has(rel)) {
        const contents = compact(readFileSync(file, "utf8"));
        configErrors.push(
            ...JS_CONFIG_MARKERS.filter((marker) => contents.includes(marker)).map((marker) => `${rel} (${marker})`),
        );
    }
    if (isConsumerConfig(name) && !allow.has(rel)) {
        for (const glob of jsCoverageGlobs(readFileSync(file, "utf8"))) {
            globErrors.push(`${rel} (${glob})`);
        }
    }
    if (name === "package.json" && !allow.has(rel)) {
        pkgErrors.push(
            ...hostPackageTargets(file)
                .filter(isBuiltJsTarget)
                .map((target) => `${rel} (${target})`),
        );
    }
}

const reportErrors = function reportErrors(list: string[], header: string): void {
    if (list.length === 0) {
        return;
    }
    process.stderr.write(header);
    for (const item of list) {
        process.stderr.write(`  - ${item}\n`);
    }
};

const failures =
    errors.length +
    dtsErrors.length +
    pkgErrors.length +
    configErrors.length +
    globErrors.length +
    distImportErrors.length;
if (failures > 0) {
    reportErrors(errors, jsSourceFailed(errors.length));
    reportErrors(dtsErrors, declarationFailed(dtsErrors.length));
    reportErrors(pkgErrors, builtTargetFailed(pkgErrors.length));
    reportErrors(globErrors, jsGlobFailed(globErrors.length));
    reportErrors(configErrors, jsConfigFailed(configErrors.length));
    reportErrors(distImportErrors, distImportFailed(distImportErrors.length));
    process.exit(1);
}
process.stdout.write(tsOnlyClean(files.length));
