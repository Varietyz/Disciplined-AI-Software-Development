import {
    BUILD_SCRIPT_ROOT,
    FOUNDATION_SUBJECT,
    RULE_HOST,
    SCRIPT_ROOT,
    normalizePath,
    projectFiles,
} from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import type { TreeIndex, UnresolvedDeclaration } from "../../types/location.types.ts";
import { buildTreeIndex, resolvesAgainst } from "../../shared/loaders/index.loader.ts";
import {
    hintLiteralsOf,
    isPathLike,
    isSegmentLike,
    joinedPathsOf,
    stringLiteralsOf,
    stripComments,
} from "../../shared/matchers/location.matcher.ts";
import { readFileSync, readdirSync } from "node:fs";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import { listener } from "../../shared/factories/listener.factory.ts";
import { resolveFile } from "../../shared/matchers/filename.matcher.ts";

const ANCHOR_SUFFIX = `/${resolveFile(FOUNDATION_SUBJECT, "registry", projectFiles())}`;
const SELF = "closure-rule-declarations-resolve.eslint.rule.ts";

const DECLARING_ROOTS = [RULE_HOST, SCRIPT_ROOT, BUILD_SCRIPT_ROOT];

const declaresPaths = function declaresPaths(dir: string, name: string): boolean {
    if (dir !== RULE_HOST) {
        return true;
    }
    const text = readFileSync(join(dir, name), "utf8");
    return text.includes("meta:") && text.includes("create(");
};

const namesIn = function namesIn(dir: string): string[] {
    return readdirSync(dir);
};

const declaringFiles = function declaringFiles(): { dir: string; name: string }[] {
    return DECLARING_ROOTS.flatMap((dir) =>
        namesIn(dir)
            .filter((name) => name.endsWith(".ts") && name !== SELF && declaresPaths(dir, name))
            .map((name) => ({ dir, name })),
    );
};

const unresolvedIn = function unresolvedIn(index: TreeIndex, dir: string, file: string): UnresolvedDeclaration[] {
    const text = stripComments(readFileSync(join(dir, file), "utf8"));
    const hints = hintLiteralsOf(text);
    const joined = new Set(joinedPathsOf(text));
    const seen = new Set<string>();
    const isUnresolved = function isUnresolved(value: string): boolean {
        if (seen.has(value) || hints.has(value)) {
            return false;
        }
        const shaped = joined.has(value) ? isSegmentLike(value) : isPathLike(value);
        if (!shaped || resolvesAgainst(index, value)) {
            return false;
        }
        seen.add(value);
        return true;
    };
    return [...stringLiteralsOf(text), ...joined].filter(isUnresolved).map((value) => ({ file, value }));
};

const findUnresolved = function findUnresolved(): UnresolvedDeclaration[] {
    const index = buildTreeIndex();
    return declaringFiles().flatMap(({ dir, name }) => unresolvedIn(index, dir, name));
};

const UNRESOLVED = findUnresolved();

export default {
    create(context: RuleContext): RuleListener {
        if (!normalizePath(context.filename).endsWith(ANCHOR_SUFFIX)) {
            return {};
        }
        return listener({
            program(_view, node) {
                for (const entry of UNRESOLVED) {
                    const payload = { file: entry.file, value: entry.value };
                    context.report({ data: payload, messageId: "unresolved", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "Every path, folder fragment, and basename a lint rule or workspace script declares must resolve against the real tree, and every literal segment handed to a path join is treated as a path. Workspace locations belong in the paths SSOT (`@ssot/paths`); this rule covers the literals that never went through it. An absolute path under an operating-system root is a host location rather than a tree path and is outside the check. Anchored on the verify runner.",
        },
        messages: {
            unresolved:
                "`{{ file }}` declares `{{ value }}` but nothing in the tree matches it. Repoint it at the current path, or delete the declaration.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
