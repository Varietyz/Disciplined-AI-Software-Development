import { ROOT, paths } from "@ssot/paths";
import { memberRels } from "../loaders/manifest.loader.ts";

const ROOT_POSIX = ROOT.split("\\").join("/");

export const toPosix = function toPosix(value: string): string {
    return value.split("\\").join("/");
};

const collectDeclared = function collectDeclared(node: unknown, out: Set<string>): void {
    if (typeof node === "string") {
        const posix = toPosix(node);
        if (posix.startsWith(ROOT_POSIX) && posix.length > ROOT_POSIX.length) {
            out.add(posix.slice(ROOT_POSIX.length + 1));
        }
        return;
    }
    if (typeof node !== "object" || node === null) {
        return;
    }
    for (const value of Object.values(node)) {
        collectDeclared(value, out);
    }
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

export const MEMBER_ROOTS: readonly string[] = memberRels();

const build = function build(): string[] {
    const set = new Set<string>();
    collectDeclared(paths, set);
    for (const member of MEMBER_ROOTS) {
        set.add(member);
    }
    return [...set].sort((a, b) => b.length - a.length);
};

export const LOCATION_TOKENS: readonly string[] = build();

const SELF_KEY = "root";
const extraKeys = new Map<string, string>();

const keyIndex = function keyIndex(): Map<string, string> {
    const byPath = new Map<string, string>();
    const recordLocation = function recordLocation(location: string, trail: string[]): void {
        const dotted = trail.join(".");
        const branch = trail.at(-1) === SELF_KEY ? trail.slice(0, -1).join(".") : null;
        const preferred = branch ?? dotted;
        if (!byPath.has(location) || preferred.length < (byPath.get(location) ?? "").length) {
            byPath.set(location, preferred);
        }
        extraKeys.set(dotted, location);
        if (branch !== null) {
            extraKeys.set(branch, location);
        }
    };
    const walk = function walk(node: unknown, trail: string[]): void {
        if (typeof node === "string") {
            const posix = toPosix(node);
            if (posix.startsWith(`${ROOT_POSIX}/`)) {
                recordLocation(posix.slice(ROOT_POSIX.length + 1), trail);
            }
            return;
        }
        if (!isRecord(node)) {
            return;
        }
        for (const [key, value] of Object.entries(node)) {
            walk(value, [...trail, key]);
        }
    };
    walk(paths, []);
    return byPath;
};

const KEY_BY_LOCATION = keyIndex();

export const keyForLocation = function keyForLocation(location: string): string | null {
    return KEY_BY_LOCATION.get(toPosix(location)) ?? null;
};

export const locationForKey = function locationForKey(key: string): string | null {
    return extraKeys.get(key) ?? null;
};

export const tokenIn = function tokenIn(value: string): string | null {
    const posix = toPosix(value);
    for (const token of LOCATION_TOKENS) {
        if (
            posix === token ||
            posix.startsWith(`${token}/`) ||
            posix.includes(`/${token}/`) ||
            posix.endsWith(`/${token}`)
        ) {
            return token;
        }
    }
    return null;
};
