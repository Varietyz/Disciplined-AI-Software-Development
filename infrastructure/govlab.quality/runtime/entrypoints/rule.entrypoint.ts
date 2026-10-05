import { RULE_DERIVATION_CLEAN, ruleDerivationFailed } from "#configuration/strings/validation.strings";
import { ROOT as WORKSPACE_ROOT, absolutePath } from "@ssot/paths";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

defineCheck({ detects: ["architecture:hardcoded-configuration"], enforces: ["architecture:single-source-of-truth"] });

interface Finding {
    rule: string;
    line: number;
    value: string;
    kind: "concern" | "folder" | "path";
    tag: string;
}

const RULE_HOST = absolutePath("govlabHost.rules");
const TAXONOMY_CONFIG = absolutePath("govlabHost.taxonomy");
const GOVERNED_SRC = absolutePath("app.member");
const MIN_PATH_SEGMENTS = 2;

const posix = function posix(value: string): string {
    return value.split("\\").join("/");
};

const collectDirs = function collectDirs(): Set<string> {
    const dirs = new Set<string>();
    const walk = function walk(absDir: string): void {
        for (const name of readdirSync(absDir)) {
            const p = join(absDir, name);
            if (!statSync(p).isDirectory()) {
                continue;
            }
            dirs.add(`${posix(p.slice(WORKSPACE_ROOT.length + 1))}/`);
            walk(p);
        }
    };
    if (existsSync(GOVERNED_SRC)) {
        walk(GOVERNED_SRC);
    }
    return dirs;
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const stringField = function stringField(value: unknown, key: string): string {
    return isRecord(value) && typeof value[key] === "string" ? value[key] : "";
};

const arrayField = function arrayField(value: unknown, key: string): unknown[] {
    const declared = isRecord(value) ? value[key] : undefined;
    return Array.isArray(declared) ? declared : [];
};

const tagsOf = function tagsOf(rows: unknown[], key: string): Set<string> {
    return new Set(rows.map((row) => stringField(row, key)).filter((tag) => tag.length > 0));
};

const loadTaxonomy = async function loadTaxonomy(): Promise<{
    concerns: Set<string>;
    folders: Set<string>;
    markers: Set<string>;
}> {
    const loaded: unknown = await import(pathToFileURL(TAXONOMY_CONFIG).href);
    const taxonomy = isRecord(loaded) ? loaded["taxonomy"] : undefined;
    const rows = arrayField(taxonomy, "concerns");
    const grammar = isRecord(taxonomy) ? taxonomy["grammar"] : undefined;
    return {
        concerns: tagsOf(rows, "tag"),
        folders: tagsOf(rows, "folder"),
        markers: new Set(
            arrayField(grammar, "compoundMarkers").filter((marker): marker is string => typeof marker === "string"),
        ),
    };
};

const DIRS = collectDirs();
const { concerns, folders, markers } = await loadTaxonomy();

const concernFolderSegment = function concernFolderSegment(value: string): string | null {
    if (!value.includes("/")) {
        return null;
    }
    for (const segment of posix(value).split("/")) {
        if (segment !== "" && folders.has(segment)) {
            return segment;
        }
    }
    return null;
};

const structuralPath = function structuralPath(value: string): boolean {
    if (!value.includes("/")) {
        return false;
    }
    const norm = posix(value);
    if (norm.split("/").filter((s) => s.length > 0).length < MIN_PATH_SEGMENTS) {
        return false;
    }
    const trimmed = norm.startsWith("/") ? norm.slice(1) : norm;
    const withSlash = trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
    for (const dir of DIRS) {
        if (dir === withSlash || dir.endsWith(`/${withSlash}`) || dir.endsWith(withSlash)) {
            return true;
        }
    }
    return false;
};

const concernSuffix = function concernSuffix(value: string): string | null {
    if (!value.endsWith(".ts") && !value.endsWith(".css")) {
        return null;
    }
    const head = value.slice(0, value.lastIndexOf("."));
    const tag = head.slice(head.lastIndexOf(".") + 1);
    if (tag === "" || tag === head || markers.has(tag) || !concerns.has(tag)) {
        return null;
    }
    return tag;
};

const QUOTE = '"';

const doubleQuoted = function doubleQuoted(line: string): string[] {
    const out: string[] = [];
    let at = line.indexOf(QUOTE);
    while (at !== -1) {
        const close = line.indexOf(QUOTE, at + 1);
        if (close === -1) {
            return out;
        }
        const body = line.slice(at + 1, close);
        if (body.length > 0 && !body.includes("\\")) {
            out.push(body);
        }
        at = line.indexOf(QUOTE, close + 1);
    }
    return out;
};

const isRuleFile = function isRuleFile(name: string, text: string): boolean {
    if (!name.endsWith(".ts") || name.startsWith("_") || name.endsWith(".generated.ts")) {
        return false;
    }
    return text.includes("meta:") && text.includes("create(");
};

const literalFinding = function literalFinding(value: string): { kind: Finding["kind"]; tag: string } | null {
    if (value.includes(" ")) {
        return null;
    }
    if (structuralPath(value)) {
        return { kind: "path", tag: "" };
    }
    const tag = concernSuffix(value);
    if (tag !== null) {
        return { kind: "concern", tag };
    }
    const folder = concernFolderSegment(value);
    return folder === null ? null : { kind: "folder", tag: folder };
};

const findingsInLine = function findingsInLine(rule: string, line: string, index: number): Finding[] {
    if (line.trimStart().startsWith("import ") || line.includes('from "')) {
        return [];
    }
    return doubleQuoted(line).flatMap((value): Finding[] => {
        const found = literalFinding(value);
        return found === null ? [] : [{ kind: found.kind, line: index + 1, rule, tag: found.tag, value }];
    });
};

const ruleFiles = function ruleFiles(): { name: string; text: string }[] {
    const files: { name: string; text: string }[] = [];
    for (const name of readdirSync(RULE_HOST).sort((a, b) => a.localeCompare(b))) {
        const abs = join(RULE_HOST, name);
        const text = statSync(abs).isDirectory() ? "" : readFileSync(abs, "utf8");
        if (isRuleFile(name, text)) {
            files.push({ name, text });
        }
    }
    return files;
};

const scan = function scan(): Finding[] {
    return ruleFiles().flatMap(({ name, text }) =>
        text.split("\n").flatMap((line, index) => findingsInLine(name, line, index)),
    );
};

const findings = scan();

if (findings.length === 0) {
    process.stdout.write(RULE_DERIVATION_CLEAN);
    process.exit(0);
}

process.stderr.write(ruleDerivationFailed(findings.length));
for (const f of findings) {
    const why = {
        concern: `builds a filename from declared concern tag '${f.tag}' — key on parseFilename instead`,
        folder: `embeds the declared concern folder '${f.tag}' — derive it with concernFolders('${f.tag}')`,
        path: `names a real directory in the governed tree — walk for it`,
    }[f.kind];
    process.stderr.write(`  ${f.rule}:${f.line}  "${f.value}"  ${why}\n`);
}
process.exit(1);
