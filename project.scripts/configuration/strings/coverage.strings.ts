export const reportMissing = function reportMissing(report: string): string {
    return `test-floor-check: ${report} is missing, so the test step did not run or was skipped\n`;
};

export const failuresFound = function failuresFound(failed: number): string {
    return `test-floor-check: ${String(failed)} test failure(s). The test step must be green first\n`;
};

export const belowFloor = function belowFloor(passed: number, total: number, floor: number): string {
    return `test-floor-check: ${String(passed)} passing test(s) of ${String(total)}, and the floor is ${String(floor)}. Restore the missing tests, or lower the floor where a test was removed on purpose\n`;
};

export const floorHeld = function floorHeld(passed: number, floor: number): string {
    return `test-floor-check: ${String(passed)} passing test(s), at or above the floor of ${String(floor)}\n`;
};
