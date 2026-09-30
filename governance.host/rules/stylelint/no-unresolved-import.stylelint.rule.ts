import type { AtRule, Root } from "postcss";
import { dirname, resolve } from "node:path";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import { createRequire } from "node:module";
import { defineCheck } from "@govlab/context/check";
import { existsSync } from "node:fs";

const { createPlugin, utils } = stylelint;
const ruleName = "local/no-unresolved-import";

defineCheck({ detects: [], enforces: ["architecture:fail-fast"] });

const IMPORT_NAME = "import";
const URL_OPEN = "url(";
const URL_CLOSE = ")";
const QUOTES = new Set(["'", '"']);
const RELATIVE_MARK = ".";
const ROOT_MARK = "/";
const SCHEME_MARK = ":";
const UNRESOLVED_CODES: ReadonlySet<string> = new Set(["ERR_PACKAGE_PATH_NOT_EXPORTED", "MODULE_NOT_FOUND"]);

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const unquoted = function unquoted(text: string): string {
    const trimmed = text.trim();
    const first = trimmed.charAt(0);
    return QUOTES.has(first) && trimmed.endsWith(first) && trimmed.length > 1 ? trimmed.slice(1, -1) : trimmed;
};

const quotedHead = function quotedHead(params: string): string | null {
    const first = params.charAt(0);
    const close = QUOTES.has(first) ? params.indexOf(first, 1) : -1;
    return close === -1 ? null : params.slice(1, close);
};

const importTargetOf = function importTargetOf(params: string): string | null {
    const trimmed = params.trim();
    if (trimmed.toLowerCase().startsWith(URL_OPEN)) {
        const close = trimmed.indexOf(URL_CLOSE, URL_OPEN.length);
        return close === -1 ? null : unquoted(trimmed.slice(URL_OPEN.length, close));
    }
    return quotedHead(trimmed);
};

const isLocal = function isLocal(target: string): boolean {
    return !target.includes(SCHEME_MARK) && !target.startsWith(ROOT_MARK);
};

const resolves = function resolves(target: string, from: string): boolean {
    if (target.startsWith(RELATIVE_MARK)) {
        return existsSync(resolve(dirname(from), target));
    }
    try {
        return existsSync(createRequire(from).resolve(target));
    } catch (error) {
        if (isRecord(error) && UNRESOLVED_CODES.has(String(error["code"]))) {
            return false;
        }
        throw error;
    }
};

const messages = utils.ruleMessages(ruleName, {
    unresolved: (target: string): string =>
        `The import '${target}' names no file on disk, so the build drops every rule it would bring in and only warns. Point the import at the sheet's current location, or remove it when the sheet is gone.`,
});

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            const from = root.source?.input.file;
            if (primary !== true || from === undefined) {
                return;
            }
            root.walkAtRules(IMPORT_NAME, (atRule: AtRule) => {
                const target = importTargetOf(atRule.params);
                if (target !== null && isLocal(target) && !resolves(target, from)) {
                    utils.report({
                        message: messages.unresolved(target),
                        node: atRule,
                        result,
                        ruleName,
                        word: target,
                    });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
