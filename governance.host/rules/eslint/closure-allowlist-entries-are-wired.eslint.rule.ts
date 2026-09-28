import {
    BUILD_CONFIG_FILES,
    BUILD_SCRIPT_ROOT,
    FOUNDATION_SUBJECT,
    MEMBER_ROOT,
    SCRIPT_ROOT,
    TEST_ROOT,
    normalizePath,
    projectFiles,
} from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener, RuleNode } from "../../types/rule.types.ts";
import { basename, join } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { STAGED_FUTURE_ALLOWLIST } from "../../shared/allowlists/export.allowlist.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { resolveFile } from "../../shared/matchers/filename.matcher.ts";

const ROOT = MEMBER_ROOT;
const ANCHOR_FILE = resolveFile(FOUNDATION_SUBJECT, "registry", projectFiles());

interface AllowlistEntry {
    file: string;
    symbol: string;
}

interface SourceIndex {
    bodies: { path: string; text: string }[];
    globSuffixes: string[];
    importedBasenames: Set<string>;
}

const walk = function walk(dir: string): string[] {
    if (!existsSync(dir)) {
        return [];
    }
    const out: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...walk(full));
            continue;
        }
        if (entry.name.endsWith(".ts")) {
            out.push(full);
        }
    }
    return out;
};

const readEntries = function readEntries(): AllowlistEntry[] {
    return STAGED_FUTURE_ALLOWLIST.map((entry) => {
        const split = entry.file.indexOf("::");
        if (split === -1) {
            return { file: entry.file, symbol: "" };
        }
        return { file: entry.file.slice(0, split), symbol: entry.file.slice(split + 2) };
    });
};

const buildIndex = function buildIndex(): SourceIndex {
    const rootFiles = BUILD_CONFIG_FILES.map((name) => join(ROOT, name)).filter((p) => existsSync(p));
    const files = [...walk(ROOT), ...walk(TEST_ROOT), ...walk(SCRIPT_ROOT), ...walk(BUILD_SCRIPT_ROOT), ...rootFiles];
    const importedBasenames = new Set<string>();
    const globSuffixes: string[] = [];
    const bodies: { path: string; text: string }[] = [];
    for (const file of files) {
        const text = readFileSync(file, "utf8");
        bodies.push({ path: normalizePath(file), text });
        for (const part of text.split('from "').slice(1)) {
            const spec = part.slice(0, part.indexOf('"'));
            if (spec.endsWith(".ts")) {
                importedBasenames.add(basename(spec));
            }
        }
        for (const part of text.split('import "').slice(1)) {
            const spec = part.slice(0, part.indexOf('"'));
            if (spec.endsWith(".ts")) {
                importedBasenames.add(basename(spec));
            }
        }
        for (const part of text.split('import.meta.glob("./').slice(1)) {
            const spec = part.slice(0, part.indexOf('"'));
            globSuffixes.push(spec.split("*").join(""));
        }
    }
    return { bodies, globSuffixes, importedBasenames };
};

const moduleIsLive = function moduleIsLive(file: string, index: SourceIndex): boolean {
    const base = basename(file);
    return index.importedBasenames.has(base) || index.globSuffixes.some((suffix) => base.endsWith(suffix));
};

const EXPORT_KEYWORDS = [
    "export const ",
    "export let ",
    "export function ",
    "export async function ",
    "export function* ",
    "export async function* ",
    "export class ",
    "export abstract class ",
    "export interface ",
    "export type ",
    "export enum ",
    "export declare const ",
    "export declare function ",
];

const fileExportsSymbol = function fileExportsSymbol(entry: AllowlistEntry): boolean {
    const text = readFileSync(join(ROOT, entry.file), "utf8");
    if (EXPORT_KEYWORDS.some((keyword) => text.includes(keyword + entry.symbol))) {
        return true;
    }
    return text.includes("export {") && text.includes(entry.symbol);
};

const referencedElsewhere = function referencedElsewhere(entry: AllowlistEntry, index: SourceIndex): boolean {
    const target = normalizePath(join(ROOT, entry.file));
    return index.bodies.some((body) => body.path !== target && body.text.includes(entry.symbol));
};

const verdictFor = function verdictFor(entry: AllowlistEntry, index: SourceIndex): string | null {
    if (!existsSync(join(ROOT, entry.file))) {
        return "stale";
    }
    const live = moduleIsLive(entry.file, index);
    if (entry.symbol === "") {
        return live ? null : "unwired";
    }
    if (!fileExportsSymbol(entry)) {
        return "gone";
    }
    return live || referencedElsewhere(entry, index) ? null : "orphan";
};

type Emit = (context: RuleContext, payload: Record<string, string>, at: RuleNode) => void;

const EMITTERS: Record<string, Emit> = {
    gone: (context, payload, at) => {
        context.report({ data: payload, messageId: "gone", node: at });
    },
    orphan: (context, payload, at) => {
        context.report({ data: payload, messageId: "orphan", node: at });
    },
    stale: (context, payload, at) => {
        context.report({ data: payload, messageId: "stale", node: at });
    },
    unwired: (context, payload, at) => {
        context.report({ data: payload, messageId: "unwired", node: at });
    },
};

export default {
    create(context: RuleContext): RuleListener {
        if (!normalizePath(context.filename).endsWith(ANCHOR_FILE)) {
            return {};
        }
        return listener({
            program(_view, node) {
                const index = buildIndex();
                for (const entry of readEntries()) {
                    const messageId = verdictFor(entry, index);
                    if (messageId === null) {
                        continue;
                    }
                    const payload = { file: entry.file, symbol: entry.symbol };
                    EMITTERS[messageId]?.(context, payload, node);
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: ["architecture:zombie-code"], enforces: [] }),
            description:
                "The staged-future allowlist may only hold wired capability: an export whose module something imports, directly or through a glob barrel, waiting on a consumer. Both entry shapes are held to that bar — a `file::symbol` entry names one export, a bare `file` entry covers the whole module.",
        },
        messages: {
            gone: "Allowlist entry `{{file}}::{{symbol}}` names a symbol `{{file}}` does not export. Delete or update the entry.",
            orphan: "Allowlist entry `{{file}}::{{symbol}}` is not wired: nothing imports `{{file}}`, directly or through a glob barrel. Delete the module and the entry.",
            stale: "Allowlist entry `{{file}}` points at a file that does not exist. Delete the entry.",
            unwired:
                "Allowlist entry `{{file}}` covers a whole file that nothing imports, directly or through a glob barrel. Wire it into a consumer, or delete the module and the entry.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
