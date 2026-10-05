import { dirname, extname, join } from "node:path";
import type { DeadScriptRef } from "#types/finding.types";
import { existsSync } from "node:fs";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { readJsonSafe } from "#core/loaders/base.loader";
import { tokenizeCommand } from "#core/lexers/shell.lexer";

const SCRIPT_PATH_EXTENSIONS: ReadonlySet<string> = new Set([".js", ".mjs", ".cjs", ".ts", ".sh"]);
const TOKEN_EDGES: ReadonlySet<string> = new Set(['"', "'", "`", ";", ",", "(", ")"]);
const PATH_BREAKERS: readonly string[] = ["*", "{", "}", "<", ">", "$", "://"];
const PATH_SEPARATOR = "/";
const FLAG_PREFIX = "-";
const SCOPE_PREFIX = "@";
const VENDOR_PREFIX = "node_modules/";

const trimToken = function trimToken(token: string): string {
    let start = 0;
    let end = token.length;
    while (start < end && TOKEN_EDGES.has(token.charAt(start))) {
        start += 1;
    }
    while (end > start && TOKEN_EDGES.has(token.charAt(end - 1))) {
        end -= 1;
    }
    return token.slice(start, end);
};

const isScriptPath = function isScriptPath(token: string): boolean {
    if (!token.includes(PATH_SEPARATOR) || token.startsWith(FLAG_PREFIX) || token.startsWith(SCOPE_PREFIX)) {
        return false;
    }
    if (token.startsWith(VENDOR_PREFIX) || PATH_BREAKERS.some((breaker) => token.includes(breaker))) {
        return false;
    }
    return SCRIPT_PATH_EXTENSIONS.has(extname(token).toLowerCase());
};

const scriptTokens = function scriptTokens(command: unknown): string[] {
    return typeof command === "string"
        ? [...new Set(tokenizeCommand(command).map(trimToken).filter(isScriptPath))]
        : [];
};

export const deadScriptRefs = function deadScriptRefs(pkgPath: string): DeadScriptRef[] {
    const pkg = readJsonSafe(pkgPath);
    const scripts = isPlainRecord(pkg) ? pkg["scripts"] : undefined;
    if (!isPlainRecord(scripts)) {
        return [];
    }
    const pkgDir = dirname(pkgPath);
    return Object.entries(scripts).flatMap(([script, command]) =>
        scriptTokens(command)
            .filter((path) => !existsSync(join(pkgDir, path)))
            .map((path) => ({ path, script })),
    );
};
