import { BOARD_PATH } from "../constants/board.constants.ts";
import type { Finding } from "../types/segment.types.ts";

export const boardFinding = function boardFinding(
    kind: string,
    line: number,
    locus: string,
    actual: string,
    expected: string,
    decide: string,
): Finding {
    return {
        actual,
        expected,
        healed: false,
        line,
        locus,
        path: BOARD_PATH,
        remediation: { action: "declare", decide, deterministic: false, from: locus, target: BOARD_PATH, to: null },
        rule: `board/${kind}`,
        stack: [
            { check: "board", resolved: "present" },
            { check: "record", resolved: locus },
            { check: kind, resolved: actual },
        ],
    };
};
