import type { Finding } from "../types/segment.types.ts";

export const blockingFinding = function blockingFinding(
    kind: string,
    path: string,
    actual: string,
    expected: string,
    decide: string,
    anchor = "",
): Finding {
    return {
        actual,
        expected,
        healed: false,
        line: 1,
        locus: anchor.length === 0 ? path : anchor,
        path,
        remediation: { action: "declare", decide, deterministic: false, from: path, target: path, to: null },
        rule: `blocking/${kind}`,
        stack: [
            { check: "blocking", resolved: path },
            { check: kind, resolved: actual },
        ],
    };
};
