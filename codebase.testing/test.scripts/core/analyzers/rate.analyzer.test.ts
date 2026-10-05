import { describe, expect, it } from "vitest";
import { summarize, withinMonths } from "@project/scripts/core/analyzers/rate.analyzer.ts";
import { ARCHITECTS_GROUP } from "@project/scripts/configuration/strings/rate.strings.ts";
import { PAGE } from "./rate.fixture.ts";
import { PEER_GROUPS } from "@project/scripts/configuration/constants/rate.constants.ts";
import { recordsIn } from "@project/scripts/core/selectors/rate.selector.ts";

const ARCHITECTS = PEER_GROUPS.find((group) => group.label === ARCHITECTS_GROUP);
const EVERY = PEER_GROUPS.find((group) => group.titles.length === 0);

describe("withinMonths and summarize", () => {
    it("keeps the records from the window before the newest one", () => {
        expect(withinMonths(recordsIn(PAGE), 24).map((record) => record.id)).toStrictEqual(["a", "b", "c"]);
    });

    it("summarizes a group by title and seniority and places a rate in it", () => {
        if (ARCHITECTS === undefined || EVERY === undefined) {
            throw new Error("the peer groups changed");
        }
        const records = recordsIn(PAGE);
        const architects = summarize(records, ARCHITECTS, 800);
        expect([architects.count, architects.median, architects.highest, architects.below]).toStrictEqual([
            3, 700, 900, 67,
        ]);
        expect(summarize(records, EVERY, null).count).toBe(4);
        expect(summarize([], EVERY, 800)).toMatchObject({ below: null, count: 0 });
    });
});
