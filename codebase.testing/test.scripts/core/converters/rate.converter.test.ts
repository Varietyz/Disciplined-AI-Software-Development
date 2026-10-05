import { describe, expect, it } from "vitest";
import { RATES_ARGV } from "@project/scripts/configuration/configs/rate.config.ts";
import { REPORT_NAME } from "@project/scripts/configuration/constants/rate.constants.ts";
import { argvOf } from "@govlab/argv";
import { readRateOptions } from "@project/scripts/core/converters/rate.converter.ts";

describe("readRateOptions", () => {
    it("reads the rate, the window and the output, with defaults", () => {
        const read = readRateOptions(argvOf(RATES_ARGV, ["--rate", "850", "--months", "12", "--out", "r.md"]));
        expect([read.rate, read.months, read.out.endsWith("r.md")]).toStrictEqual([850, 12, true]);
        const bare = readRateOptions(argvOf(RATES_ARGV, []));
        expect([bare.rate, bare.months, bare.out.endsWith(REPORT_NAME)]).toStrictEqual([null, 24, true]);
    });
});
