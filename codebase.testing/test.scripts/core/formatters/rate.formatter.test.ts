import {
    ARCHITECTS_GROUP,
    RATE_COLUMN,
    countMismatch,
    countedLine,
    holdingLine,
    rateColumnNote,
    reportWritten,
    sourceAnswered,
    sourceLine,
} from "@project/scripts/configuration/strings/rate.strings.ts";
import { NEWEST, PAGE } from "../analyzers/rate.fixture.ts";
import { PEER_GROUPS, RATE_SOURCE } from "@project/scripts/configuration/constants/rate.constants.ts";
import { dayOf, formatReport } from "@project/scripts/core/formatters/rate.formatter.ts";
import { describe, expect, it } from "vitest";
import { recordsIn } from "@project/scripts/core/selectors/rate.selector.ts";
import { summarize } from "@project/scripts/core/analyzers/rate.analyzer.ts";

const records = recordsIn(PAGE);
const base = {
    counted: records,
    fetchedOn: "2026-09-26",
    months: 24,
    records,
    statedCount: 4,
    statedUpdate: "23 Mar 2026",
};

describe("formatReport", () => {
    it("renders one row per group and the rate column only when a rate is given", () => {
        const withRate = formatReport({
            ...base,
            groups: PEER_GROUPS.map((group) => summarize(records, group, 800)),
            rate: 800,
        });
        expect(withRate).toContain(`| ${ARCHITECTS_GROUP} | 3 | €700 |`);
        expect(withRate).toContain(RATE_COLUMN.trim().slice(2));
        expect(withRate).toContain(rateColumnNote("€800"));
        const withoutRate = formatReport({
            ...base,
            groups: PEER_GROUPS.map((group) => summarize(records, group, null)),
            rate: null,
        });
        expect(withoutRate).not.toContain(RATE_COLUMN.trim().slice(2));
    });

    it("states the source, its holding and the counted window", () => {
        const report = formatReport({ ...base, groups: [], rate: null });
        expect(report).toContain(sourceLine(RATE_SOURCE, base.fetchedOn));
        const first = dayOf(records.at(-1)?.createdAt ?? 0);
        expect(report).toContain(holdingLine(base.statedUpdate, records.length, first, dayOf(NEWEST)));
        expect(report).toContain(countedLine(records.length, base.months));
        expect(dayOf(NEWEST)).toBe("2026-03-03");
    });

    it("words the entrypoint's refusals and its closing line", () => {
        expect(sourceAnswered(503)).toContain("503");
        expect(countMismatch(4, 3)).toContain("states 4 records and 3 were read");
        expect(reportWritten("r.md", 3, 4)).toContain("from 3 of 4 records");
    });
});
