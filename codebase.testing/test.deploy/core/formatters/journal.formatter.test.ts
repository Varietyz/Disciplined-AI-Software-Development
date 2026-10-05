import { TIME_UNKNOWN, transferLine } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { describe, expect, it } from "vitest";
import { percentOf, transferLineOf } from "@banes-lab/deploy/core/formatters/journal.formatter.ts";
import { BYTES_PER_MB } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";

const STATE = {
    done: 250,
    failed: 1,
    label: "Upload",
    size: 100 * BYTES_PER_MB,
    startedAt: 0,
    total: 1000,
    transferred: 25 * BYTES_PER_MB,
    unit: "file(s)",
};

describe("percentOf and transferLineOf", () => {
    it("measures progress by bytes when the size is known, and by items when it is not", () => {
        expect(percentOf(STATE)).toBe(25);
        expect(percentOf({ ...STATE, size: 0 })).toBe(25);
    });

    it("draws the bar with done, total, bytes, rate, time left and failures", () => {
        const line = transferLineOf(STATE, 10_000);
        expect(line).toContain("Upload ");
        expect(line).toContain("25%: 250 of 1,000 file(s), 25.00 MB of 100.00 MB at 2.50 MB/s");
        expect(line).toContain("00:00:30 left, 1 failed");
        expect(transferLineOf(STATE, 0)).toContain(`${TIME_UNKNOWN} left`);
        const view = {
            bar: "#",
            done: "1",
            failed: "0",
            label: "Upload",
            left: "00:00:01",
            moved: "1 MB",
            percent: "50",
            rate: "1 MB",
            size: "2 MB",
            total: "2",
            unit: "file(s)",
        };
        expect(transferLine(view)).toBe(
            "Upload # 50%: 1 of 2 file(s), 1 MB of 2 MB at 1 MB/s, 00:00:01 left, 0 failed",
        );
    });
});
