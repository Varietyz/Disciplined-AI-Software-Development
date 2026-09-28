import type { Finding, Remediation } from "../types/segment.types.ts";
import { basename, dirname } from "node:path";

export const rootOf = function rootOf(path: string, roots: readonly string[]): string | null {
    for (const root of roots) {
        if (path.startsWith(`${root}/`)) {
            return root;
        }
    }
    return null;
};

export const remediate = function remediate(path: string, expected: string | null, decide: string): Remediation {
    return {
        action: "rename",
        decide: expected === null ? decide : null,
        deterministic: expected !== null,
        from: basename(path),
        target: dirname(path),
        to: expected,
    };
};

export const countBy = function countBy<T>(items: readonly T[], pick: (item: T) => string): Record<string, number> {
    const out: Record<string, number> = {};
    for (const item of items) {
        const key = pick(item);
        out[key] = (out[key] ?? 0) + 1;
    }
    return out;
};

export const unresolvedFinding = function unresolvedFinding(
    path: string,
    locus: string,
    actual: string,
    decide: string,
): Finding {
    return {
        actual,
        expected: null,
        healed: false,
        line: 0,
        locus,
        path,
        remediation: { action: "declare", decide, deterministic: false, from: actual, target: path, to: null },
        rule: "corpus/unresolved",
        stack: [
            { check: "corpusRoot", resolved: "declared" },
            { check: locus, resolved: actual },
        ],
    };
};
