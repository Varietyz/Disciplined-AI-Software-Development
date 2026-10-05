import { belowFloor, failuresFound, floorHeld } from "#configuration/strings/coverage.strings";
import type { CheckVerdict } from "#types/validation.types";
import { isRecord } from "@banes-lab/build-scripts/core/selectors/base.selector.ts";

const countAt = function countAt(report: unknown, key: string): number {
    const found = isRecord(report) ? report[key] : undefined;
    return typeof found === "number" ? found : 0;
};

export const floorVerdict = function floorVerdict(report: unknown, floor: number): CheckVerdict {
    const passed = countAt(report, "numPassedTests");
    const failed = countAt(report, "numFailedTests");
    if (failed > 0) {
        return { held: false, text: failuresFound(failed) };
    }
    if (passed < floor) {
        return { held: false, text: belowFloor(passed, countAt(report, "numTotalTests"), floor) };
    }
    return { held: true, text: floorHeld(passed, floor) };
};
