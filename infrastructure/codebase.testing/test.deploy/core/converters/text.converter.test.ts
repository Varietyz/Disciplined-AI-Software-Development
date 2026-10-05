import {
    BYTES_PER_GB,
    BYTES_PER_MB,
    ELLIPSIS,
    STAMP_SEPARATOR,
} from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { GIGABYTE, MEGABYTE } from "@banes-lab/deploy/configuration/strings/notification.strings.ts";
import { describe, expect, it } from "vitest";
import {
    formatBytes,
    formatClock,
    formatDuration,
    stamp,
    truncate,
} from "@banes-lab/deploy/core/converters/text.converter.ts";

describe("formatBytes", () => {
    it("reports megabytes below the gigabyte threshold", () => {
        expect(formatBytes(BYTES_PER_MB * 3)).toBe(`3.00${MEGABYTE}`);
    });

    it("reports gigabytes at and above the threshold", () => {
        expect(formatBytes(BYTES_PER_GB * 2)).toBe(`2.00${GIGABYTE}`);
    });
});

describe("formatDuration", () => {
    it("renders milliseconds as seconds with two decimals", () => {
        expect(formatDuration(1500)).toBe("1.50");
    });
});

describe("formatClock", () => {
    it("renders seconds as hours, minutes and seconds, and never below zero", () => {
        expect(formatClock(3725)).toBe("01:02:05");
        expect(formatClock(-4)).toBe("00:00:00");
    });
});

describe("stamp", () => {
    it("replaces every iso punctuation mark with the stamp separator", () => {
        const value = stamp();
        expect(value).not.toContain(":");
        expect(value).not.toContain("T");
        expect(value).toContain(STAMP_SEPARATOR);
    });
});

describe("truncate", () => {
    it("leaves short text untouched", () => {
        expect(truncate("short", 10, ELLIPSIS)).toBe("short");
    });

    it("cuts long text and appends the marker", () => {
        expect(truncate("a long sentence", 6, ELLIPSIS)).toBe(`a long${ELLIPSIS}`);
    });
});
