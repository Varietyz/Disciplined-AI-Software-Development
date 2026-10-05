import {
    argumentsUnknown,
    awaitingMark,
    bodyInline,
    claimNoRecord,
    closureSettled,
    compressSettled,
    degradedHead,
    degradedInsideRecords,
    dischargeContended,
    emptyExtractionCheck,
    exclusiveCombined,
    fieldEmptied,
    fieldsCompressed,
    itemFenceMalformed,
    kindRequired,
    readersOutstanding,
    recordContended,
    stdinEmpty,
    surfaceContended,
    twinAdmitted,
    venueFieldAbsent,
    venueNoSweep,
    waitAllParked,
    waitSolitary,
    watchChanged,
    watchQuiet,
    watchRemoved,
    watching,
} from "coordination-surface/tools/core/strings/board.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

type Case = readonly [string, readonly (number | string)[]];

const TARGET = "probe-target";

const unnamed = function unnamed(cases: readonly Case[]): string[] {
    return cases.flatMap(([message, operands]) =>
        operands.map(String).flatMap((operand) => (message.includes(operand) ? [] : [`${message} lacks ${operand}`])),
    );
};

describe("the board messages about a surface that moved or settled", () => {
    it("name the surface, the seat, the item and the changed lines", () => {
        const cases: Case[] = [
            [recordContended(TARGET, "A", ["  + a changed line\n"]), [TARGET, "A", "a changed line"]],
            [itemFenceMalformed("A-7"), ["A-7"]],
            [surfaceContended(TARGET), [TARGET]],
            [dischargeContended(TARGET), [TARGET]],
            [closureSettled("A-7", TARGET), ["A-7", TARGET]],
            [compressSettled("A-7", TARGET), ["A-7", TARGET]],
            [readersOutstanding("A-7", ["B", "C"]), ["A-7", "B", "C"]],
            [twinAdmitted("A-7", "A-3"), ["A-7", "A-3"]],
            [venueNoSweep(TARGET), [TARGET]],
            [claimNoRecord(TARGET, "A"), [TARGET, "A"]],
            [awaitingMark(["B-2", "C-4"]), ["B-2", "C-4"]],
            [venueFieldAbsent("Needs"), ["Needs"]],
            [emptyExtractionCheck("2 classes filed"), ["2 classes filed"]],
        ];
        assert.deepEqual(unnamed(cases), []);
    });

    it("name what a compression removed, and read differently when it only previews", () => {
        assert.deepEqual(
            unnamed([
                [fieldsCompressed(TARGET, 3, 120, true), [TARGET, 3, 120]],
                [fieldEmptied("Status", TARGET, 40, true), ["Status", TARGET, 40]],
            ]),
            [],
        );
        assert.notEqual(fieldsCompressed(TARGET, 3, 120, true), fieldsCompressed(TARGET, 3, 120, false));
        assert.notEqual(fieldEmptied("Status", TARGET, 40, true), fieldEmptied("Status", TARGET, 40, false));
    });
});

describe("the board messages about arguments", () => {
    it("name the flag, the operand, the unknown and the known arguments", () => {
        const cases: Case[] = [
            [stdinEmpty("--body", "-"), ["--body", "-"]],
            [bodyInline("--body", "--body-file", "a long body", 90), ["--body", "--body-file", 90]],
            [argumentsUnknown(["--color"], ["--post", "--file"]), ["--color", "--post", "--file"]],
            [argumentsUnknown(["--a", "--b"], ["--post"]), ["--a", "--b"]],
            [exclusiveCombined(["--compress", "--post"], "--file"), ["--compress", "--post", "--file"]],
            [kindRequired(["artifact", "judgment"]), ["artifact", "judgment"]],
        ];
        assert.deepEqual(unnamed(cases), []);
    });
});

describe("the wait messages", () => {
    it("name the watched surface, the time waited and the seats counted", () => {
        const cases: Case[] = [
            [watchRemoved(TARGET), [TARGET]],
            [watchChanged(TARGET, 42), [TARGET, 42]],
            [watchQuiet(TARGET), [TARGET]],
            [watching(TARGET, 600, 2, 3), [TARGET, 600]],
            [waitSolitary(1, 0), [1]],
            [waitAllParked(3, 2), [3]],
            [degradedHead("A", 12, 90_000, TARGET), ["A", 12, TARGET]],
            [degradedInsideRecords(TARGET), [TARGET]],
        ];
        assert.deepEqual(unnamed(cases), []);
    });
});
