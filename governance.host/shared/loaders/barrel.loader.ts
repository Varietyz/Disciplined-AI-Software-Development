import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join as joinPath, resolve as resolvePath } from "node:path";
import type { BarrelPattern } from "../../types/closure.types.ts";
import { MEMBER_ROOT } from "../resolvers/anchor.resolver.ts";

const BARREL_MARKER = ".barrel.ts";
const GLOB_CALL = "import.meta.glob(";

const QUOTES = new Set(['"', "'"]);

const firstQuote = function firstQuote(text: string): number {
    for (let at = 0; at < text.length; at += 1) {
        if (QUOTES.has(text[at] ?? "")) {
            return at;
        }
    }
    return -1;
};

const memberRelative = function memberRelative(absDir: string): string {
    const posix = absDir.split("\\").join("/");
    return `${posix.slice(MEMBER_ROOT.split("\\").join("/").length + 1)}/`;
};

const globOf = function globOf(text: string): string | null {
    const at = text.indexOf(GLOB_CALL);
    if (at === -1) {
        return null;
    }
    const rest = text.slice(at + GLOB_CALL.length);
    const quote = firstQuote(rest);
    if (quote === -1) {
        return null;
    }
    const close = rest.indexOf(rest[quote] ?? '"', quote + 1);
    return rest.slice(quote + 1, close);
};

const patternOf = function patternOf(absDir: string, file: string): BarrelPattern | null {
    const glob = globOf(readFileSync(file, "utf8"));
    if (glob === null) {
        return null;
    }
    const star = glob.lastIndexOf("*");
    if (star === -1) {
        return null;
    }
    const globDir = glob.slice(0, glob.lastIndexOf("/") + 1);
    const dir = globDir.startsWith(".") ? memberRelative(resolvePath(absDir, globDir)) : memberRelative(absDir);
    return { dir, suffix: glob.slice(star + 1) };
};

const patternsUnder = function patternsUnder(absDir: string): BarrelPattern[] {
    return readdirSync(absDir).flatMap((name) => {
        const p = joinPath(absDir, name);
        if (statSync(p).isDirectory()) {
            return patternsUnder(p);
        }
        const pattern = name.endsWith(BARREL_MARKER) ? patternOf(absDir, p) : null;
        return pattern === null ? [] : [pattern];
    });
};

export const deriveBarrelPatterns = function deriveBarrelPatterns(): BarrelPattern[] {
    return existsSync(MEMBER_ROOT) ? patternsUnder(MEMBER_ROOT) : [];
};

const dirMatches = function dirMatches(file: string, dir: string): boolean {
    let cursor = 0;
    for (const fragment of dir.split("*")) {
        if (fragment === "") {
            continue;
        }
        const at = file.indexOf(fragment, cursor);
        if (at === -1) {
            return false;
        }
        cursor = at + fragment.length;
    }
    return true;
};

const basenameOf = function basenameOf(file: string): string {
    const idx = file.lastIndexOf("/");
    return idx === -1 ? file : file.slice(idx + 1);
};

export const matchesBarrelPattern = function matchesBarrelPattern(
    file: string,
    patterns: readonly BarrelPattern[],
): boolean {
    return patterns.some((p) => dirMatches(file, p.dir) && basenameOf(file).endsWith(p.suffix));
};
